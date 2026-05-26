from __future__ import annotations

from app.core.security import create_access_token
from app.users.models import User


DEMO_REQUEST = {
    "relationship": "친구",
    "gender": "선택 안 함",
    "age_group": "20대",
    "mbti": "INFP",
    "personality": ["감성적인", "차분한"],
    "hobbies": ["독서", "카페/디저트"],
    "budget_range": "3~5만원",
    "occasion": "생일",
    "gift_tone": "센스있는",
}


def test_health_and_options(client):
    assert client.get("/health").json() == {"status": "ok"}
    options = client.get("/gifts/options")
    assert options.status_code == 200
    body = options.json()
    assert "친구" in body["relationships"]
    assert any(item["label"] == "3~5만원" for item in body["budget_ranges"])


def test_recommendation_requires_auth(client):
    response = client.post("/recommendations", json=DEMO_REQUEST)
    assert response.status_code == 401


def test_dev_login_and_me(client):
    login = client.post("/auth/dev-login")
    assert login.status_code == 200
    assert login.json()["user"]["email"] == "dev@today-gift.local"

    me = client.get("/me")
    assert me.status_code == 200
    assert me.json()["name"] == "개발용 사용자"

    logout = client.post("/auth/logout")
    assert logout.status_code == 200
    assert client.get("/me").status_code == 401


def test_recommendation_create_fallback_and_history(client):
    assert client.post("/auth/dev-login").status_code == 200

    created = client.post("/recommendations", json=DEMO_REQUEST)
    assert created.status_code == 200
    created_body = created.json()
    assert created_body["id"] > 0
    assert len(created_body["items"]) == 3

    detail = client.get(f"/recommendations/{created_body['id']}")
    assert detail.status_code == 200
    detail_body = detail.json()
    assert detail_body["status"] == "fallback"
    assert detail_body["request"]["budget_min"] == 30000
    assert detail_body["request"]["budget_max"] == 50000
    assert detail_body["candidate_snapshot"]

    history = client.get("/recommendations")
    assert history.status_code == 200
    assert history.json()[0]["id"] == created_body["id"]


def test_recommendation_detail_is_user_scoped(client, db_session):
    assert client.post("/auth/dev-login").status_code == 200
    created = client.post("/recommendations", json=DEMO_REQUEST)
    result_id = created.json()["id"]

    other = User(google_sub="other", email="other@example.com", name="Other")
    db_session.add(other)
    db_session.commit()
    db_session.refresh(other)
    other_token = create_access_token(other.id)

    client.cookies.clear()
    response = client.get(
        f"/recommendations/{result_id}",
        headers={"Authorization": f"Bearer {other_token}"},
    )
    assert response.status_code == 404
