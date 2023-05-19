# 데이터에 가끔씩 output이 여러 번 출력되는 경우가 있음. 해당 문제 해결

for target in ['./EnemyData.txt', './PlayerData.txt']:
    idxs = []
    tmp_data = open(target, 'r')                        # 데이터 읽기
    tmp_list = [line for line in tmp_data.readlines()]  # 데이터를 list로 저장
    # 데이터 덮어쓰기
    with open(target, 'w', encoding='utf-8') as f:
        idx = 0
        while idx < len(tmp_list):
            if idx > 0 and len(tmp_list[idx]) == 2 and len(tmp_list[idx-1]) == 2:
                idxs.append(idx)
                pass
            else:
                f.write(tmp_list[idx])
            idx += 1
            
        print('중복된 줄들 :', idxs)