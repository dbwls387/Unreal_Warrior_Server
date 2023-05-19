# 합치고싶은 데이터들의 날짜를 dates에 입력
dates = ['0516']

for target in ['input', 'output']:
    datas = []              # 모든 데이터들을 저장할 list
    for date in dates:
        f = open(f'./data_for_jupyter/data_per_date/{target}_{date}.txt', 'r')
        
        for line in f.readlines():
            datas.append(line)
        
    with open(f'./data_for_jupyter/{target}_combine.txt', 'w', encoding='utf-8') as ff:
        for line in datas:
            ff.write(line)
