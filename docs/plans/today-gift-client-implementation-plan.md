# 오늘의 선물 Client 구현 계획

작성일: 2026-05-26  
범위: Next.js, 선택형 추천 입력 UX, 결과/기록 화면, 인증 상태 처리  
관련 전체 계획: `docs/plans/today-gift-implementation-plan.md`

## 1. Client 목표

클라이언트는 사용자가 60~90초 안에 추천 조건을 입력하고, 추천 결과를 감성적으로 확인하며, 과거 기록을 다시 볼 수 있게 한다.

핵심 UX는 다음이다.

```text
랜딩
→ 로그인
→ 추천 시작
→ 단계형 선택 입력
→ 입력 요약
→ 추천 생성 로딩
→ 결과 카드
→ 메시지 복사
→ 기록 조회
```

## 2. 권장 Client 구조

```text
frontend/
  package.json
  next.config.js
  app/
    page.tsx
    login/page.tsx
    recommend/start/page.tsx
    recommend/form/page.tsx
    recommend/result/[id]/page.tsx
    history/page.tsx
    history/[id]/page.tsx
  components/
    auth/
      LoginButton.tsx
      AuthGuard.tsx
    recommend/
      StepProgress.tsx
      OptionCard.tsx
      OptionChip.tsx
      RecommendForm.tsx
      InputSummary.tsx
      LoadingRecommendation.tsx
    result/
      ResultSummary.tsx
      ResultCard.tsx
      MessageBox.tsx
    history/
      HistoryList.tsx
      HistoryItem.tsx
    common/
      Button.tsx
      Card.tsx
      EmptyState.tsx
      ErrorState.tsx
  lib/
    api.ts
    auth.ts
    constants.ts
  types/
    recommendation.ts
    user.ts
```

## 3. Client Task 분해

### FE-00. Next.js 프로젝트 초기화

**목표**: 프론트 앱이 로컬에서 실행되고 기본 라우팅이 가능하다.

작업:
- Next.js App Router 프로젝트 생성
- TypeScript 설정
- Tailwind CSS 설정
- 기본 layout 작성
- API base URL 환경 변수 설정

예상 파일:
- `frontend/app/layout.tsx`
- `frontend/app/page.tsx`
- `frontend/lib/api.ts`
- `frontend/.env.example`

완료 기준:
- `npm run dev`로 프론트 실행
- 랜딩 페이지 접근 가능

---

### FE-01. 공통 UI 컴포넌트 작성

**목표**: 이후 화면을 빠르게 만들 수 있는 최소 공통 컴포넌트를 확보한다.

작업:
- Button
- Card
- OptionChip 또는 OptionCard
- EmptyState
- ErrorState
- Loading 상태 컴포넌트

예상 파일:
- `frontend/components/common/Button.tsx`
- `frontend/components/common/Card.tsx`
- `frontend/components/common/EmptyState.tsx`
- `frontend/components/common/ErrorState.tsx`
- `frontend/components/recommend/OptionCard.tsx`

완료 기준:
- 입력/결과 화면에서 재사용 가능
- 스타일은 과하지 않고 데모에서 깔끔해 보일 정도로 통일

---

### FE-02. API client 작성

**목표**: 백엔드 API 호출을 한 곳에서 관리한다.

작업:
- fetch wrapper 작성
- credentials/cookie 또는 Authorization header 처리
- 공통 에러 처리
- 타입 정의 연결

예상 파일:
- `frontend/lib/api.ts`
- `frontend/types/user.ts`
- `frontend/types/recommendation.ts`

완료 기준:
- `/health`, `/me`, `/gifts/options` 호출 가능
- API 오류 시 화면에서 처리 가능한 에러 반환

---

### FE-03. 인증 UI와 상태 처리

**목표**: 로그인 상태에 따라 화면 접근과 CTA를 제어한다.

작업:
- 로그인 버튼
- `/login` 페이지
- `/me` 기반 현재 사용자 조회
- AuthGuard 또는 redirect 처리
- 로그아웃 버튼

예상 파일:
- `frontend/app/login/page.tsx`
- `frontend/components/auth/LoginButton.tsx`
- `frontend/components/auth/AuthGuard.tsx`
- `frontend/lib/auth.ts`

완료 기준:
- 로그인 전 추천 시작 시 로그인 유도
- 로그인 후 추천 폼 접근 가능
- 로그아웃 후 보호 화면 접근 제한

---

### FE-04. 랜딩 페이지 구현

**목표**: 서비스 목적과 CTA를 짧고 명확하게 보여준다.

작업:
- 서비스 한 줄 가치 제안
- 핵심 기능 3가지 소개
- “추천 시작하기” CTA
- 데모 친화적인 깔끔한 hero 섹션

예상 파일:
- `frontend/app/page.tsx`

완료 기준:
- 평가자가 첫 화면에서 서비스 목적을 바로 이해
- CTA로 추천 플로우 진입 가능

---

### FE-05. 추천 시작 페이지 구현

**목표**: 추천 입력 전에 사용자가 무엇을 입력할지 이해하게 한다.

작업:
- 입력 소요 시간 안내
- 어떤 정보를 활용하는지 안내
- 개인정보/AI 사용에 대한 과하지 않은 설명
- 추천 폼 이동 버튼

예상 파일:
- `frontend/app/recommend/start/page.tsx`

완료 기준:
- 사용자가 부담 없이 추천 입력을 시작할 수 있음

---

### FE-06. 추천 입력 옵션 로딩

**목표**: 백엔드 `/gifts/options` 기반으로 입력 선택지를 렌더링한다.

작업:
- options API 호출
- 옵션 loading/error 처리
- constants fallback 준비

예상 파일:
- `frontend/lib/constants.ts`
- `frontend/types/recommendation.ts`

완료 기준:
- 백엔드 옵션 API가 있으면 API 값 사용
- API 실패 시 개발 중에는 fallback constants로 폼 확인 가능

---

### FE-07. 단계형 추천 입력 폼 구현

**목표**: 사용자가 선택형 UI만으로 추천 요청을 만들 수 있다.

단계:
1. 대상 정보: 관계, 성별, 나이대
2. 성향/취미: MBTI, 성격, 취미
3. 상황/톤: 기념일/상황, 선물 톤
4. 예산
5. 입력 요약

작업:
- 단계 상태 관리
- 다음/이전 이동
- 필수값 validation
- 다중 선택 처리
- “잘 모름”, “상관없음” 처리

예상 파일:
- `frontend/app/recommend/form/page.tsx`
- `frontend/components/recommend/RecommendForm.tsx`
- `frontend/components/recommend/StepProgress.tsx`
- `frontend/components/recommend/InputSummary.tsx`

완료 기준:
- 사용자가 60~90초 안에 입력 완료 가능
- 필수값 누락 시 다음 버튼 비활성화
- 요약 화면에서 입력값 확인 가능

---

### FE-08. 추천 생성 요청과 로딩 UX 구현

**목표**: 입력 제출 후 추천 생성 API를 호출하고 결과 페이지로 이동한다.

작업:
- `POST /recommendations` 호출
- 요청 중 로딩 화면
- 실패 시 재시도 버튼
- 성공 시 `/recommend/result/[id]` 이동

예상 파일:
- `frontend/components/recommend/LoadingRecommendation.tsx`
- `frontend/lib/api.ts`

완료 기준:
- 추천 생성 중 사용자가 멈춘 것처럼 느끼지 않음
- API 실패 시 이전 입력을 잃지 않고 재시도 가능

---

### FE-09. 추천 결과 상세 화면 구현

**목표**: 추천 결과를 감성적이고 신뢰감 있게 보여준다.

화면 구성:
- 상단 요약 문장
- 추천 카드 3개
- 추천 이유
- 전달 팁
- 감성 메시지 박스
- 메시지 복사 버튼
- 기록 보기/다시 추천 CTA

예상 파일:
- `frontend/app/recommend/result/[id]/page.tsx`
- `frontend/components/result/ResultSummary.tsx`
- `frontend/components/result/ResultCard.tsx`
- `frontend/components/result/MessageBox.tsx`

완료 기준:
- result id로 직접 접근/새로고침 가능
- 추천 카드가 3개 표시
- 메시지 복사 가능

---

### FE-10. 추천 기록 목록/상세 구현

**목표**: 사용자가 과거 추천을 다시 볼 수 있다.

화면:
- `/history`
- `/history/[id]`

작업:
- `GET /recommendations` 호출
- 기록 카드 목록 표시
- 빈 상태 표시
- 기록 상세는 결과 화면 컴포넌트 재사용

예상 파일:
- `frontend/app/history/page.tsx`
- `frontend/app/history/[id]/page.tsx`
- `frontend/components/history/HistoryList.tsx`
- `frontend/components/history/HistoryItem.tsx`

완료 기준:
- 로그인 사용자 기록만 표시
- 기록 클릭 시 상세로 이동

---

### FE-11. 데모 polish

**목표**: 발표자가 안정적으로 시연할 수 있는 UI 완성도를 확보한다.

작업:
- 모바일/노트북 화면 반응형 확인
- CTA 문구 정리
- 로딩/에러 문구 개선
- 결과 카드 간격/타이포그래피 정리
- 데모 시나리오 seed와 맞는 화면 문구 확인

완료 기준:
- 로그인 → 입력 → 추천 결과 → 기록 조회를 3분 이내 시연
- 에러 발생 시 화면이 깨지지 않음

## 4. Client 완료 정의

Client는 다음이 가능하면 MVP 기준 완료다.

- 사용자가 서비스 목적을 이해하고 추천을 시작할 수 있다.
- 로그인 상태에 따라 추천 화면 접근이 제어된다.
- 사용자는 선택형 단계 UI로 추천 조건을 입력한다.
- 추천 생성 중 로딩과 실패 재시도가 제공된다.
- 추천 결과는 3개 카드와 감성 메시지로 표시된다.
- 과거 추천 기록을 목록/상세로 확인할 수 있다.

## 5. Client 진행상황 업데이트 규칙

Client task를 완료할 때마다 `docs/progress/client-progress.md`를 업데이트한다.

업데이트 항목:
- 현재 상태 요약
- 완료된 Client Tasks 표의 해당 task row
- 진행 로그
- 검증 명령과 결과
- 다음 권장 task
- 남은 위험/TODO
