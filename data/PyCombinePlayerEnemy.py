import traceback
# x, y, hp, status 16개씩 기록 후 teamScore 2개 추가 기록

date = input('오늘 날짜를 입력하세요 ex) 0504 : ')
# =========================

edf = open('./EnemyData.txt', 'r')
df = open('./PlayerData.txt', 'r')

# 전체 데이터 
# idx,teamScore,hp,x,y,z,status,validShoot,enemyInSight
IDX = 0
TEAMSCORE = 1
HP = 2
X = 3
Y = 4
Z = 5
STATUS = 6
VALIDSHOOT = 7
ENEMYINSIGHT = 8

rawDataDF = [line.rstrip().split(',') for line in df.readlines()]       # player data
rawDataEDF = [line.rstrip().split(',') for line in edf.readlines()]     # enemy data

numOfPlayer = 8                 # 플레이어 수
numOfParmPerCharacter = 4       # 플레이어 당 input 변수의 개수

for target in [rawDataDF, rawDataEDF]:
    
    inputDatas = []         # 전처리 한 input data
    outputDatas = []        # 전처리 한 label data
    howMany = 0             # 게임 한 횟수
    idx = 0
    while True:
        # 맨 처음 캐릭터들의 번호 데이터 수집
        tmpTXT = ''         # 한 게임 동안의 데이터를 저장할 변수

        try:
            teamScore = 0.0     # 팀 점수 (몇 명 죽였는지)
            while True:
                # 만약 승패 판정 났으면 중지
                if len(target[idx]) <= 1:
                    # output data 추가
                    if len(target[idx]) == 1:
                        outputDatas.append(target[idx][0])
                    howMany += 1
                    idx += 1
                    break
                
                # 판정 안났으면 tmpTXT에 데이터에 추가
                tmp4TXT = [f'0.0,' * numOfParmPerCharacter] * numOfPlayer       # tmpTXT에 넣을 텍스트. 단위시간마다 1줄씩 저장하기 위해 사용
                isChecked = [False] * numOfPlayer                               # 이미 나온 적 있는 번호인지 판단. 이미 나온 적 있으면, 다음 단위시간 때 처리
                teamScore = target[idx][TEAMSCORE]                              # 팀 점수 저장할 변수
                
                for i in range(numOfPlayer):
                    # 게임이 끝났으면
                    if len(target[idx]) <= 1:
                        break
                    tmpIdx = int(target[idx][0]) % 8
                    # 이미 나온 적 있는 번호면, 다시 처음부터 (즉, 누군가 죽어서 데이터가 조금 적게 쌓였으면)
                    if isChecked[tmpIdx]:
                        break
                    # 아니면, tmp4TXT에 데이터저장
                    tmp4TXT[tmpIdx] = f"{target[idx][X]},{target[idx][Y]},{target[idx][HP]},{1.0 if target[idx][STATUS] else -1.0},"
                    isChecked[tmpIdx] = True
                    idx += 1
                
                # 마지막엔 outputData에 추가
                for i in range(numOfPlayer):
                    tmpTXT += tmp4TXT[i]
                
                # 각 시간별로 팀 스코어 및 줄 추가
                tmpTXT += f'{teamScore},\n'
                
            inputDatas.append(tmpTXT)       # 한 게임 데이터 추가
            # 전체 데이터가 끝나면, 반복문 종료
            if idx >= len(target) or len(target[idx]) == 0:
                break
            tmpTXT = f"{tmpTXT},\n"

        # 에러 처리
        except Exception as err:
            print(idx, '줄에서 에러 발생')
            print(traceback.format_exc())
            print('tmpidx: ', tmpIdx)
            print('plyaer다' if target == rawDataDF else 'enemy다')
            break

    # 마지막으로 데이터 저장
    fileName = 'PlayerInput.txt' if target == rawDataDF else 'EnemyInput.txt'

    with open(fileName, 'w', encoding='utf-8') as f:
        for input in inputDatas:
            f.write(input + '\n')
    # PlayerData를 기준으로 output data 만들기
    if target == rawDataDF:
        # 0이면 아군 패배, 1이면 아군 승리, 2면 무승부
        with open(f'./data_for_jupyter/data_per_date/output_{date}.txt', 'w', encoding='utf-8') as ff:
            for output in outputDatas:
                ff.write(output + "\n")
        ff.close()
    print(howMany, '번의 게임 발생')

f.close()
df.close()
edf.close()

# =========================


# 위에서 처리한 적/아군 txt 파일들을 하나로 합치는 코드

df = open('./PlayerInput.txt', 'r')
edf = open('./EnemyInput.txt', 'r')

rawDataDF = [line.rstrip() for line in df.readlines()]      # player data
rawDataEDF = [line.rstrip() for line in edf.readlines()]    # enemy data
result = []        # 전처리 한 label data

idxP = 0        # player data의 인덱스
idxE = 0        # enemy data의 인덱스

while idxP < len(rawDataDF) and idxE < len(rawDataEDF):
    # 둘 다 없으면, 다음줄로
    if not rawDataDF[idxP] and not rawDataEDF[idxE]:
        # 맨 마지막 줄은 쉼표 빼고, \n 추가
        result[-1] = result[-1].rstrip(',')
        result.append('\n')
        idxP += 1
        idxE += 1
    # 둘 다 있으면, 저장
    elif rawDataDF[idxP] and rawDataEDF[idxE]:
        result.append(rawDataDF[idxP] + rawDataEDF[idxE])
        idxP += 1
        idxE += 1
    # 아군만 있으면, 적군 데이터 전부 0.0으로 만들어 저장
    elif rawDataDF[idxP] and not rawDataEDF[idxE]:
        result.append(rawDataDF[idxP] + '0.0,' * numOfParmPerCharacter * numOfPlayer)
        idxP += 1
    # 적군만 있으면, 아군 데이터 전부 0.0으로 만들어 저장
    else:
        result.append('0.0,' * numOfParmPerCharacter * numOfPlayer + rawDataEDF[idxE])
        idxE += 1
        
# 마지막으로 데이터 저장
with open(f'./data_for_jupyter/data_per_date/input_{date}.txt', 'w', encoding='utf-8') as f:
    for line in result:
        f.write(line)

f.close()
df.close()
edf.close()