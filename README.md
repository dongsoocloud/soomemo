# 메모앱 (Memo App)

개인 메모 작성 및 관리 애플리케이션입니다. 사용자 인증, 카테고리 관리, 메모 CRUD 기능을 제공합니다.

## 주요 기능

- 🔐 **사용자 인증**: 회원가입, 로그인, 로그아웃
- 📝 **메모 관리**: 메모 작성, 수정, 삭제, 조회
- 📂 **카테고리 관리**: 메모 분류 및 카테고리 관리
- 🔍 **검색 기능**: 제목과 내용으로 메모 검색
- 💾 **데이터베이스**: SQLite를 사용한 데이터 영구 저장
- 🎨 **반응형 UI**: Tailwind CSS를 사용한 모던한 디자인

## 기술 스택

### 프론트엔드
- React 19.1.1
- Tailwind CSS
- Axios (HTTP 클라이언트)

### 백엔드
- Node.js
- Express.js
- Sequelize (ORM)
- SQLite (데이터베이스)
- JWT (인증)
- bcryptjs (비밀번호 암호화)

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# .env.example 파일을 복사하여 .env 파일 생성
cp .env.example .env
```

또는 직접 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=5000
```

**⚠️ 주의**: JWT_SECRET은 반드시 강력한 비밀키로 변경하세요!

### 3. 개발 서버 실행

#### 백엔드 서버만 실행
```bash
npm run server
```

#### 프론트엔드만 실행
```bash
npm start
```

#### 백엔드와 프론트엔드를 동시에 실행
```bash
npm run dev
```

### 4. 애플리케이션 접속
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:5000

## 사용법

### 1. 회원가입/로그인
- 처음 사용하는 경우 "회원가입" 버튼을 클릭하여 계정을 생성하세요.
- 기존 사용자는 "로그인" 버튼을 클릭하여 로그인하세요.

### 2. 메모 작성
- 로그인 후 "새 메모" 버튼을 클릭하여 메모를 작성하세요.
- 제목과 내용을 입력하고 카테고리를 선택한 후 저장하세요.

### 3. 메모 관리
- 메모 목록에서 메모를 클릭하여 수정할 수 있습니다.
- 삭제 버튼을 클릭하여 메모를 삭제할 수 있습니다.

### 4. 카테고리 관리
- 사이드바에서 카테고리를 추가, 수정, 삭제할 수 있습니다.
- 카테고리별로 메모를 필터링할 수 있습니다.

### 5. 검색
- 헤더의 검색창을 사용하여 메모를 검색할 수 있습니다.

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 사용자 정보 조회

### 메모
- `GET /api/memos` - 메모 목록 조회
- `GET /api/memos/:id` - 특정 메모 조회
- `POST /api/memos` - 메모 생성
- `PUT /api/memos/:id` - 메모 수정
- `DELETE /api/memos/:id` - 메모 삭제

### 카테고리
- `GET /api/categories` - 카테고리 목록 조회
- `POST /api/categories` - 카테고리 생성
- `PUT /api/categories/:id` - 카테고리 수정
- `DELETE /api/categories/:id` - 카테고리 삭제

## 프로젝트 구조

```
memo-app/
├── public/                 # 정적 파일
├── src/                   # React 소스 코드
│   ├── components/        # React 컴포넌트
│   ├── contexts/          # React Context
│   ├── services/          # API 서비스
│   └── ...
├── server/                # 백엔드 서버
│   ├── config/           # 데이터베이스 설정
│   ├── models/           # Sequelize 모델
│   ├── routes/           # API 라우트
│   ├── middleware/       # 미들웨어
│   └── ...
└── package.json
```

## 데이터베이스 스키마

### Users 테이블
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- createdAt, updatedAt

### Categories 테이블
- id (Primary Key)
- name
- color
- userId (Foreign Key)
- createdAt, updatedAt

### Memos 테이블
- id (Primary Key)
- title
- content
- userId (Foreign Key)
- categoryId (Foreign Key)
- createdAt, updatedAt

## 보안 기능

- JWT 토큰 기반 인증
- bcrypt를 사용한 비밀번호 해싱
- CORS 설정
- 입력 데이터 검증
- SQL 인젝션 방지 (Sequelize ORM 사용)

## 개발 모드 vs 프로덕션 모드

### 개발 모드
- React 개발 서버: http://localhost:3000
- Express API 서버: http://localhost:5000
- SQLite 데이터베이스 파일: `server/database.sqlite`

### 프로덕션 모드
- `npm run build`로 React 앱 빌드
- Express 서버가 정적 파일 서빙
- 환경 변수 `NODE_ENV=production` 설정

## 문제 해결

### 서버가 시작되지 않는 경우
1. 포트 5000이 사용 중인지 확인
2. `.env` 파일이 올바르게 설정되었는지 확인
3. `npm install`로 의존성이 모두 설치되었는지 확인

### 데이터베이스 오류
1. `server/database.sqlite` 파일 권한 확인
2. Sequelize 모델 관계 설정 확인

### 인증 오류
1. JWT_SECRET이 설정되었는지 확인
2. 토큰 만료 시간 확인

## 라이선스

MIT License