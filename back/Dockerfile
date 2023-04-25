# 부모 이미지 지정
FROM node:18
# yarn 설치
RUN npm install -g yarn
# 작업 디렉토리 생성
WORKDIR /usr/src/app
# 의존성 설치
COPY package*.json ./
RUN yarn
# 소스 추가
COPY . .
# 포트 매핑
EXPOSE 8080
# 실행 명령
CMD [ "node", "app.js" ]