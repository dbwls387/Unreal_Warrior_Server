# 데이터 처리 과정

1. unreal 에서 얻은 데이터를 `raw_data/{오늘 날짜. ex. 0515}` 폴더에 저장한다. 저장 시 이름은 `PlayerData0`부터 시작하며, 데이터가 여러 개인 경우 뒤의 숫자를 1씩 늘려간다.
2. 이후 순서대로 아래 파일들을 실행한다.
   - `PyRawCombine.py`
   - `PyDeleteDuplicatedOutput.py`
   - `PyCombinePlayerEnemy.py`
   - `PyCombineJupyterData.py`
   - `PyFindProblems.py`

3. 이후 `data_for_jupyter` 안의 생성된 `input_final_data.txt`, `output_final_data.txt` 파일을 활용하여 딥러닝을 학습시켰다.



### 폴더 설명

`raw_data`

- unreal 게임 내에서 수집한 데이터들을 날짜 (ex.`0515`) 명으로 된 폴더 안에 저장한다. 이 때 각 데이터들은 반드시 `EnemyData0` 형태로, `EnemyData` 뒷부분에 숫자를 넣어 구분한다.

`data_for_jupyter`

- jupyter 에서의 학습에 사용될 데이터를 저장하는 폴더.
- 내부 폴더에 `data_x,y,hp,status,score`는 게임 내의 (x좌표, y좌표, 체력, 교전여부, 팀 전체 점수) 가 포함된 데이터를 가지고 있다.





### python 파일 설명

`PyRawCombine.py`

- raw_data 안의 여러 데이터들을 하나의 `EnemyData.txt`, `PlayerData.txt` 파일로 합치는 코드.
- 입력값 `N`은 `EnemyData`와 `PlayerData` 쌍의 개수
  - 만약 `EnemyData0`, `EnemyData1`, `PlayerData0`, `PlayerData1` 의 데이터가 `0516` 폴더 안에 있으면, `N` = `2`, `날짜` = `0516`를 입력하면 된다.
- 합치기 전, 게임이 도중에 끝난 경우의 데이터는 제거함.
- 실행 후에는 최상단 폴더에 `EnemyData.txt`, `PlayerData.txt`가 생성됨



`PyDeleteDuplicatedOutput.py`

- unreal 코드에서 특정 이유로 같은 output이 여러번 출력되는 경우가 존재.
- 해당 이슈를 제거하는 코드
- 실행 후에는 `EnemyData.txt`, `PlayerData.txt` 가 중복 데이터를 제거한 형태로 갱신된다.



`PyCombinePlayerEnemy.py`

- `EnemyData.txt` 와 `PlayerData.txt` 파일을 합쳐서 `EnemyInput.txt`, `PlayerInput.txt`를 만들고, 폴더 `data_for_jupyter/data_per_date` 안에 `input_{날짜}.txt`, `output_{날짜}.txt` 파일을 만드는 코드
- `EnemyInput.txt` 파일은 단위시간마다 1줄씩, 팀원 전체의 데이터를 저장한다.
- `input_{날짜}.txt` 파일은 한 게임마다 1줄씩, 게임 전체의 데이터를 저장한다.
- 실행 후에는 `data_for_jupyter/date` 안에 `input_{date}.txt`, `output_{date}.txt` 파일이 생성된다.



`PyCombineJupyterData.py`

- 여러 개의 `input_{날짜}.txt` 데이터들을 `input_final_data.txt` 파일로 합치는 데이터
- 실행 전, 해당 파일 안의 `dates` 리스트에, 합치고 싶은 데이터들의 날짜를 직접 입력할 것
- 실행 후에는 `data_for_jupyter` 안에 `input_combine.txt`, `output_combine.txt` 파일이 생성된다.



`PyFindProblems.py`

- 이상한 데이터들을 제거하는 코드
- 현재로서는 
  - EnemyData와 PlayerData의 단위 시간 개수가 다른 경우 제거
  - 단위시간이 정상 횟수 (62회) 보다 많은 경우 제거
- 실행 후에는 `data_for_jupyter` 안에 `input_final_data.txt`, `output_final_data.txt` 파일이 생성된다.
