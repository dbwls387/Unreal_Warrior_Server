
idf = open(f'./data_for_jupyter/input_combine.txt', 'r')
odf = open(f'./data_for_jupyter/output_combine.txt', 'r')

idfData = [line.rstrip().split(',') for line in idf.readlines()]        # input data
odfData = [line.rstrip().split(',') for line in odf.readlines()]        # output data

savedInput = []     # 비정상 데이터 제거 후, 정상 데이터만 저장할 list
savedOutput = []    # 비정상 데이터 제거 후, 정상 데이터만 저장할 list

# 비정상적인 데이터 제거
for i in range(len(idfData)):
    # input의 수가 66개로 나누어떨어지면서, 길이가 62*66개 이하인 데이터만 저장
    if not len(idfData[i]) % 66 and len(idfData[i]) <= 62*66:
        savedInput.append(idfData[i])
        savedOutput.append(odfData[i])

# 최종 input 저장
with open(f'./data_for_jupyter/input_final_data.txt', 'w', encoding='utf-8') as f:
    for line in savedInput:
        f.write(','.join(map(str, line)) + '\n')
# 최종 output 저장
with open(f'./data_for_jupyter/output_final_data.txt', 'w', encoding='utf-8') as f:
    for line in savedOutput:
        f.write(','.join(map(str, line)) + '\n')

print(f'원래 데이터 {len(idfData)}개, 가공 후 데이터 {len(savedInput)}개, 제거한 데이터 {len(idfData) - len(savedInput)}개')
