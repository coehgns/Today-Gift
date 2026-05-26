# 오늘의 선물 MVP

AI 기반 맞춤형 선물 추천 서비스 MVP입니다. 현재 백엔드는 FastAPI + MySQL + SQLAlchemy + Alembic 기반으로 구성되어 있습니다.

## Backend local setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

MySQL 실행:

```bash
docker compose up -d mysql
```

Migration 적용 및 seed data 삽입:

```bash
cd backend
alembic upgrade head
python -m app.gifts.seed
```

API 서버 실행:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check:

```bash
curl http://localhost:8000/health
# {"status":"ok"}
```

## 주요 Backend API

- `GET /health`
- `GET /gifts/options`
- `GET /auth/google/login`
- `GET /auth/google/callback`
- `POST /auth/dev-login` — local/development/test 전용 fallback 로그인
- `POST /auth/logout`
- `GET /me`
- `POST /recommendations`
- `GET /recommendations`
- `GET /recommendations/{id}`

## Claude fallback 정책

`ANTHROPIC_API_KEY`가 없거나 Claude 응답이 timeout/JSON validation 실패/후보 밖 상품 추천을 하면 서버는 seed gift 후보 상위 3개로 fallback 결과를 반환합니다. 내부 DB에는 `status`, `error_message`, `latency_ms`가 저장됩니다.

## 테스트

```bash
cd backend
pytest
```
