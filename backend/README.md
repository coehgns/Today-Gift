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
