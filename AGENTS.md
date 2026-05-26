# Today-Gift Agent Guide

이 문서는 `/Users/coehgns/Desktop/project/Today-Gift` 전체에 적용된다.  
상세 기획은 `docs/plans/`, 작업 상태는 `docs/progress/`, task 목록은 `docs/tasks/`를 기준으로 한다.

## 프로젝트 핵심

- 서비스: AI 기반 맞춤형 선물 추천 서비스 “오늘의 선물”
- MVP 흐름: Google 로그인 → 선택형 추천 입력 → 서버 후보 필터링 → Claude 설명 생성 → 결과 저장/조회 → 추천 기록 조회
- 원칙: **AI가 상품을 임의 생성하지 않는다.** 서버가 seed gift DB에서 후보를 고르고 Claude는 추천 이유/전달 팁/감성 메시지만 생성한다.

## 구현 전 반드시 확인

작업 시작 전에 아래 중 관련 문서를 읽는다.

- 전체 계획: `docs/plans/today-gift-implementation-plan.md`
- Backend 계획: `docs/plans/today-gift-backend-implementation-plan.md`
- Client 계획: `docs/plans/today-gift-client-implementation-plan.md`
- Task 목록: `docs/tasks/today-gift-task-breakdown.md`
- Backend 진행상황: `docs/progress/backend-progress.md`
- Client 진행상황: `docs/progress/client-progress.md`
- Integration 진행상황: `docs/progress/integration-progress.md`


## GitHub workflow

- 기본 작업 브랜치는 `main`이다. 별도 요청이 없으면 task 시작 전 `main`을 기준으로 작업하고, 한 task가 끝날 때마다 `main` 브랜치에 커밋한다.
- task 하나당 커밋 하나를 원칙으로 한다. 예: `BE-06 후보 필터링` 완료 → progress 업데이트 → 검증 → 커밋.
- 커밋 전에는 `git status --short`로 의도한 파일만 staged 되었는지 확인한다.
- 커밋에는 해당 task의 소스 변경과 progress 문서 업데이트를 함께 포함한다.
- 커밋하지 않을 파일은 staged 하지 않는다. 특히 로컬 실행 파일, 임시 로그, secret/env 값은 제외한다.

### 커밋 메시지 형식

커밋 제목은 아래 형식을 사용한다.

```text
<type>(<scope>): <summary>
```

예시:

```text
feat(auth): add Google OAuth login flow
fix(api): keep recommendation history scoped to the user
docs(plan): preserve backend task progress
```

커밋 타입은 다음 중 하나를 사용한다.

| Type | 사용 시점 |
|---|---|
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `build` | 빌드 파일 수정, 모듈 설치/삭제 |
| `chore` | 기타 자잘한 설정/정리 |
| `ci` | CI 설정 수정 |
| `docs` | 문서 수정 |
| `style` | 코드 스타일/포맷 수정 |
| `refactor` | 코드 리팩토링 |
| `test` | 테스트 코드 수정/추가 |
| `perf` | 성능 개선 |

권장 scope 예시: `backend`, `client`, `auth`, `api`, `db`, `ai`, `ui`, `plan`, `progress`, `infra`.

## Git 관리 규칙

- 커밋 대상: `AGENTS.md`, `docs/plans/`, `docs/tasks/`, `docs/progress/`처럼 협업에 필요한 문서와 실제 소스 코드.
- 커밋 금지: `.omx/` 전체, 특히 `.omx/state/`, `.omx/logs/`, `.omx/metrics.json`, `.omx/hud-config.json` 같은 로컬 런타임/세션 파일.
- 계획/진행 문서는 `.omx/`가 아니라 `docs/` 아래의 tracked 문서를 수정한다.
- `.omx/`는 로컬 OMX 실행 상태로만 취급하고 GitHub에 올리지 않는다.

## 작업 방식

- task ID 기준으로 작업한다. 예: `BE-06`, `FE-07`, `INT-03`.
- 백엔드 작업은 `backend/`, 클라이언트 작업은 `frontend/` 범위를 우선 수정한다.
- API 계약 변경 시 backend/client 양쪽 계획과 타입을 함께 맞춘다.
- 작업 완료 후 반드시 해당 progress 파일을 업데이트한다.
  - Backend task → `docs/progress/backend-progress.md`
  - Client task → `docs/progress/client-progress.md`
  - Integration task → `docs/progress/integration-progress.md`
- progress에는 현재 상태, 완료 task row, 진행 로그, 검증 명령, 남은 위험을 남긴다.

## Skill 사용 기준

- 범위/기획 변경: `$plan`
- FastAPI, DB, 인증, 추천 API: `backend-development`
- Next.js, 추천 입력 UX, 결과/기록 UI: `frontend-design`
- React/Next.js 구조 점검: `vercel-react-best-practices`
- 로컬 웹앱 검증: `webapp-testing`
- OAuth/JWT/API key 보안 점검: `security-review` 또는 `insecure-defaults`
- 정적 보안 분석: `semgrep`
- Google OAuth/Claude/FastAPI 최신 공식 자료 확인: `best-practice-research`

## MVP에서 하지 않을 것

- 자유 채팅형 추천
- 쇼핑몰/가격 비교/결제 연동
- 관리자 페이지
- 추천 만족도 학습
- 복잡한 통계 대시보드
- 다국어 지원

## 핵심 구현 규칙

### Backend

- Router에는 얇은 HTTP 처리만 두고, 로직은 service/filter/prompt/client로 분리한다.
- `POST /recommendations`는 인증 → 입력 검증 → 요청 저장 → 후보 필터링 → Claude/fallback → 결과 저장 순서로 처리한다.
- Claude 응답은 JSON validation을 통과해야 하며, 실패 시 fallback 결과를 반환한다.
- 타 사용자의 추천 기록은 조회할 수 없어야 한다.

### Client

- 선택형 단계 입력을 유지한다. MVP에서 자유 입력/채팅 중심으로 바꾸지 않는다.
- 추천 입력은 5단계 이하로 유지한다.
- 결과는 추천 카드 3개 + 추천 이유 + 전달 팁 + 감성 메시지 + 복사 버튼을 기준으로 한다.
- result/history 페이지는 새로고침해도 조회 가능해야 한다.

## 완료 보고 형식

작업 완료 후 요약은 아래 형식을 따른다.

```text
Task: BE-06 후보 필터링
Changed files:
- backend/app/recommendations/filter.py
- docs/progress/backend-progress.md
Verification:
- pytest backend/tests/test_filter.py
Progress updated:
- docs/progress/backend-progress.md
Remaining risks:
- seed data 품질은 데모 전 보강 필요
```
