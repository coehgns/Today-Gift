# 오늘의 선물 Task Breakdown

작성일: 2026-05-26  
목적: AI 에이전트가 작업 단위를 독립적으로 선택하고 완료 기준을 검증할 수 있도록 백엔드/클라이언트/통합 작업을 분리한다.

## 작업 원칙

- 한 task는 가능한 한 하나의 명확한 산출물만 만든다.
- Backend task는 `backend/` 범위를 우선 수정한다.
- Client task는 `frontend/` 범위를 우선 수정한다.
- API 계약 변경이 필요한 task는 관련 Backend/Client task 문서를 함께 갱신한다.
- 인증, AI, DB 변경은 완료 후 최소 smoke test를 남긴다.
- 작업 완료 후 반드시 해당 progress 문서를 업데이트한다.
  - Backend task: `docs/progress/backend-progress.md`
  - Client task: `docs/progress/client-progress.md`
  - Integration task: `docs/progress/integration-progress.md`

## Backend Tasks

| ID | 작업명 | 선행 작업 | 완료 산출물 |
|---|---|---|---|
| BE-00 | FastAPI 초기화 | 없음 | `GET /health` |
| BE-01 | DB/Alembic 설정 | BE-00 | MySQL migration 가능 |
| BE-02 | 핵심 모델 작성 | BE-01 | 4개 핵심 테이블 |
| BE-03 | 입력 옵션 API | BE-00 | `GET /gifts/options` |
| BE-04 | gift seed 작성 | BE-02 | 30개 이상 gift data |
| BE-05 | 추천 입력 schema | BE-03 | validation/normalization |
| BE-06 | 후보 필터링 | BE-04, BE-05 | 후보 5~8개 추출 |
| BE-07 | Google OAuth/JWT | BE-02 | `/me`, 보호 API 인증 |
| BE-08 | dev-login fallback | BE-07 | 로컬 개발 로그인 |
| BE-09 | Claude client/prompt | BE-06 | 후보 기반 JSON 생성 |
| BE-10 | AI fallback | BE-09 | 실패 시 기본 추천 반환 |
| BE-11 | 추천 생성 API | BE-06, BE-07, BE-10 | `POST /recommendations` |
| BE-12 | 기록 조회 API | BE-11 | 목록/상세 조회 |
| BE-13 | Backend 검증 | BE-12 | 핵심 API smoke test |

## Client Tasks

| ID | 작업명 | 선행 작업 | 완료 산출물 |
|---|---|---|---|
| FE-00 | Next.js 초기화 | 없음 | 실행 가능한 frontend |
| FE-01 | 공통 UI 컴포넌트 | FE-00 | Button/Card/Error 등 |
| FE-02 | API client | FE-00 | 공통 fetch wrapper |
| FE-03 | 인증 UI/상태 | FE-02, BE-07/BE-08 | login/me/logout 흐름 |
| FE-04 | 랜딩 페이지 | FE-01 | CTA 포함 첫 화면 |
| FE-05 | 추천 시작 페이지 | FE-01, FE-04 | 입력 안내 화면 |
| FE-06 | 입력 옵션 로딩 | FE-02, BE-03 | options 기반 렌더링 |
| FE-07 | 단계형 입력 폼 | FE-01, FE-06 | 5단계 입력 UX |
| FE-08 | 추천 생성 요청/로딩 | FE-07, BE-11 | 생성 후 결과 이동 |
| FE-09 | 결과 상세 화면 | FE-01, FE-02, BE-12 | 결과 카드/복사 |
| FE-10 | 기록 목록/상세 | FE-09, BE-12 | history 화면 |
| FE-11 | Client polish | FE-10 | 데모 가능한 UI |

## Integration Tasks

| ID | 작업명 | 선행 작업 | 완료 산출물 |
|---|---|---|---|
| INT-00 | docker-compose 구성 | BE-00, FE-00 | MySQL 포함 로컬 실행 |
| INT-01 | 환경 변수 문서화 | BE-07, BE-09 | `.env.example`, README |
| INT-02 | API 계약 점검 | BE-03, BE-11, BE-12, FE-02 | 타입/응답 형식 일치 |
| INT-03 | 전체 추천 플로우 smoke | BE-12, FE-10 | 로그인→추천→기록 성공 |
| INT-04 | Claude 실패 시나리오 검증 | BE-10, FE-08 | fallback 화면/결과 확인 |
| INT-05 | 발표 데모 리허설 | INT-03, INT-04 | 3분 이내 2회 성공 |

## 권장 작업 순서

### 1차: 기반 구축
1. BE-00
2. FE-00
3. INT-00
4. BE-01
5. BE-02
6. FE-01
7. FE-02

### 2차: 추천 핵심 로직
1. BE-03
2. BE-04
3. BE-05
4. BE-06
5. FE-04
6. FE-05
7. FE-06
8. FE-07

### 3차: 인증과 추천 생성
1. BE-07
2. BE-08
3. FE-03
4. BE-09
5. BE-10
6. BE-11
7. FE-08

### 4차: 결과/기록/데모
1. BE-12
2. FE-09
3. FE-10
4. BE-13
5. INT-02
6. INT-03
7. INT-04
8. FE-11
9. INT-05

## 병렬화 가능한 작업

- BE-00과 FE-00은 병렬 가능
- BE-03 옵션 API와 FE-01 공통 UI는 병렬 가능
- BE-04 seed data와 FE-04/FE-05 화면 작업은 병렬 가능
- BE-09 Claude prompt와 FE-09 결과 UI는 API response contract가 정해진 뒤 병렬 가능

## 병렬화하면 안 되는 작업

- BE-02 모델 작성 전 BE-04 seed DB 저장 작업
- BE-06 필터링 확정 전 BE-11 추천 생성 API 완성
- BE-11 응답 형식 확정 전 FE-08/FE-09 최종 연결
- BE-07 인증 방식 확정 전 FE-03 최종 인증 처리

## Definition of Done

각 task 완료 시 다음을 남긴다.

- 변경 파일 목록
- 실행/검증한 명령
- 남은 위험 또는 TODO
- API 변경이 있으면 관련 client/backend task 문서 업데이트
- 해당 progress 문서의 `현재 상태 요약`, task 상태 row, `진행 로그` 업데이트

## Progress 업데이트 형식

작업 완료 후 해당 progress 파일에 아래 정보를 기록한다.

```text
### YYYY-MM-DD

- 완료 task: BE-06 후보 필터링
- 변경 파일: backend/app/recommendations/filter.py, ...
- 검증: pytest backend/tests/test_filter.py
- 다음 권장 task: BE-07 Google OAuth/JWT
- 남은 위험: seed data 품질 보강 필요
```
