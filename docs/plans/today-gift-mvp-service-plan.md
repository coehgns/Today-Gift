# 오늘의 선물 MVP 서비스 기획 및 구축 계획

작성일: 2026-05-26  
상태: 구현 전 기획안  
전제: 현재 저장소는 소스 코드가 없는 초기 상태이며, 본 계획은 Greenfield MVP 기준이다.

## 0. 기획 원칙

1. **AI는 추천사가 아니라 설득력 있는 설명가**로 둔다.
   - 서버가 후보를 먼저 좁히고, Claude는 이유/전달 팁/메시지 생성에 집중한다.
2. **선택형 입력 기반으로 데모 실패율을 낮춘다.**
   - 자유 채팅은 품질 편차와 검증 난도가 높으므로 MVP에서 제외한다.
3. **한 달 안에 실제 서비스처럼 보이는 핵심 루프만 완성한다.**
   - 로그인 → 입력 → 추천 결과 → 기록 조회가 완주되면 MVP 성공.
4. **결과 화면의 감성 품질이 서비스 체감 품질을 좌우한다.**
   - 추천 정확도보다 “나를 이해하고 추천했다”는 구조화된 결과가 중요하다.

## 1. 서비스 핵심 가치 제안

### 핵심 가치
“선물 고르는 스트레스”를 줄이고, 단순 상품 추천이 아니라 **왜 이 선물이 맞는지, 어떻게 전달하면 좋은지, 어떤 메시지를 함께 보내면 좋은지**까지 한 번에 제공한다.

### 기존 선물 추천 서비스와 차별점

| 구분 | 일반 선물 추천 | 오늘의 선물 |
|---|---|---|
| 추천 방식 | 카테고리/가격대 중심 | 관계·상황·성향 기반 후보 필터링 |
| AI 활용 | 상품 자체를 AI가 임의 추천 | 서버 후보 + AI 설명 생성 |
| 결과 가치 | 상품 리스트 | 추천 이유, 전달 팁, 감성 메시지 포함 |
| UX | 쇼핑몰 탐색형 | 짧은 선택형 설문 + 즉시 결과 |
| 데모 임팩트 | 흔한 리스트 | 개인화된 스토리형 추천 카드 |

### 사용자가 써야 하는 이유
- 선물 선택 기준을 스스로 정리하지 않아도 된다.
- 상대방 정보 몇 가지만 선택하면 “무난하지만 성의 있어 보이는” 추천을 받는다.
- 선물 전달 멘트까지 제공되어 실제 행동으로 이어지기 쉽다.
- 쇼핑몰처럼 많은 상품을 뒤지는 시간이 줄어든다.

### 추천하지 않는 방향
- **AI 자유 채팅형 서비스**: MVP에서 대화 품질/상태 관리/비용/테스트가 모두 어려워진다.
- **실시간 쇼핑몰 크롤링/가격 비교**: 한 달 MVP에 과하고 API/법적/정합성 리스크가 크다.
- **AI가 상품 DB 없이 모든 추천 생성**: 할루시네이션과 품질 편차가 커서 서비스 신뢰도가 떨어진다.

## 2. 전체 사용자 흐름

### 핵심 User Flow
1. 랜딩 페이지 진입
2. Google 로그인
3. 추천 시작 버튼 클릭
4. 대상 정보 선택형 입력
5. 입력 요약 확인
6. 추천 생성 요청
7. 로딩 화면 표시
8. 추천 결과 확인
9. 추천 기록 자동 저장
10. 마이페이지에서 이전 추천 기록 조회

### 화면 단위 UX 흐름

```text
/                 랜딩 + CTA
/login            Google OAuth 진입 또는 로그인 상태 처리
/recommend/start  추천 입력 시작
/recommend/form   단계형 입력 폼
/recommend/result/:id 결과 상세
/history          추천 기록 목록
/history/:id      과거 추천 상세
```

### MVP 기준 UX 포인트
- 추천 입력은 3~4단계로 나누고, 진행률을 보여준다.
- 결과 생성 전 “이런 조건으로 추천할게요” 요약을 보여준다.
- 결과는 상품 카드 + 이유 + 전달 팁 + 메시지를 한 화면에서 읽히게 한다.
- 기록 조회는 “언제, 누구에게, 어떤 상황으로 추천받았는지” 중심으로 보여준다.

## 3. 기능 명세 상세화

### MVP 필수 기능

| 우선순위 | 기능 | 설명 | 완료 기준 |
|---|---|---|---|
| P0 | Google 로그인 | OAuth 후 JWT 발급 | 로그인/로그아웃/인증 API 동작 |
| P0 | 선택형 추천 입력 | 대상 정보 입력 | 필수값 검증, UX 완주 가능 |
| P0 | 서버 후보 필터링 | 예산/관계/상황 기반 후보 추출 | 최소 30~50개 seed gift DB에서 후보 반환 |
| P0 | Claude 설명 생성 | 추천 이유/팁/메시지 생성 | JSON 형식 파싱 및 실패 fallback |
| P0 | 추천 결과 저장 | 요청/결과 DB 저장 | history에서 재조회 가능 |
| P0 | 추천 결과 화면 | 카드형 결과 UI | 발표자가 1분 내 설명 가능 |
| P1 | 추천 기록 조회 | 이전 추천 목록/상세 | 로그인 사용자별 분리 |
| P1 | 에러/로딩 처리 | AI 실패/네트워크 실패 대응 | 사용자 친화적 fallback 표시 |

### 추가하면 좋은 기능
- 결과 복사 버튼: 감성 메시지 복사.
- 다시 추천하기: 같은 입력으로 다른 후보 생성.
- 예산 범위 슬라이더.
- 결과 공유용 이미지/텍스트 복사.
- 간단한 즐겨찾기.

### 제거해도 되는 기능
- 상품 구매 링크 연동.
- 실시간 가격 비교.
- 결제 기능.
- 관리자 페이지.
- 자유 채팅.
- MBTI 상세 해석 페이지.
- 소셜 공유 로그인 외 추가 로그인 방식.

### 구현 우선순위
1. Auth + API 골격
2. Gift seed data + 후보 필터링
3. 추천 요청 저장 구조
4. Claude API JSON 생성
5. 결과 UI
6. 기록 조회
7. 데모 polish

## 4. 입력 UI/UX 설계

### 추천 입력 단계 구조

#### Step 1. 누구에게 주나요?
- 관계: 부모님, 연인, 친구, 직장동료, 선생님, 형제/자매, 기타
- 성별: 남성, 여성, 선택 안 함
- 나이대: 10대, 20대, 30대, 40대, 50대 이상

#### Step 2. 어떤 사람인가요?
- MBTI: 16개 선택 + “잘 모름” 제공
- 성격: 다중 선택
  - 활동적인, 차분한, 실용적인, 감성적인, 트렌디한, 꼼꼼한, 유머러스한, 미니멀한
- 취미: 다중 선택
  - 카페/디저트, 운동, 독서, 게임, 여행, 음악, 뷰티, 요리, 인테리어, 반려동물, 테크, 패션

#### Step 3. 어떤 상황인가요?
- 기념일/상황:
  - 생일, 기념일, 졸업/입학, 취업/승진, 감사, 사과/화해, 위로, 크리스마스, 집들이, 랜덤 선물
- 선물 톤:
  - 실용적인, 감동적인, 센스있는, 부담없는, 특별한

#### Step 4. 예산은 어느 정도인가요?
- 1만원 이하
- 1~3만원
- 3~5만원
- 5~10만원
- 10만원 이상

### UX 불편 최소화 방법
- 텍스트 직접 입력은 MVP에서 최소화한다.
- 선택지는 카드/칩 형태로 클릭하기 쉽게 만든다.
- “잘 모름”, “상관없음” 옵션을 제공해 입력 중단을 방지한다.
- 전체 입력 시간은 60~90초 이내를 목표로 한다.
- 마지막에 입력 요약을 제공해 사용자가 추천 맥락을 신뢰하게 한다.

### 추천하지 않는 입력 방향
- 모든 항목을 한 페이지 긴 폼으로 제공: 모바일/발표 환경에서 피로도가 높다.
- MBTI를 필수로 강제: 모르는 사용자가 이탈한다.
- 성격/취미 자유 입력: 정규화와 필터링이 복잡해진다.

## 5. 추천 결과 UX 설계

### 결과 화면 구조

1. 상단 요약
   - “20대 친구의 생일을 위한 센스있는 선물 추천”
2. 대표 추천 카드 3개
   - 선물명
   - 예상 가격대
   - 어울리는 이유 2~3줄
   - 추천 태그: `#실용적`, `#감성`, `#부담없는`
3. 선택 카드 상세
   - 추천 이유
   - 전달 팁
   - 감성 메시지
4. 액션
   - 메시지 복사
   - 다시 추천
   - 기록 보기

### 결과 수
- MVP에서는 **3개 추천**이 가장 적절하다.
  - 1개는 실패 시 대안이 없다.
  - 5개 이상은 읽기 피로도가 커진다.

### 감성 메시지 배치 전략
- 상품 설명 아래에 두지 말고, 별도 박스나 카드로 강조한다.
- “바로 복사해서 사용할 수 있는 메시지”처럼 행동 지향 문구를 붙인다.
- 메시지는 2개 톤으로 제공하면 좋다.
  - 담백한 버전
  - 따뜻한 버전

### “추천 잘 받았다”는 느낌을 주는 방법
- 입력값을 결과 문장에 반영한다.
  - 예: “차분하고 실용적인 성향의 20대 친구에게...”
- 추천 이유가 단순 상품 장점이 아니라 상대방 맥락과 연결되어야 한다.
- 결과 카드에 “왜 이 조건에 맞는지”를 명확히 보여준다.

## 6. AI 추천 구조 설계

### 서버 역할
- 입력 검증 및 정규화
- 후보 선물 DB 필터링
- 후보 점수화
- Claude prompt 생성
- Claude 응답 JSON 파싱/검증
- 결과 저장
- 실패 시 fallback 제공

### AI 역할
- 후보 선물 중 사용자 맥락에 맞는 설명 생성
- 추천 이유를 자연어로 설득력 있게 정리
- 전달 팁 생성
- 감성 메시지 생성
- 결과 톤 조정

### 후보 기반 구조가 좋은 이유
- 상품 품질을 서버가 통제할 수 있다.
- AI hallucination을 줄일 수 있다.
- 예산/상황/관계 조건을 deterministic하게 처리할 수 있다.
- 발표 시 “AI와 전통 추천 알고리즘을 결합했다”는 설명이 명확하다.
- 비용과 응답 시간을 예측하기 쉽다.

### 현실적인 Claude API 활용 방식
- 서버에서 후보 5~8개를 선정해 Claude에 전달한다.
- Claude는 최종 3개를 고르고 각 결과에 설명을 붙인다.
- 응답은 반드시 JSON schema 형태로 요구한다.
- 파싱 실패 시 1회 재시도하거나 서버 fallback 문구를 사용한다.

### Prompt 입력 예시 구조
```json
{
  "recipient": {
    "gender": "선택 안 함",
    "age_group": "20대",
    "relationship": "친구",
    "mbti": "INFP",
    "personality": ["감성적인", "차분한"],
    "hobbies": ["카페/디저트", "독서"]
  },
  "occasion": "생일",
  "budget_range": "3~5만원",
  "gift_tone": "센스있는",
  "candidates": [
    {"name": "감성 북마크 세트", "price_range": "1~3만원", "tags": ["독서", "감성"]}
  ]
}
```

### 추천하지 않는 AI 방향
- Claude에게 “알아서 선물 추천해줘”만 보내기: 결과 통제 불가.
- 상품 URL/가격을 Claude가 만들게 하기: 부정확한 정보 생성 위험.
- 매 입력 단계마다 AI 호출: 비용과 속도 문제가 커진다.

## 7. 데이터 구조 및 저장 전략

### 저장해야 하는 데이터
- 사용자 기본 정보: OAuth 식별자, 이메일, 이름, 프로필 이미지
- 추천 입력값: 관계, 나이대, 성격, 취미, 예산, 상황
- 후보 선물 스냅샷: 추천 당시 후보/최종 결과
- AI 생성 결과: 이유, 전달 팁, 감성 메시지
- API 상태: 성공/실패, 실패 사유, latency, model name

### MySQL 테이블 방향성

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

### 추천 기록 활용
- 사용자가 과거 추천을 다시 확인한다.
- 발표 시 “개인화 서비스처럼 보이는” 중요한 근거가 된다.
- 향후 개선 시 어떤 입력 조합이 많은지 분석 가능하다.

### MVP 저장 전략
- tags/personality/hobbies는 JSON 컬럼으로 시작한다.
- 정규화 테이블을 과하게 나누지 않는다.
- gift_items는 seed data SQL 또는 Python seed script로 관리한다.

## 8. 프론트/백엔드 구조 제안

### Next.js 구조

```text
frontend/
  app/
    page.tsx
    login/page.tsx
    recommend/start/page.tsx
    recommend/form/page.tsx
    recommend/result/[id]/page.tsx
    history/page.tsx
  components/
    auth/
    recommend/
    result/
    common/
  lib/
    api.ts
    auth.ts
    constants.ts
  types/
    recommendation.ts
```

### FastAPI 구조

```text
backend/
  app/
    main.py
    core/
      config.py
      security.py
    auth/
      router.py
      service.py
      schemas.py
    recommendations/
      router.py
      service.py
      schemas.py
      filter.py
      prompt.py
      claude_client.py
    gifts/
      seed.py
      models.py
    users/
      models.py
    db/
      session.py
      base.py
```

### API 설계 방향

| Method | Endpoint | 설명 |
|---|---|---|
| GET | /auth/google/login | Google OAuth 시작 |
| GET | /auth/google/callback | OAuth callback 처리 |
| POST | /auth/logout | 로그아웃/토큰 제거 |
| GET | /me | 현재 사용자 조회 |
| POST | /recommendations | 추천 생성 |
| GET | /recommendations | 추천 기록 목록 |
| GET | /recommendations/{id} | 추천 상세 |
| GET | /gifts/options | 입력 UI 옵션/상수 조회 |

### JWT/Google OAuth 흐름
1. Frontend에서 Google login 버튼 클릭
2. Backend OAuth endpoint로 이동
3. Google callback에서 사용자 식별
4. users 테이블 upsert
5. Backend가 access token 발급
6. Frontend는 httpOnly cookie 또는 Authorization header로 API 호출

### 현실적 선택
- MVP에서는 **httpOnly cookie 기반 JWT**를 추천한다.
  - 브라우저 저장 보안성이 localStorage보다 낫다.
  - Next.js와 FastAPI 도메인/CORS 설정은 주의해야 한다.
- 발표용 로컬 환경에서는 CORS와 cookie secure 옵션을 환경별로 분리한다.

## 9. 한 달 개발 일정

### 1주차: 프로젝트 골격 + 인증 + DB
- Next.js/FastAPI 프로젝트 생성
- MySQL 연결
- SQLAlchemy/Alembic 설정
- users 테이블
- Google OAuth 로그인
- JWT 인증 middleware
- 기본 레이아웃/랜딩

완료 기준:
- 로그인 후 `/me` 호출 성공
- DB에 사용자 저장

### 2주차: 입력 UX + gift seed + 후보 필터링
- 선택형 입력 UI 구현
- 입력 validation
- gift_items seed 30~50개 작성
- 후보 필터링 로직 구현
- 추천 요청 저장

완료 기준:
- 입력 완료 후 서버가 후보 5~8개 반환
- 추천 요청이 DB에 저장

### 3주차: Claude 연동 + 결과 저장/조회
- Claude API client 구현
- prompt template 작성
- JSON response parsing
- fallback 처리
- recommendation_results 저장
- 결과 상세/기록 조회 API

완료 기준:
- 실제 Claude 호출로 결과 3개 생성
- AI 실패 시 fallback 결과 제공

### 4주차: UX polish + 데모 안정화
- 결과 카드 UI 개선
- 메시지 복사 기능
- 로딩/에러 상태
- history 화면
- seed data 보강
- 발표 시나리오 리허설
- README/demo script 작성

완료 기준:
- 로그인부터 결과 확인까지 3분 이내 시연 가능
- 같은 입력으로 재시연해도 실패하지 않음

## 10. 프로젝트 위험 요소 분석

### 가장 어려운 부분
1. Google OAuth + JWT + CORS/cookie 설정
2. Claude JSON 응답 안정화
3. 추천 후보 필터링 품질
4. 결과 UI의 완성도

### 시간이 오래 걸릴 가능성이 큰 부분
- OAuth 환경 변수/redirect URI 설정
- DB 모델링을 과하게 정규화하는 작업
- AI prompt를 계속 손보는 작업
- Next.js 인증 상태 처리

### 현실적인 타협안
- OAuth가 지연되면 임시 demo login을 준비하되, 최종 발표 전 Google OAuth 복구를 목표로 한다.
- 상품 DB는 외부 API 대신 seed data로 시작한다.
- AI 결과가 불안정하면 서버에서 후보 3개를 고정 선정하고 Claude는 설명만 생성하게 한다.
- 기록 조회는 목록/상세만 구현하고 검색/필터는 제외한다.

### MVP에서 제외할 요소
- 결제/구매 링크
- 상품 재고/가격 실시간 동기화
- 관리자 상품 등록 UI
- 추천 만족도 학습
- 친구 초대/공유 피드
- 다국어 지원
- 복잡한 통계 대시보드

## 11. 발표/demo 전략

### 평가자가 보기 좋은 흐름
1. 문제 제기: “선물은 가격보다 맥락이 어렵다.”
2. 핵심 구조 설명: “서버가 후보를 필터링하고 AI가 설명을 만든다.”
3. 로그인 시연
4. 대상 정보 선택
5. 추천 결과 생성
6. 추천 이유/전달 팁/메시지 강조
7. 추천 기록 조회
8. 기술 구조 요약

### 시연 임팩트 포인트
- 선택형 입력이 빠르고 명확하다.
- 결과 문장에 사용자의 입력 조건이 자연스럽게 녹아 있다.
- 감성 메시지를 바로 복사할 수 있다.
- 기록이 저장되어 실제 서비스처럼 보인다.

### UX적으로 강조할 포인트
- “AI 챗봇”이 아니라 “선물 추천 도우미”다.
- 사용자가 고민하는 시간을 줄인다.
- 추천 이유와 전달 팁까지 제공해 실행 가능성이 높다.

### 발표용 추천 시나리오
- 관계: 친구
- 나이대: 20대
- MBTI: INFP
- 성격: 감성적인, 차분한
- 취미: 독서, 카페/디저트
- 예산: 3~5만원
- 상황: 생일
- 톤: 센스있는

이 시나리오는 결과가 감성적으로 잘 나오고, 교수/평가자가 개인화 가치를 이해하기 쉽다.

## 12. Acceptance Criteria

### 제품 기준
- 사용자는 Google 로그인 후 추천 생성 플로우를 완료할 수 있다.
- 사용자는 선택형 입력만으로 추천 요청을 만들 수 있다.
- 추천 결과는 최소 3개 선물과 각 선물의 추천 이유/전달 팁/감성 메시지를 포함한다.
- 사용자는 과거 추천 기록 목록과 상세를 조회할 수 있다.
- AI API 실패 시에도 사용자는 서비스 오류 화면이 아닌 fallback 결과 또는 재시도 안내를 본다.

### 기술 기준
- 인증이 필요한 API는 JWT 없이는 접근할 수 없다.
- 추천 생성 요청/결과가 MySQL에 저장된다.
- Claude 응답은 JSON 파싱 실패를 처리한다.
- gift seed data는 최소 30개 이상이다.
- 로컬 데모 환경에서 로그인 → 추천 생성 → 결과 저장 → 기록 조회가 3분 이내 완주된다.

## 13. Verification Steps

- Auth: 로그인 후 `/me`가 사용자 정보를 반환하는지 확인한다.
- API: 인증 없이 `/recommendations` 접근 시 401인지 확인한다.
- Recommendation: 동일 입력으로 후보 필터링 결과가 예산/상황 조건을 만족하는지 확인한다.
- AI: Claude 응답 JSON schema validation을 통과하는지 확인한다.
- DB: recommendation_requests와 recommendation_results가 생성되는지 확인한다.
- Frontend: 모바일 너비에서 입력 폼과 결과 카드가 깨지지 않는지 확인한다.
- Demo: 발표 시나리오로 전체 플로우를 2회 연속 성공시키는지 확인한다.

## 14. 최종 권장 범위

MVP의 최종 범위는 다음으로 고정하는 것이 좋다.

- Google OAuth 로그인
- 선택형 추천 입력
- seed gift DB 기반 후보 필터링
- Claude 기반 추천 이유/전달 팁/감성 메시지 생성
- 추천 결과 저장
- 추천 기록 조회
- 결과 메시지 복사

이 범위를 넘는 기능은 데모 완성도를 떨어뜨릴 가능성이 높다. 특히 쇼핑몰 연동, 자유 채팅, 관리자 페이지는 MVP 이후로 미루는 것이 현실적으로 더 좋다.
