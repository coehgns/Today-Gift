# 오늘의 선물 Backend 구현 계획

작성일: 2026-05-26  
범위: FastAPI, MySQL, Auth, 추천 후보 필터링, Claude 연동, 추천 기록 API  
관련 전체 계획: `docs/plans/today-gift-implementation-plan.md`

## 1. Backend 목표

백엔드는 다음 책임만 명확하게 담당한다.

1. 사용자 인증 상태를 검증한다.
2. 추천 입력값을 검증하고 정규화한다.
3. seed gift DB에서 후보를 deterministic하게 필터링한다.
4. Claude API에는 검증된 후보만 전달한다.
5. 추천 요청과 결과를 MySQL에 저장한다.
6. 추천 기록을 사용자별로 조회한다.
7. AI 실패 시에도 데모가 끊기지 않도록 fallback 결과를 반환한다.

## 2. 권장 Backend 구조

```text
backend/
  pyproject.toml 또는 requirements.txt
  .env.example
  app/
    main.py
    core/
      config.py
      security.py
    db/
      base.py
      session.py
    auth/
      router.py
      service.py
      schemas.py
      dependencies.py
    users/
      models.py
      service.py
      schemas.py
    gifts/
      models.py
      schemas.py
      seed.py
      options.py
    recommendations/
      models.py
      schemas.py
      router.py
      service.py
      filter.py
      prompt.py
      claude_client.py
      fallback.py
  alembic/
  tests/
```

## 3. Backend Task 분해

### BE-00. FastAPI 프로젝트 초기화

**목표**: 백엔드 앱이 로컬에서 실행되고 health check가 동작한다.

작업:
- FastAPI 프로젝트 생성
- 환경 변수 로딩 구조 작성
- CORS 기본 설정
- `GET /health` 구현
- 실행 명령 README에 기록

예상 파일:
- `backend/app/main.py`
- `backend/app/core/config.py`
- `backend/.env.example`

완료 기준:
- `GET /health`가 `{ "status": "ok" }` 반환
- backend 단독 실행 가능

---

### BE-01. MySQL, SQLAlchemy, Alembic 설정

**목표**: MySQL 연결과 migration 기반 DB 변경이 가능하다.

작업:
- DB session 구성
- SQLAlchemy Base 구성
- Alembic 초기화
- local MySQL 연결 확인

예상 파일:
- `backend/app/db/session.py`
- `backend/app/db/base.py`
- `backend/alembic.ini`
- `backend/alembic/env.py`

완료 기준:
- Alembic migration 생성/적용 가능
- DB 연결 실패 시 원인을 확인할 수 있는 로그 제공

---

### BE-02. 핵심 DB 모델 구현

**목표**: 사용자, 선물, 추천 요청, 추천 결과를 저장할 수 있다.

작업:
- `users` 모델
- `gift_items` 모델
- `recommendation_requests` 모델
- `recommendation_results` 모델
- 최초 migration 생성

테이블 요약:
- `users`: Google OAuth 사용자 정보
- `gift_items`: seed 선물 후보
- `recommendation_requests`: 사용자의 추천 입력 스냅샷
- `recommendation_results`: AI/fallback 추천 결과

완료 기준:
- migration 적용 후 4개 테이블 생성
- JSON 컬럼은 성격/취미/태그/결과 저장에 사용

---

### BE-03. 입력 옵션 API 구현

**목표**: 프론트가 하드코딩 없이 입력 선택지를 받아올 수 있다.

API:
- `GET /gifts/options`

반환 항목:
- 관계
- 성별
- 나이대
- MBTI + 잘 모름
- 성격 선택지
- 취미 선택지
- 상황/기념일
- 선물 톤
- 예산 범위

예상 파일:
- `backend/app/gifts/options.py`
- `backend/app/gifts/schemas.py`
- `backend/app/gifts/router.py`

완료 기준:
- 프론트 입력 폼이 이 API 응답만으로 렌더링 가능

---

### BE-04. 선물 seed data 작성

**목표**: 후보 필터링에 사용할 seed gift DB를 확보한다.

작업:
- 최소 30개, 권장 50개 seed gift 작성
- 각 선물에 가격 범위, 태그, 적합 관계, 적합 상황, 성격 태그 포함
- seed 실행 스크립트 작성

카테고리:
- 디저트/간식
- 뷰티/향기
- 문구/독서
- 테크/가젯
- 홈/인테리어
- 패션소품
- 건강/운동
- 취미용품

예상 파일:
- `backend/app/gifts/seed.py`

완료 기준:
- 로컬 DB에 gift item 30개 이상 생성
- 데모 시나리오에 맞는 후보가 5개 이상 존재

---

### BE-05. 추천 입력 schema와 validation 구현

**목표**: 잘못된 입력이 추천 로직으로 들어가지 않게 한다.

작업:
- 추천 생성 request schema 작성
- 예산 문자열을 `budget_min`, `budget_max`로 정규화
- 다중 선택 필드 기본값 처리
- 알 수 없음/상관없음 값 처리

예상 파일:
- `backend/app/recommendations/schemas.py`

완료 기준:
- 필수값 누락 시 422 반환
- budget range가 숫자 범위로 변환됨

---

### BE-06. 후보 필터링 로직 구현

**목표**: AI 호출 전 서버가 후보 5~8개를 안정적으로 고른다.

작업:
- 예산 조건 필터링
- 상황/관계/취미/성격 점수화
- 상위 후보 정렬
- 후보 부족 시 fallback 후보 보강

점수 예시:
```text
예산 일치: +30
상황 일치: +25
취미 일치 개수당: +15
성격 일치 개수당: +10
관계 일치: +10
```

예상 파일:
- `backend/app/recommendations/filter.py`

완료 기준:
- 예산 범위를 벗어난 상품 제외
- 후보 5~8개 반환
- 후보가 부족해도 최소 3개 fallback 반환

---

### BE-07. Google OAuth + JWT 인증 구현

**목표**: 로그인 사용자만 추천 기록을 생성/조회할 수 있다.

API:
- `GET /auth/google/login`
- `GET /auth/google/callback`
- `POST /auth/logout`
- `GET /me`

작업:
- Google OAuth redirect 처리
- users upsert
- JWT 발급
- 인증 dependency 작성
- httpOnly cookie 우선, 로컬 이슈가 크면 Bearer token으로 임시 단순화

예상 파일:
- `backend/app/auth/router.py`
- `backend/app/auth/service.py`
- `backend/app/auth/dependencies.py`
- `backend/app/core/security.py`
- `backend/app/users/service.py`

완료 기준:
- 로그인 후 `/me`가 사용자 정보 반환
- 로그아웃 후 보호 API 접근 불가
- `POST /recommendations`는 인증 없으면 401

---

### BE-08. 개발용 로그인 fallback 구현

**목표**: OAuth가 지연되어도 추천 핵심 플로우 개발을 막지 않는다.

API:
- `POST /auth/dev-login`

조건:
- 로컬 개발 환경에서만 활성화
- production/demo release 문서에는 위험성을 명시

완료 기준:
- OAuth 없이도 dev user로 추천 생성 테스트 가능

---

### BE-09. Claude client와 prompt 구현

**목표**: 후보 기반 추천 설명을 Claude로 생성한다.

작업:
- Claude API client 작성
- prompt builder 작성
- JSON only 응답 요청
- 후보 밖 상품 추천 금지 지시
- timeout 설정

예상 파일:
- `backend/app/recommendations/claude_client.py`
- `backend/app/recommendations/prompt.py`

완료 기준:
- 후보 5~8개를 입력하면 최종 추천 3개 JSON을 반환
- 응답에 추천 이유/전달 팁/감성 메시지 포함

---

### BE-10. AI 응답 검증과 fallback 구현

**목표**: Claude 응답 실패가 서비스 실패로 이어지지 않게 한다.

작업:
- JSON parse validation
- 필수 필드 validation
- 1회 재시도 또는 fallback 선택
- fallback result 생성기 작성
- status/error_message/latency 저장

예상 파일:
- `backend/app/recommendations/fallback.py`
- `backend/app/recommendations/service.py`

완료 기준:
- Claude timeout/parse 실패 상황에서도 추천 응답 반환
- DB에는 실패 사유 저장

---

### BE-11. 추천 생성 API 구현

**목표**: 추천 요청부터 결과 저장까지 하나의 API로 완성한다.

API:
- `POST /recommendations`

처리 순서:
1. 인증 사용자 확인
2. request schema validation
3. recommendation_requests 저장
4. 후보 필터링
5. Claude 또는 fallback 결과 생성
6. recommendation_results 저장
7. result id와 결과 반환

완료 기준:
- 추천 생성 후 request/result row 생성
- 프론트가 바로 결과 페이지로 이동할 수 있는 id 반환

---

### BE-12. 추천 기록 조회 API 구현

**목표**: 로그인 사용자별 추천 기록 목록/상세 조회를 제공한다.

API:
- `GET /recommendations`
- `GET /recommendations/{id}`

작업:
- 사용자별 row filtering
- 목록용 lightweight response
- 상세용 result_json response
- 없는 id 또는 타 사용자 id 접근 시 404

완료 기준:
- 사용자별 기록만 조회
- result id로 새로고침 조회 가능

---

### BE-13. Backend 테스트/검증

**목표**: 데모 핵심 API가 깨지지 않음을 검증한다.

검증 항목:
- `/health` 성공
- 인증 없는 추천 생성은 401
- dev-login 또는 OAuth 후 `/me` 성공
- 후보 필터링 예산 조건 준수
- 추천 생성 시 DB 저장
- Claude 실패 fallback 성공
- 기록 목록/상세 조회 성공

권장 테스트:
- 필터링 로직 unit test
- 추천 생성 service integration test
- auth dependency smoke test

## 4. Backend 완료 정의

Backend는 다음이 가능하면 MVP 기준 완료다.

- 인증된 사용자가 추천 생성 API를 호출할 수 있다.
- 서버는 seed gift DB에서 후보를 고른다.
- Claude 또는 fallback으로 추천 결과 3개를 만든다.
- 추천 요청과 결과가 DB에 저장된다.
- 사용자는 자기 추천 기록만 조회한다.
- AI 실패가 데모 실패로 이어지지 않는다.

## 5. Backend 진행상황 업데이트 규칙

Backend task를 완료할 때마다 `docs/progress/backend-progress.md`를 업데이트한다.

업데이트 항목:
- 현재 상태 요약
- 완료된 Backend Tasks 표의 해당 task row
- 진행 로그
- 검증 명령과 결과
- 다음 권장 task
- 남은 위험/TODO
