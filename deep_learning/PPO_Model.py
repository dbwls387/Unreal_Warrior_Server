import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import tensorflow_probability as tfp
import scipy.signal
import math
import socketio
import eventlet
from eventlet import wsgi
import time

# https://keras.io/examples/rl/ppo_cartpole/ 참조

# 소켓 통신을 위한 코드
sio = socketio.Server()
app = socketio.WSGIApp(sio)
# 스레드 lock으로 스레드 접근 시의 충돌 방지
isConnected_lock = eventlet.semaphore.Semaphore()
isStateReceived_lock = eventlet.semaphore.Semaphore()
stateData_lock = eventlet.semaphore.Semaphore()
# 이벤트가 발생할 때까지 대기하도록 하는 변수
isConnected = False
isStateReceived = False

# 로컬에서 소켓 통신을 위한 서버 열기
# sid : session ID
@sio.event
def connect(sid, environ):
    with isConnected_lock:
        global isConnected
        isConnected = True

@sio.event
def disconnect(sid):
    with isConnected_lock:
        global isConnected
        isConnected = False

# 이벤트 처리 함수를 정의. 언리얼에서 보낸 데이터를 수신.
stateData = None        # 언리얼에서 받은 데이터 (state, action, reward, done)를 저장할 변수
@sio.on('on_state')
def on_state(sid, data):
    # 게임으로부터 받은 상태 데이터를 처리
    state = np.array(data['data'][0]['state'])
    action = np.array(data['data'][0]['action'])
    reward_state = np.array(data['data'][0]['reward'])
    done = np.array(data['data'][0]['done'])

    # reward 는 팀 A를 기준으로 여태까지 받은 보상을 계산. 팀 B는 학습 직전에 -1 곱할 예정
    reward = 0
    for i in range(8):
        # 아군 체력만큼 보상 +, 적군 체력만큼 보상 -
        reward += -800.0 + reward_state[i] + 800.0 - reward_state[i+8]
        # 아군 죽으면 -200, 적군 죽으면 +200
        if math.isclose(reward_state[i], 0.0):
            reward -= 200
        if math.isclose(reward_state[i+8], 0.0):
            reward += 200
    # 게임 승리하면 +400
    if done == 2:
        reward += 400
    if done == 3:
        reward -= 400
    # state 정보 변경
    with stateData_lock:
        global stateData
        stateData = (state, action, reward, done)
        
    with isStateReceived_lock:
        global isStateReceived 
        isStateReceived = True    

# 게임 초기 상태로 만들었을 때의 state 정보 받아오기
@sio.on('on_reset')
def on_reset(sid, data):
    state = np.array(data['data'][0]['state'])
    action = np.array(data['data'][0]['action'])
    reward_state = np.array(data['data'][0]['reward'])
    done = np.array(data['data'][0]['done'])
        
    with stateData_lock:
        global stateData
        stateData = (state, action, 0, done)
    
    with isStateReceived_lock:
        global isStateReceived 
        isStateReceived = True

# 하이퍼파라미터
steps_per_epoch = 800
epochs = 30
gamma = 0.99
clip_ratio = 0.2
policy_learning_rate = 3e-4
value_function_learning_rate = 1e-3
train_policy_iterations = 80
train_value_iterations = 80
lam = 0.97
target_kl = 0.01
hidden_sizes = (128, 128)
# state, episode return, episode length 초기화
state, episode_return, episode_length = None, 0, 0

class Agent(object):
    def __init__(self, team):

        self.state_dimensions = 8*4*2           # actor model 의 input node 개수
        self.num_actions = 8*4                  # actor model 의 output node 개수
        self.team = team
        self.action_prob = None                 # output node의 정보를 가공하여, policy에 보낼 데이터 만들 변수
        self.reward = 0

        # buffer 초기화
        self.buffer = Buffer(self.state_dimensions, steps_per_epoch, team=self.team)

        # actor, critic 초기화
        self.state_input = keras.Input(shape=(self.state_dimensions,), dtype=tf.float32)
        self.logits = self.mlp(self.state_input, list(hidden_sizes) + [self.num_actions], tf.sigmoid, None)
        self.actions = self.mlp(self.state_input, list(hidden_sizes) + [self.num_actions], tf.sigmoid, None)
        self.actor = keras.Model(inputs=self.state_input, outputs=self.logits)
        self.value = tf.squeeze(
            self.mlp(self.state_input, list(hidden_sizes) + [1], tf.tanh, None), axis=1
        )
        self.critic = keras.Model(inputs=self.state_input, outputs=self.value)

        # policy, value function optimizers 초기화
        self.policy_optimizer = keras.optimizers.Adam(learning_rate=policy_learning_rate)
        self.value_optimizer = keras.optimizers.Adam(learning_rate=value_function_learning_rate)
        
    # 액터 네트워크의 출력 로짓에 따라 조치를 취하는 로그 확률을 계산
    def logprobabilities(self, logits, a):
        logprobabilities_all = tf.nn.log_softmax(logits)
        logprobability = tf.reduce_sum(
            tf.one_hot(a, self.num_actions) * logprobabilities_all, axis=1
        )
                
        return logprobability
    
    # mlp 모델 (레이어, 활성화함수 등)
    def mlp(self, x, sizes, activation=tf.tanh, output_activation=None):
        # Build a feedforward neural network
        for size in sizes[:-1]:
            x = layers.Dense(units=size, activation=activation)(x)
        return layers.Dense(units=sizes[-1], activation=output_activation)(x)

    # 주어진 관찰에 따라 액터 네트워크에서 작업을 샘플링
    # send_policy에 보낼 데이터를 만드는 함수
    @tf.function
    def sample_action(self, state):
        logits = self.actor(state)
        action_prob = tf.sigmoid(logits)
        dist = tfp.distributions.Bernoulli(probs=action_prob)
        action = dist.sample()
        return logits, action


    #  PPO-Clip 목표를 최대화하여 정책(액터) 네트워크를 train. 어드밴티지 버퍼와 작업의 로그 확률을 사용하여 정책 손실을 계산
    @tf.function
    def train_policy(
        self, state_buffer, action_buffer, logprobability_buffer, advantage_buffer
    ):
        # 학습을 위한 코드
        with tf.GradientTape() as tape:
            # 액터 모델을 사용해 현재 state에서의 행동을 예측
            predicted_actions = self.actor(state_buffer)
            # 예측된 행동의 로그 확률을 계산
            probabilities_new  = tf.exp(
                tf.nn.sigmoid_cross_entropy_with_logits(labels=action_buffer, logits=predicted_actions)
                - logprobability_buffer
            )
            
            # 새로운 행동과 이전 행동의 로그 확률의 비율을 계산
            probabilities_old = tf.exp(logprobability_buffer)
            ratio = probabilities_new / probabilities_old
            
            # advantage_buffer 의 shape를 (800, 1) 형태로 변경
            advantage_buffer = tf.reshape(advantage_buffer, (-1, 1))
            # 클리핑된 어드밴티지 값을 계산
            min_advantage = tf.where(
                advantage_buffer > 0,
                (1 + clip_ratio) * advantage_buffer,
                (1 - clip_ratio) * advantage_buffer,
            )
            # policy_loss 계산.
            policy_loss = -tf.reduce_mean(
                tf.minimum(ratio * advantage_buffer, min_advantage)
            )
            
        # policy loss에 대한 그래디언트를 계산하고, 액터 모델의 weight를 업데이트.
        policy_grads = tape.gradient(policy_loss, self.actor.trainable_variables)
        self.policy_optimizer.apply_gradients(zip(policy_grads, self.actor.trainable_variables))
        
        # KL divergence를 계산. (정책이 얼마나 변했는지를 측정하는 지표)
        kl = tf.reduce_mean(
            logprobability_buffer
            - tf.nn.sigmoid_cross_entropy_with_logits(labels=action_buffer, logits=predicted_actions)
        )
        kl = tf.reduce_sum(kl)
        return kl

    # 예측 값과 실제 수익 사이의 평균 제곱 오차에 대한 회귀를 수행하여 가치 함수(비판) 네트워크를 train. 
    @tf.function
    def train_value_function(self, state_buffer, return_buffer):
            with tf.GradientTape() as tape:
                value_loss = tf.reduce_mean((return_buffer - self.critic(state_buffer)) ** 2)
            value_grads = tape.gradient(value_loss, self.critic.trainable_variables)
            self.value_optimizer.apply_gradients(zip(value_grads, self.critic.trainable_variables))

    # 학습한 모델 저장
    def save_model(self, path):
        self.actor.save(path + '_actor.h5')
        self.critic.save(path + '_critic.h5')
    # 모델 불러오기
    def load_model(self, path):
        self.actor = tf.keras.models.load_model(path + '_actor.h5')
        self.critic = tf.keras.models.load_model(path + '_critic.h5')


# 함수, 클래스
# 각 actor에 대한 확률 출력하는 클래스
class PolicyNetwork(tf.keras.Model):
    def __init__(self, n_inputs, n_outputs):
        super(PolicyNetwork, self).__init__()
        self.fc = tf.keras.layers.Dense(n_outputs)

    def call(self, x):
        return tf.keras.activations.sigmoid(self.fc(x))

# 주어진 시퀀스의 할인된 누적 합계를 계산. "Rewards-to-go" (미래 보상) 을 계산하기 위해 사용됨.
def discounted_cumulative_sums(x, discount):
    return scipy.signal.lfilter([1], [1, float(-discount)], x[::-1], axis=0)[::-1]

# 에이전트-환경 상호 작용의 궤적을 저장하는 버퍼를 정의
# 관찰, 행동, 보상, 값 및 로그 확률을 저장하는 방법과 이점 추정치 및 진행 보상을 계산하여 궤적을 마무리하는 방법이 포함
class Buffer:
    def __init__(self, state_dimensions, size, gamma=0.99, lam=0.95, team='A'):
        self.state_buffer = np.zeros(
            (size, state_dimensions), dtype=np.float32
        )
        self.num_actions = 8*4
        self.action_buffer = np.zeros((size, self.num_actions), dtype=np.float32)
        self.advantage_buffer = np.zeros(size, dtype=np.float32)
        self.reward_buffer = np.zeros(size, dtype=np.float32)
        self.return_buffer = np.zeros(size, dtype=np.float32)
        self.value_buffer = np.zeros(size, dtype=np.float32)
        self.logprobability_buffer = np.zeros((size, self.num_actions), dtype=np.float32)
        self.gamma, self.lam = gamma, lam
        self.pointer, self.trajectory_start_index = 0, 0
        
    #  환경과 에이전트의 단일 상호 작용을 저장함. state, action, reward, value(critic model이 추정), 취한 행동의 확률을 인수로 받아 각각의 버퍼에 저장
    def store(self, state, action, reward, value, logprobability):
        action = np.reshape(1, -1)
    
        self.state_buffer[self.pointer] = state
        self.action_buffer[self.pointer] = action
        self.reward_buffer[self.pointer] = reward
        self.value_buffer[self.pointer] = value
        self.logprobability_buffer[self.pointer] = logprobability
        self.pointer += 1

    # 에피소드가 종료될 때, 보상 및 advantage 추정을 계산. 
    # last_value는 critic 모델의 최종 state 추정 값. 갈 보상과 이점은 discounted_cumulative_sums 함수를 사용하여 계산
    def finish_trajectory(self, last_value=0):
        # advantage 추정값과 미래 보상을 계산
        path_slice = slice(self.trajectory_start_index, self.pointer)
        rewards = np.append(self.reward_buffer[path_slice], last_value)
        values = np.append(self.value_buffer[path_slice], last_value)

        deltas = rewards[:-1] + self.gamma * values[1:] - values[:-1]

        self.advantage_buffer[path_slice] = discounted_cumulative_sums(
            deltas, self.gamma * self.lam
        )
        self.return_buffer[path_slice] = discounted_cumulative_sums(
            rewards, self.gamma
        )[:-1]

        self.trajectory_start_index = self.pointer

    # 에피소드가 끝나고 에이전트가 저장된 데이터에서 학습할 준비가 된 후에 호출.
    # 계산된 이점을 정규화하고 정책 및 가치 함수를 교육하기 위해 저장된 모든 데이터를 반환합
    def get(self):
        # buffer 데이터 불러오기, advantages 정규화
        self.pointer, self.trajectory_start_index = 0, 0
        advantage_mean, advantage_std = (
            np.mean(self.advantage_buffer),
            np.std(self.advantage_buffer),
        )
        self.advantage_buffer = (self.advantage_buffer - advantage_mean) / (advantage_std + 1e-8)
        return (
            self.state_buffer,
            self.action_buffer,
            self.advantage_buffer,
            self.return_buffer,
            self.logprobability_buffer,
        )




# 학습
# GameManger 에서 state 받아오고, 양쪽의 모델에 대해 1회 학습 명령
class GameManager:
    global isStateReceived

    def __init__(self):
        self.agentA = Agent("A")
        self.agentB = Agent("B")
        self.player_num = 8
        self.state_per_player = 4
        self.state_size = 8*2*4
        self.action_per_player = 4
        self.action_size = 8*4  # 아군 8명에 대해 이동여부, 사격여부, 이동x, 이동y
        self.value_size = 1   
       
    # 언리얼에 보낼 데이터 형태 꼴로 맞추기
    def send_policy(self, action_prob_A, action_prob_B, state_data):
        policy_data = []    # 언리얼에 전송할 dict 데이터
        action_prob_A, action_prob_B = action_prob_A[0], action_prob_B[0]
        for action_prob_idx in range(2):
            action_prob = [action_prob_A, action_prob_B][action_prob_idx]
            # 예측 결과 구하기
            for i in range(self.player_num):
                start_point = i * self.state_per_player
                policy_move = 1 if action_prob[start_point].numpy() > 0.5 else 0
                direction = np.argmax(action_prob[start_point+1:start_point+9]) * 45.0   # 어느 방향으로 이동할지.
                
                # 적군이면 i 에 8 더하기
                idx = i + 8*action_prob_idx
                # 방향이 정해졌으니, 캐릭터의 현재 위치에서 해당 방향으로 6m만큼 더하기.
                policy_character_x = state_data[0][idx*4] + 600 * math.sin(math.radians(direction))
                policy_character_y = state_data[0][idx*4+1] + 600 * math.cos(math.radians(direction))
                policy_data.append({'idx': idx, 'move': policy_move, 'x' : policy_character_x, 'y' : policy_character_y})
        sio.emit('send_policy', {'data': policy_data})
        
    def train(self):
        # 만약 이미 학습한 모델을 다시 retrain 시킬 경우, 아래 주석 풀기
        # self.agentA.load_model('saved_model/agentA')
        # self.agentB.load_model('saved_model/agentB')
                
        # 각 게임 별
        for epoch in range(epochs):
            print(f'{epoch} 번째 게임 시작')
            global isStateReceived, episode_return, episode_length
            # 각 epoch마다 초기화
            sum_return = 0
            sum_length = 0
            num_episodes = 0            

            # 연결 안되어 있으면, 연결될 때까지 대기
            while True:
                with isConnected_lock:
                    if isConnected:
                        break
                eventlet.sleep(0.1)
            eventlet.sleep(2)
            # reset 요청하고, 데이터 올 때까지 대기
            print('reset 요청')
            sio.emit('request_reset')
            while True:
                with isStateReceived_lock:
                    if isStateReceived:
                        isStateReceived = False
                        break
                eventlet.sleep(0.1)
            # 언리얼 map load 하는 데 10초 정도 걸림
            eventlet.sleep(15)
                  
            # 게임 정보 받아오기
            with stateData_lock:
                state, action, reward, done = stateData
                
            # 단위시간마다 학습 진행
            count = 0
            while not done:
                print(f'{epoch} 번째 게임 {count} 번째 시간 학습')
                count += 1
                
                # 정보 받아오고, 예상 action 계산하기
                state = state.reshape(1, -1)
                action = action.reshape(1, -1)
                self.agentA.logits, self.agentA.action_prob = self.agentA.sample_action(state)
                self.agentB.logits, self.agentB.action_prob = self.agentB.sample_action(state)
                # 언리얼에 데이터 보내기
                self.send_policy(self.agentA.action_prob, self.agentB.action_prob, state)
                
                # 언리얼에서 state 받아올 때까지 대기
                while True:
                    with isStateReceived_lock:
                        if isStateReceived:
                            isStateReceived = False
                            break
                    eventlet.sleep(0.1)
                
                # 각 모델에 보상 제공
                state_new, action, reward, done = stateData
                episode_return, reward = reward, reward - episode_return
                episode_length += 1
                self.agentA.reward = reward
                self.agentB.reward = reward * (-1)
                
                # 각 모델 별 게임의 정보 별도 저장
                for agent in [self.agentA, self.agentB]:
                    value_t = agent.critic(state)
                    logprobability_t = agent.logprobabilities(agent.logits, action)
                    
                    agent.buffer.store(state, action, reward, value_t, logprobability_t)

                # state 갱신
                state = state_new
                
            # 게임이 끝나면
            for agent in [self.agentA, self.agentB]:
                last_value = 0 if done else agent.critic(state.reshape(1, -1))
                agent.buffer.finish_trajectory(last_value)
                sum_return += episode_return
                sum_length += episode_length
                num_episodes += 1
                state, episode_return, episode_length = None, 0, 0

                (
                    agent.buffer.state_buffer,
                    agent.buffer.action_buffer,
                    agent.buffer.advantage_buffer,
                    agent.buffer.return_buffer,
                    agent.buffer.logprobability_buffer,
                ) = agent.buffer.get()

                # 정책 학습
                for _ in range(train_policy_iterations):
                    agent.train_policy(
                        agent.buffer.state_buffer, agent.buffer.action_buffer, agent.buffer.logprobability_buffer, agent.buffer.advantage_buffer
                    )


                # value function 갱신
                for _ in range(train_value_iterations):
                    agent.train_value_function(agent.buffer.state_buffer, agent.buffer.return_buffer)
                
                # policy 갱신, KL divergence가 크면 멈추기
                for _ in range(train_policy_iterations):
                    kl = agent.train_policy(
                        agent.buffer.state_buffer, agent.buffer.action_buffer, agent.buffer.logprobability_buffer, agent.buffer.advantage_buffer
                    )
                    if kl > 1.5 * target_kl:
                        break
                
                print(
                    f" Epoch: {epoch + 1}. Mean Return: {sum_return / num_episodes}. Mean Length: {sum_length / num_episodes}"
                )
                
                # 모델 저장
                agent.save_model(f'saved_model/agent{agent.team}')
                
if __name__ == "__main__":    # 서버를 시작하고, 웹 서버와 같은 포트를 사용합니다.

    # 우선 train 실행. 이후 소켓 연결될 때마다 학습 진행
    gameManager = GameManager()
    eventlet.spawn(gameManager.train)
    eventlet.wsgi.server(eventlet.listen(('', 8081)), app)
