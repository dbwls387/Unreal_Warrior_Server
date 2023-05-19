# 딥러닝

필요한 라이브러리는 `requirements.txt` 참조





### 지도학습

`GRU_model.ipynb`, `LSTM_model.ipynb`

- LSTM 모델 및 GRU 모델을 사용

- unreal에서의 데이터 수집 후, `Data` 폴더의 readme 내용대로 전처리 실행
- 그렇게 얻은 `input_final_data`, `output_final_data`를 원하는 이름으로 변경, 이후 현재 폴더에 `GameData` 폴더를 만들어서 그 안에 저장.
- 이후 `GRU_model.ipynb`, `LSTM_model.ipynb` 파일을 실행



### 강화학습

`PPO_model.ipynb`

준비

- unreal 프로젝트에서 `RLmap` level을 열고, 아래의 사항을 수행
  1. Player, Enemy 변수에서 Path Point (Variable) > default >  Player는 Path Point, Enemy는 Path Point2로 설정
  2. BT_Player, BT_Enemy 에서 5개의 시퀀스 중 좌측 두 개 시퀀스만 남기고 제거
- 이후 `RLmap`을 viewport에서 실행하고, 맵이 로딩되면 강화학습 코드 `PPO_model.py`를 실행.
- (강화학습이 끝나면, 앞서 수정한 것들을 되돌려야 기존 게임이 정상적으로 작동합니다.)

