# project-temperature
# temp_info_ver2

<!-- nodemon server app.js 실행 -->
cd server/
nodemon app.js

<!-- npm App.js 실행 -->
cd client/
npm start

<!-- monggoDB 실행 -->
cd "C:\Program Files\MongoDB\Server\7.0\bin"
mongod

## mongosh 사용방법
1. MongoDB Shell 실행: 명령 프롬프트나 PowerShell에서 mongosh를 실행하세요. 이렇게 하면 MongoDB Shell이 시작됩니다.

2. 데이터베이스에 연결: 로컬 MongoDB 인스턴스에 연결하려면, 단순히 mongosh를 입력하면 기본적으로 로컬 데이터베이스에 연결됩니다. 원격 데이터베이스나 다른 설정을 사용하는 경우, 연결 문자열을 제공해야 할 수도 있습니다.

3. 데이터베이스 목록 조회: 사용 가능한 데이터베이스 목록을 보려면, show dbs 명령을 사용하세요.

특정 데이터베이스 사용: 특정 데이터베이스로 이동하려면, use <데이터베이스명> 명령을 사용하세요. 예를 들어, use myDatabase와 같이 사용할 수 있습니다.

4. 컬렉션 조회: 현재 데이터베이스의 컬렉션 목록을 보려면, show collections 명령을 사용하세요.

5. 데이터 조회: 컬렉션의 데이터를 조회하려면, db.<컬렉션명>.find() 명령을 사용하세요. 예를 들어, db.users.find()는 users 컬렉션의 모든 문서를 조회합니다.

6. 쿼리 실행: 특정 조건을 충족하는 문서만 조회하려면, find 메소드에 쿼리 조건을 추가하세요. 예를 들어, db.users.find({name: "John"})는 이름이 John인 사용자만 조회합니다.

7. 데이터베이스 관리: mongosh를 사용하여 데이터를 추가, 업데이트, 삭제하는 등의 다양한 데이터베이스 관리 작업을 수행할 수 있습니다.

## Morgan 사용법
서버가 정상적으로 실행 중이며, 특정 엔드포인트로 요청이 들어오는지 확인하기 위해, Node.js의 Express 서버에서 로깅을 구현하는 방법

1. npm install morgan

2. server app.js에 아래의 코드 추가
```
const morgan = require('morgan'); // Morgan 라이브러리 임포트
app.use(morgan('dev')); // Morgan 미들웨어 추가
```
3. Morgan 설정 옵션
morgan('dev')에서 'dev'는 로그 출력 포맷을 지정한다. morgan은 여러 로그 포맷을 지원하며, 'dev' 포맷은 개발 시 요청 메소드, 경로, 응답 상태 코드, 응답 시간 등의 정보를 포함한 축약된 로그를 제공한다.

4. 서버 로그 확인
서버를 실행한 후 클라이언트에서 요청을 보내면, 설정한 로그 포맷에 따라 터미널 또는 명령 프롬프트에 요청 정보가 출력된다. 
예를 들어, /generate-filename 엔드포인트로 POST 요청이 들어왔을 때 해당 요청의 정보가 로그로 기록됨.