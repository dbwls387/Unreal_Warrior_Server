# NaviWorks 기업연계 프로젝트

### 삼성청년 SW 아카데미

### 8기 부울경 2반 2팀

---

## 1. 프로젝트 배경

-   통제관은 전장 상황을 빠르게 파악하고 지시를 내릴 필요가 있습니다. 지형, 피아의 위치, 장비 상태 등과 같은 단편적인 정량적 정보는 획득이 가능하나, 이를 통해 전장의 상황을 분석하는 것은 규칙 기반으로 해결하기에는 한계점이 있습니다. 따라서 딥 러닝을 활용한 유동적인 분석을 통해 통제관이 지시를 내리는데 도움이 되도록 할 것입니다.

---

## 2. 프로젝트 목표

-   본 프로젝트는 딥러닝 기반으로 가상 환경 모의 전투 승률을 예측하는 프로그램을 개발합니다. UNREAL ENGINE 5 기반의 LYRA 게임에서 전투 데이터를 활용해 전략 수립에 도움을 주는 도구를 제공할 것입니다.
-   (1) 실시간으로 지형 정보, 피아의 위치, 시야 정보, 장비 상태, 체력 상태 등의 정량적인 정보를 수집하고 전황을 분석하여 전장의 유불리를 판단하는 모델을 생성합니다.
    (2) 실시간 전장 조감 기능, 실시간 전장 데이터 획득 기능, 분석 결과 전시 기능, 기본 교전 행동, 전장 데이터에 대한 유불리 분석 및 판단 기능, 판단에 따른 경로 추천 기능

---

## 3. 팀Unreal Warrior

### client

**팀장 김혜지**<br>
**팀원 반유진**<br>

-   언리얼엔진에서 유불리 판단에 필요한 정보를 추출
-   백엔드에 학습가능한 데이터셋 전달
-   분석된 승률과 액터 데이터를 웹에 표출

### BackEnd & ML

**팀원 권용진**<br>
**팀원 장시우**<br>
**팀원 정동섭**<br>

-   백엔드 API구현
-   전달받은 데이터로 머신러닝 학습모델 제작으로 승률분석
-   머신러닝 승률 정확도 분석

---

## 4. 기술 스택

<br />

### **Service**


![Generic badge](https://img.shields.io/badge/react-ffffff?style=for-the-badge&logo=react) ![Generic
badge](https://img.shields.io/badge/javascript-ffffff?style=for-the-badge&logo=javascript) ![Generic 
badge](https://img.shields.io/badge/python-ffffff?style=for-the-badge&logo=python) ![Generic
badge](https://img.shields.io/badge/tensorflow-ffffff?style=for-the-badge&logo=tensorflow) 

![Generic
badge](https://img.shields.io/badge/node.js-ffffff?style=for-the-badge&logo=node.js) 
![Generic
badge](https://img.shields.io/badge/unreal-000000?style=for-the-badge&logo=unrealengine)
![Generic
badge](https://img.shields.io/badge/c++-689df2?style=for-the-badge&logo=cpp)
![Generic
badge](https://img.shields.io/badge/jupyter-ffffff?style=for-the-badge&logo=jupyter)
<br />
<br />

**Infra**
<br />
![Generic
badge](https://img.shields.io/badge/aws-ffffff?style=for-the-badge&logo=amazon) 
![Generic
badge](https://img.shields.io/badge/nginx-000000?style=for-the-badge&logo=nginx)
![Generic
badge](https://img.shields.io/badge/jenkins-ffffff?style=for-the-badge&logo=jenkins)
![Generic
badge](https://img.shields.io/badge/docker-ffffff?style=for-the-badge&logo=docker)

<br />

**Team Collaboration Tool**
<br />
![Generic
badge](https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion)
![Generic
badge](https://img.shields.io/badge/gitlab-ffffff?style=for-the-badge&logo=gitlab)
![Generic
badge](https://img.shields.io/badge/jira-000000?style=for-the-badge&logo=jira)

<br />
 
---

## 5. 유사서비스분석

```PlainText
DeepMind의 AlphaStar는 스타크래프트 II에서 고수준의 전략을 만들어내는 인공지능 기반 플레이어입니다. AlphaStar는 실제 플레이어들의 전략을 모방하고, 강화학습을 통해 전략을 최적화했습니다. 이 사례를 통해 본 프로젝트에서도 비슷한 방법으로 데이터 수집과 학습을 진행할 수 있습니다. 단점으로는 복잡한 게임환경에서 급격한 변화에 대처하기 어려울 수 있으며, 이를 개선하기 위해 모델의 유연성을 높여야 합니다.
벤치마킹 사례를 활용하여 본 프로젝트에서는 다음과 같은 접근을 취합니다. 우선, 게임 내 전투 데이터를 수집하고, 기존 전략을 분석하여 딥러닝 모델에 적용합니다. 그 다음, 강화학습과 셀프 플레이를 통해 전략을 지속적으로 개선하고 최적화합니다. 복잡한 게임환경과 변화에 대처할 수 있는 유연한 모델 구조를 도입하여 성능 향상을 꾀합니다. 마지막으로, 프로젝트의 규모와 목표에 맞춰 컴퓨팅 자원을 효율적으로 활용하여 효과적인 결과를 도출할 것입니다.
```

---

## 6. 기능설명
### ✔ 메인페이지
![main5](https://github.com/acrnm148/COSMOS/assets/87971876/581410b6-68d5-4a56-904f-382cff3676b8)

### ✔ 캐릭터 카메라
![main3](https://github.com/acrnm148/COSMOS/assets/87971876/5b3cff96-4030-4556-b11e-3c927739767c)

### ✔ 플레이어 추천경로
![main2](https://github.com/acrnm148/COSMOS/assets/87971876/68670504-3f7f-4a7a-937c-e7f7fcc48938)

### ✔ 플레이어 전체 진행상황
![main1](https://github.com/acrnm148/COSMOS/assets/87971876/fc91d992-eeeb-4aa1-b519-88d10f0d4282)

### ✔ 게임 일시정지
![main4](https://github.com/acrnm148/COSMOS/assets/87971876/c5ccd924-d29a-4cd6-b1eb-75f2e19dcb6e)

