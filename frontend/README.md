# 오늘의 선물 Frontend

Next.js App Router 기반의 오늘의 선물 MVP 클라이언트입니다.

## 실행

```bash
npm install
npm run dev
```

기본 개발 서버는 `http://localhost:3000` 입니다.

## 환경 변수

`.env.example`을 참고해 `.env.local`을 만듭니다.

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

백엔드가 없거나 API가 실패하면 입력 옵션, 추천 생성, 기록 조회는 프론트엔드 개발용 fallback 데이터를 사용합니다.
