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
- `DELETE /recommendations/{id}`

## Google OAuth 403 `org_internal` 해결

Google 로그인 화면에서 `403 오류: org_internal` 또는 “조직 내에서만 사용할 수 있습니다”가 보이면 코드 문제가 아니라 Google Cloud OAuth 앱 대상 설정 문제입니다.

해결 방법:

1. Google Cloud Console → APIs & Services → OAuth consent screen / Audience로 이동
2. 앱 User Type/Audience를 **External**로 설정
3. Publishing status가 Testing이면 로그인할 Gmail 계정을 **Test users**에 추가
4. OAuth Client의 Authorized redirect URI가 backend `.env`의 `GOOGLE_REDIRECT_URI`와 정확히 같은지 확인
   - 로컬 기본값: `http://localhost:8000/auth/google/callback`

조직 내부 전용 앱으로 유지해야 한다면 같은 Google Workspace/Cloud Identity 조직 계정으로 로그인해야 합니다. 로컬 개발 중에는 `/auth/dev-login` 기반 “데모로 바로 시작” 버튼으로 추천 플로우를 먼저 검증할 수 있습니다.

## Claude fallback 정책

`ANTHROPIC_API_KEY`가 없거나 Claude 응답이 timeout/JSON validation 실패/후보 밖 상품 추천을 하면 서버는 seed gift 후보 상위 3개로 fallback 결과를 반환합니다. 내부 DB에는 `status`, `error_message`, `latency_ms`가 저장됩니다.

## 테스트

```bash
cd backend
pytest
```
