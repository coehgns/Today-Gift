# Today Gift Backend

FastAPI backend for 오늘의 선물.

## Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python -m app.gifts.seed
uvicorn app.main:app --reload
```

## Test

```bash
pytest
```

## Google OAuth notes

If Google shows `403 org_internal`, the OAuth app is configured for internal organization users only. For personal Gmail testing, set the Google Cloud OAuth consent screen / Audience to External and add your Gmail address as a test user while the app is in Testing mode. Keep the authorized redirect URI identical to `GOOGLE_REDIRECT_URI` (default: `http://localhost:8000/auth/google/callback`).

During local development, use `POST /auth/dev-login` or the frontend “데모로 바로 시작” button to continue testing the recommendation flow while OAuth Console settings are being fixed.
