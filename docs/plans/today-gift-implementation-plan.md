# 오늘의 선물 구현 계획

작성일: 2026-05-26  
기준 문서: `docs/plans/today-gift-mvp-service-plan.md`  
목표: 한 달 안에 발표/demo 가능한 AI 기반 맞춤형 선물 추천 MVP 구현

## 문서 분리 안내

이 문서는 전체 구현 계획의 원본/상위 개요로 유지한다. 실제 구현 작업은 아래 분리 문서를 기준으로 진행한다.

- Backend 상세 계획: `docs/plans/today-gift-backend-implementation-plan.md`
- Client 상세 계획: `docs/plans/today-gift-client-implementation-plan.md`
- Task 분해표: `docs/tasks/today-gift-task-breakdown.md`
- 에이전트 실행 지침: `AGENTS.md`


## 1. 구현 목표

MVP에서 반드시 완성해야 하는 핵심 플로우는 다음이다.

```text
Google 로그인
→ 추천 대상 정보 선택 입력
→ 서버 후보 선물 필터링
→ Claude API로 추천 이유/전달 팁/감성 메시지 생성
→ 추천 결과 저장
→ 추천 결과 조회
→ 추천 기록 조회
```

구현 우선순위는 “기능 수”보다 “한 번의 데모 플로우가 안정적으로 끝나는 것”에 둔다.

## 2. 권장 프로젝트 구조

초기 저장소는 다음처럼 구성한다.

```text
Today-Gift/
  frontend/
    package.json
    next.config.js
    app/
    components/
    lib/
    types/

  backend/
    pyproject.toml 또는 requirements.txt
    app/
      main.py
      core/
      db/
      auth/
      users/
      gifts/
      recommendations/
    alembic/

  docker-compose.yml
  README.md
  .env.example
```

## 3. 기술 선택 기준

### Frontend
- Next.js App Router 사용
- TypeScript 사용 권장
- Tailwind CSS 사용 권장
- API 호출은 `frontend/lib/api.ts`로 모은다.

### Backend
- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- MySQL
- Claude API SDK 또는 HTTP client

### Auth
- Google OAuth는 백엔드에서 callback 처리
- JWT는 httpOnly cookie 기반을 1순위로 고려
- 로컬 개발에서 cookie/CORS 문제가 커지면 Authorization Bearer 방식으로 단순화 가능

### AI
- Claude는 최종 추천 설명 생성에만 사용
- 상품 후보 자체는 서버에서 선별
- Claude 응답은 JSON으로 강제
- 실패 시 fallback 결과 제공

## 4. 구현 Phase

## Phase 0. 프로젝트 초기화

### 목표
개발 환경을 만들고 프론트/백엔드가 각각 실행되는 상태를 만든다.

### 작업
- `frontend/` Next.js 프로젝트 생성
- `backend/` FastAPI 프로젝트 생성
- `docker-compose.yml`로 MySQL 구성
- `.env.example` 작성
- README에 실행 방법 작성

### 산출물
- 프론트 서버 실행 가능
- 백엔드 서버 실행 가능
- MySQL 컨테이너 실행 가능
- `/health` API 동작

### 완료 기준
- `GET /health`가 `{ "status": "ok" }` 반환
- 프론트 첫 화면 접근 가능

---

## Phase 1. DB 모델과 기본 API 구축

### 목표
사용자, 선물, 추천 요청/결과 저장 구조를 만든다.

### Backend 작업
예상 파일:

```text
backend/app/db/session.py
backend/app/db/base.py
backend/app/core/config.py
backend/app/users/models.py
backend/app/gifts/models.py
backend/app/recommendations/models.py
backend/app/main.py
```

### 테이블

#### users
- id
- google_sub
- email
- name
- profile_image_url
- created_at
- updated_at

#### gift_items
- id
- name
- category
- description
- min_price
- max_price
- tags_json
- suitable_relations_json
- suitable_occasions_json
- suitable_personality_json
- active
- created_at

#### recommendation_requests
- id
- user_id
- relationship
- gender
- age_group
- mbti
- personality_json
- hobbies_json
- budget_min
- budget_max
- occasion
- gift_tone
- created_at

#### recommendation_results
- id
- request_id
- ai_model
- result_json
- candidate_snapshot_json
- status
- error_message
- latency_ms
- created_at

### API
- `GET /health`
- `GET /gifts/options`

### 완료 기준
- Alembic migration으로 테이블 생성 가능
- DB 연결 실패 시 명확한 오류 출력
- `/gifts/options`가 프론트 입력 옵션을 반환

---

## Phase 2. 인증 구현

### 목표
Google OAuth 로그인 후 인증된 사용자만 추천 기능을 사용할 수 있게 한다.

### Backend 작업
예상 파일:

```text
backend/app/auth/router.py
backend/app/auth/service.py
backend/app/auth/schemas.py
backend/app/core/security.py
backend/app/users/service.py
```

### API
- `GET /auth/google/login`
- `GET /auth/google/callback`
- `POST /auth/logout`
- `GET /me`

### Frontend 작업
예상 파일:

```text
frontend/app/login/page.tsx
frontend/components/auth/LoginButton.tsx
frontend/lib/api.ts
frontend/lib/auth.ts
```

### 구현 흐름
```text
사용자 Google 로그인 클릭
→ backend /auth/google/login 이동
→ Google 인증
→ backend /auth/google/callback
→ users upsert
→ JWT 발급
→ frontend로 redirect
→ /me 호출로 로그인 상태 확인
```

### 현실적 fallback
OAuth가 오래 걸리면 다음 임시 API를 개발 중에만 제공할 수 있다.

- `POST /auth/dev-login`

단, 최종 발표 전에는 Google OAuth가 우선이다.

### 완료 기준
- 로그인 후 DB에 사용자 저장
- `/me`가 현재 사용자 반환
- 로그아웃 후 `/me` 접근 실패

---

## Phase 3. 선물 seed data와 후보 필터링

### 목표
AI 호출 전에 서버가 추천 후보를 고를 수 있게 한다.

### Backend 작업
예상 파일:

```text
backend/app/gifts/seed.py
backend/app/recommendations/filter.py
backend/app/recommendations/schemas.py
```

### Seed data 기준
최소 30개, 가능하면 50개.

카테고리 예시:
- 디저트/간식
- 뷰티/향기
- 문구/독서
- 테크/가젯
- 홈/인테리어
- 패션소품
- 건강/운동
- 취미용품

### 필터링 기준
1. 예산 범위 일치
2. 상황/기념일 일치
3. 관계 적합도
4. 취미 태그 일치
5. 성격 태그 일치
6. fallback으로 인기/무난한 선물 포함

### 후보 점수 예시
```text
score = 0
+ 예산 일치: 30
+ 상황 일치: 25
+ 취미 일치 개수당: 15
+ 성격 일치 개수당: 10
+ 관계 일치: 10
```

상위 5~8개를 Claude에 전달한다.

### 완료 기준
- 입력값을 넣으면 후보 5~8개 반환
- 예산 범위를 벗어난 상품은 제외
- 후보가 부족하면 fallback 후보 포함

---

## Phase 4. 추천 생성 API 구현

### 목표
프론트에서 추천 입력을 제출하면 서버가 후보를 고르고 Claude로 최종 결과를 생성한다.

### Backend 작업
예상 파일:

```text
backend/app/recommendations/router.py
backend/app/recommendations/service.py
backend/app/recommendations/prompt.py
backend/app/recommendations/claude_client.py
backend/app/recommendations/schemas.py
```

### API

#### POST /recommendations
요청 예시:
```json
{
  "relationship": "친구",
  "gender": "선택 안 함",
  "age_group": "20대",
  "mbti": "INFP",
  "personality": ["감성적인", "차분한"],
  "hobbies": ["독서", "카페/디저트"],
  "budget_range": "3~5만원",
  "occasion": "생일",
  "gift_tone": "센스있는"
}
```

응답 예시:
```json
{
  "id": 1,
  "summary": "20대 친구의 생일을 위한 센스있는 선물 추천",
  "items": [
    {
      "gift_name": "감성 북마크 세트",
      "price_range": "1~3만원",
      "reason": "독서를 좋아하고 차분한 성향의 친구에게 잘 맞습니다.",
      "delivery_tip": "책과 함께 작은 카드에 메시지를 적어 전달해보세요.",
      "emotional_message": "네가 좋아하는 순간들 사이에 이 선물이 조용히 함께했으면 좋겠어.",
      "tags": ["독서", "감성", "부담없는"]
    }
  ]
}
```

### Claude Prompt 원칙
- 후보 gift list를 반드시 제공
- 후보 밖 상품 추천 금지
- 결과는 JSON only로 요청
- 한국어 자연어 문장 사용
- 과장된 광고 문구 금지
- 메시지는 1~2문장

### 실패 처리
- Claude API timeout
- JSON parse 실패
- 후보 부족
- DB 저장 실패

AI 실패 시:
- 서버 후보 상위 3개로 fallback 결과 생성
- 사용자에게는 “AI 생성에 실패했습니다”를 노출하기보다 기본 추천 결과를 제공
- 내부에는 status/error_message 저장

### 완료 기준
- 추천 생성 API가 result id를 반환
- recommendation_requests와 recommendation_results가 저장
- Claude 실패 시에도 응답 반환

---

## Phase 5. 추천 입력 Frontend 구현

### 목표
사용자가 선택형 UI로 추천 조건을 입력하고 추천 생성을 요청할 수 있게 한다.

### Frontend 작업
예상 파일:

```text
frontend/app/recommend/start/page.tsx
frontend/app/recommend/form/page.tsx
frontend/components/recommend/StepProgress.tsx
frontend/components/recommend/OptionCard.tsx
frontend/components/recommend/RecommendForm.tsx
frontend/components/recommend/InputSummary.tsx
frontend/types/recommendation.ts
```

### 입력 단계
1. 대상 정보
2. 성향/취미
3. 상황/톤
4. 예산
5. 입력 요약

### UX 원칙
- 뒤로가기 가능
- 필수값 누락 시 다음 단계 비활성화
- “잘 모름”, “상관없음” 옵션 제공
- 제출 후 로딩 화면 제공

### 완료 기준
- 사용자가 60~90초 안에 입력 완료 가능
- 추천 생성 성공 시 result page로 이동
- 실패 시 재시도 버튼 표시

---

## Phase 6. 결과 화면과 기록 조회 구현

### 목표
추천 결과를 카드 형태로 보여주고, 과거 추천 기록을 조회할 수 있게 한다.

### Backend API
- `GET /recommendations`
- `GET /recommendations/{id}`

### Frontend 작업
예상 파일:

```text
frontend/app/recommend/result/[id]/page.tsx
frontend/app/history/page.tsx
frontend/app/history/[id]/page.tsx
frontend/components/result/ResultCard.tsx
frontend/components/result/MessageBox.tsx
frontend/components/result/ResultSummary.tsx
frontend/components/history/HistoryList.tsx
```

### 결과 화면 구성
- 상단 추천 요약
- 추천 카드 3개
- 각 카드별 추천 이유
- 전달 팁
- 감성 메시지
- 메시지 복사 버튼
- 기록 보기 버튼

### 기록 목록 구성
- 생성일
- 관계
- 상황
- 예산
- 대표 추천명

### 완료 기준
- result id로 새로고침해도 결과 조회 가능
- 로그인 사용자별 기록만 보임
- 메시지 복사 동작

---

## Phase 7. 데모 안정화와 마감 polish

### 목표
발표 환경에서 안정적으로 시연 가능한 상태로 만든다.

### 작업
- 로딩 상태 개선
- 에러 메시지 정리
- seed gift data 보강
- 데모용 입력 시나리오 고정
- README 작성
- 환경 변수 문서화
- 전체 플로우 2회 이상 리허설

### 데모 시나리오
```text
관계: 친구
나이대: 20대
MBTI: INFP
성격: 감성적인, 차분한
취미: 독서, 카페/디저트
예산: 3~5만원
상황: 생일
톤: 센스있는
```

### 완료 기준
- 로그인 → 입력 → 추천 생성 → 결과 → 기록 조회가 3분 이내
- Claude API 실패 상황에서도 데모 중단 없음
- README만 보고 로컬 실행 가능

## 5. 주차별 구현 일정

## 1주차

### 목표
프로젝트 기반, DB, 인증 골격 완성

### 작업
- 프론트/백엔드 초기화
- MySQL docker-compose
- FastAPI health check
- SQLAlchemy/Alembic 설정
- users/gift/recommendation 모델 작성
- Google OAuth 시작

### 산출물
- 로컬 실행 환경
- DB migration
- 로그인 기본 동작 또는 dev-login fallback

## 2주차

### 목표
추천 입력과 후보 필터링 완성

### 작업
- 입력 옵션 API
- 추천 입력 UI
- gift seed 30~50개
- 후보 필터링 로직
- 추천 요청 저장

### 산출물
- 사용자가 입력을 완료할 수 있음
- 서버가 후보 5~8개를 반환할 수 있음

## 3주차

### 목표
Claude 연동과 결과 생성 완성

### 작업
- Claude client
- prompt template
- JSON schema validation
- fallback logic
- 추천 생성 API
- 결과 저장 API

### 산출물
- 실제 AI 추천 결과 3개 생성
- 결과 DB 저장

## 4주차

### 목표
결과/기록 UX와 발표 안정화

### 작업
- 결과 페이지
- 기록 목록/상세
- 메시지 복사
- 로딩/에러 UI
- README/demo script
- 발표 리허설

### 산출물
- 전체 demo flow 완성
- 발표 가능한 MVP

## 6. 테스트 및 검증 계획

### Backend 검증
- `/health` 응답 확인
- 인증 없는 추천 API 접근 시 401
- `/me` 로그인 상태 확인
- 후보 필터링이 예산 조건을 지키는지 확인
- 추천 생성 시 request/result DB 저장 확인
- Claude 실패 fallback 확인

### Frontend 검증
- 로그인 상태별 화면 분기
- 입력 단계 validation
- 추천 생성 로딩 표시
- 결과 페이지 새로고침 조회
- 메시지 복사 동작
- 기록 목록 접근

### Demo 검증
- 동일 시나리오로 2회 연속 성공
- 네트워크/API 실패 시 서비스가 깨지지 않음
- 발표자가 3분 안에 전체 기능 설명 가능

## 7. 우선순위별 작업 목록

### P0: 없으면 MVP가 성립하지 않음
- 프로젝트 초기화
- DB 연결
- 사용자 인증
- 추천 입력 UI
- gift seed data
- 후보 필터링
- Claude 추천 생성
- 결과 저장
- 결과 상세 화면

### P1: 실제 서비스처럼 보이게 함
- 추천 기록 목록
- 메시지 복사
- 로딩/에러 UX
- fallback 추천

### P2: 시간이 남으면 구현
- 다시 추천하기
- 결과 공유 텍스트 생성
- 추천 카드 즐겨찾기
- 간단한 애니메이션

### 제외
- 결제
- 쇼핑몰 연동
- 관리자 페이지
- 자유 채팅
- 추천 학습
- 실시간 가격 비교

## 8. 구현 중 주의사항

### OAuth
- redirect URI가 가장 자주 막히는 지점이다.
- 로컬/배포 환경 변수를 분리한다.
- 데모 전 Google Cloud Console 설정을 반드시 확인한다.

### Claude API
- JSON only 응답을 요구해도 깨질 수 있다.
- schema validation과 fallback은 필수다.
- 후보 밖 상품을 추천하지 말라고 명확히 지시한다.

### DB
- 처음부터 과도하게 정규화하지 않는다.
- tags/personality/hobbies는 JSON 컬럼으로 시작한다.
- 나중에 통계/검색이 필요할 때 정규화한다.

### UX
- 입력 폼이 길어지면 이탈한다.
- 선택형 칩/카드 중심으로 만든다.
- 결과 화면의 문장 품질이 서비스 인상을 결정한다.

## 9. 최종 Acceptance Criteria

- 사용자는 Google 로그인 또는 dev-login fallback으로 로그인할 수 있다.
- 사용자는 선택형 입력으로 추천 요청을 생성할 수 있다.
- 서버는 gift seed DB에서 후보를 필터링한다.
- Claude는 후보 기반으로 추천 이유/전달 팁/감성 메시지를 생성한다.
- 추천 결과는 DB에 저장된다.
- 사용자는 결과 상세를 새로고침 후에도 볼 수 있다.
- 사용자는 추천 기록 목록을 볼 수 있다.
- Claude API 실패 시에도 fallback 결과가 제공된다.
- 발표 시나리오 기준 3분 이내 전체 플로우가 완주된다.

## 10. 다음 실행 순서

구현을 시작한다면 다음 순서가 가장 안전하다.

1. `frontend/`, `backend/`, `docker-compose.yml` 생성
2. FastAPI `/health`와 Next.js 랜딩 연결
3. MySQL + SQLAlchemy + Alembic 설정
4. DB 모델 작성
5. gift seed data 작성
6. 추천 후보 필터링 API부터 구현
7. 그 다음 인증 구현
8. Claude 연동
9. 결과/기록 UI
10. 데모 polish

인증을 너무 먼저 깊게 파면 OAuth 설정에서 시간이 많이 소모될 수 있으므로, 추천 핵심 로직은 dev user로 먼저 개발해도 된다.
