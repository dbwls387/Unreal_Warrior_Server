N = int(input('N을 입력하세요 : '))                 # 데이터 쌍의 개수
date = input('날짜를 입력하세요. ex)0504 : ')       # 해당 데이터들의 날짜

# 원본 데이터에서 맨 마지막 게임이 도중에 잘린 경우, 해당 정보 제거
for target in ['EnemyData', 'PlayerData']:
    # N쌍에 대하여 순회
    for i in range(N):
        df = open(f'./raw_data/{date}/{target}{i}.txt')
        data = [line.rstrip() for line in df.readlines()]
        
        last_line = 0           # 결과가 있는 게임의 마지막 줄을 저장할 변수
        for line in range(len(data)):
            if len(data[line]) == 1:
                last_line = line
        # 데이터 갱신 (덮어쓰기)
        with open(f'./raw_data/{date}/{target}{i}.txt', 'w', encoding='utf-8') as f:
            for line in range(last_line + 1):
                f.write(data[line])
                if line != last_line:
                    f.write('\n')
                    
# 여러 데이터들을 하나의 데이터로 합침
with open('EnemyData.txt', 'w') as f:
    for i in range(N):
        with open(f'./raw_data/{date}/EnemyData{i}.txt') as input:
            f.write(input.read())
            f.write('\n')

with open('PlayerData.txt', 'w') as f:
    for i in range(N):
        with open(f'./raw_data/{date}/PlayerData{i}.txt') as input:
            f.write(input.read())
            f.write('\n')