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

---

## 🔐 오픈-클로즈드 원칙 (Open-Closed Principle, OCP)

**오픈-클로즈드 원칙(OCP)** 은 SOLID 객체지향 설계 원칙 중 하나로, 다음을 의미합니다:

> **소프트웨어 엔티티(클래스, 모듈, 함수 등)는 확장에는 열려 있어야 하고(Open), 수정에는 닫혀 있어야 한다(Closed).**

### 핵심 개념

- **확장에 열려 있다(Open for extension):** 새로운 기능이나 동작을 추가할 수 있어야 합니다.
- **수정에 닫혀 있다(Closed for modification):** 기존 코드를 변경하지 않고도 새로운 기능을 추가할 수 있어야 합니다.

### 이 프로젝트에서의 적용 예시

이 도서 관리 시스템에서 OCP는 다음과 같이 적용됩니다:

- **백엔드 API 구조:** `/book` 엔드포인트는 GET, POST, PUT, DELETE 메서드를 각각 독립적으로 처리합니다. 새로운 엔드포인트(예: `/book/search`, `/book/export`)를 추가할 때 기존 라우트 코드를 수정하지 않고 새 라우트만 추가하면 됩니다.
- **프론트엔드 페이지 구조:** `booklist`, `bookform`, `view`, `edit`, `delete` 페이지가 각각 독립적으로 구성되어 있어, 새로운 페이지(예: 통계 페이지, 검색 페이지)를 기존 코드 수정 없이 추가할 수 있습니다.

### OCP를 지키지 않을 경우 발생하는 문제

- 기능 추가 시마다 기존 코드를 수정해야 하므로 버그 발생 위험 증가
- 코드 변경에 따른 의도치 않은 부작용(Side Effect) 발생
- 테스트 및 유지보수 비용 증가

### 참고 자료

- [SOLID 원칙 - 나무위키](https://namu.wiki/w/SOLID)
- [개방-폐쇄 원칙 - 위키백과](https://ko.wikipedia.org/wiki/%EA%B0%9C%EB%B0%A9-%ED%8F%90%EC%87%84_%EC%9B%90%EC%B9%99)
- [Open–closed principle - Wikipedia (영문)](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)


