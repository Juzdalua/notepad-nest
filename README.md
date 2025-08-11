# Create Redis Container
docker run -d --name redis-server -p 6379:6379 redis:7
docker exec -it redis-server redis-cli

# Start Redis
docker update --restart unless-stopped redis-server

# Start NestJS
docker-compose down
docker-compose up --build

# Debug
"dev:debug": "npm run build && DEBUG=app:* tsc-watch -p tsconfig.json --onSuccess \"node -r tsconfig-paths/register --inspect=19229 dist/src/main.js\"",

1. DEBUG=app:*
npm i debug 
app: 네임스페이스로 시작하는 모듈에 debug 로그 출력
ex) debug('app:service')('message')

2. tsc-watch
-p tsconfig.json -> tsconfig 설정으로 컴파일

3. --onSuccess "node..."
tsc-watch 컴파일 성공시 실행할 명령어

4. node -r tsconfig-paths/register
node 실행시 -r <module> -> 해당 모듈을 사전 로드
tsconfig-paths/register -> tsconfig.json의 paths 설정을 런타임에서 인식

5. --inspect=19229
19229 port를 열어서 디버그 모드 활성화