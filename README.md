 cat README.md 
# 도서 관리 웹 서비스

이 프로젝트는 책 정보를 등록, 수정, 삭제, 조회할 수 있는 웹 기반 도서 관리 시스템입니다.  
백엔드는 TypeScript 기반 Express.js로 작성되었으며, 프론트엔드는 Next.js로 구성되어 있습니다.

## 📁 프로젝트 구조

```
/opt/books/
├── backend/      # Express.js 기반 API 서버
│   ├── index.ts  # 메인 서버 코드 (port: 5000)
│   ├── package.json / tsconfig.json 등
├── frontend/     # Next.js 프론트엔드 (port: 4000)
│   ├── pages/
│   │   ├── index.tsx    # 메인 화면
│   │   ├── list.tsx     # 도서 리스트
│   │   ├── add.tsx      # 도서 추가
│   │   ├── edit.tsx     # 도서 수정
│   ├── public/
│   ├── package.json / tsconfig.json 등
├── bookdb.sql     # MariaDB 백업 파일
└── README.md      # 현재 문서
```

## 🚀 실행 방법

### 1. 백엔드 실행 (포트: 5000)

```bash
cd /opt/books/backend
npm install
pm2 start index.ts --name backend --interpreter ts-node
```

### 2. 프론트엔드 실행 (포트: 4000)

```bash
cd /opt/books/frontend
npm install
npm run build
pm2 start npm --name frontend -- start
```

### 3. 부팅 시 자동 실행 설정

```bash
pm2 save
pm2 startup
# 출력되는 명령어를 복사해서 실행 (예: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu)
```

## 🌐 접속 주소

- 서비스 주소: [http://books.epics.kr](http://books.epics.kr)

## 🗄️ 데이터베이스

- DBMS: **MariaDB**
- DB 이름: `bookdb`
- 백업 파일: `bookdb.sql`
- 덤프 명령어:

```bash
mysqldump -u [user] -p bookdb > bookdb.sql
```

## 🧾 버전 정보

- OS: Ubuntu 24.04.2 LTS (Noble Numbat)
- DB: MariaDB 10.11.13
- Node.js: 프로젝트별 `.nvmrc` 또는 `package.json` 참조
- 프론트엔드: Next.js 15.3.3
- 백엔드: Express.js + TypeScript
- 구축서버: 아마존 서비스 
- 웹서버 : nginx

---

📌 주요 URL 예시  
- 도서 리스트: [http://books.epics.kr/booklist](http://books.epics.kr/booklist)  
- 도서 등록: [http://books.epics.kr/bookform](http://books.epics.kr/bookform)


