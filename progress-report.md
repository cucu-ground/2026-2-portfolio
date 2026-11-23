# 개인 포트폴리오 진척사항 보고서

- 저장소: https://github.com/cucu-ground/2026-2-portfolio
- 기술 스택: Next.js(App Router), MongoDB(mongoose), NextAuth(Auth.js), Vercel

## 현재 상태

기존 포트폴리오에 **보안 기능 두 가지를 추가**했습니다.
기능은 다 넣었고, 지금은 **오류를 잡으면서 테스트하는 중**입니다.

---

## 기존 기능 (구현 완료)

| 기능 | 내용 |
| --- | --- |
| 메인 페이지 | 스크롤하면 Hero → About → Skills → Projects → Activity → Course Project → Guestbook 순서로 보여줌 |
| 터미널 | Hero 영역에서 명령어 입력, Tab 자동완성, 입력 기록, 명령어로 페이지 이동 |
| 활동 타임라인 | `/activity`에서 대외활동 · 공모전 · 교내 활동 · CTF로 나눠 필터 |
| 프로젝트 좋아요 | 누르면 바로 숫자가 오르고, 쿠키로 중복을 막음 |
| 방명록 | `/guestbook`에서 글 작성 · 목록, 메인에서 미리보기 |
| GitHub 커밋 목록 | 최근 커밋을 가져와 보여줌 (30분 캐시) |
| 데이터 관리 | 프로필 · 프로젝트 · 활동 · 기술을 MongoDB에 저장, DB가 없으면 기본 데이터로 표시 |
| JSON API | `/api/portfolio`, `/api/guestbook` |
| 화면 효과 | 다크 모드, 제목 복호화 효과, 스크롤 등장 효과 |
| 기본 보안 | 입력값 서버 재검증, 방명록 도배 방지(숨은 입력칸 + 요청 횟수 제한), 기본 보안 헤더 |

---

## 추가 기능 (구현 완료, 오류 수정 중)

### 1. 관리자 콘솔 + 보안관제 대시보드

| 기능 | 내용 |
| --- | --- |
| 관리자 로그인 | `/login`. 회원가입 화면은 없고, 계정은 `npm run create-admin` 스크립트로만 만듦 (비밀번호는 화면에 보이지 않게 입력받음) |
| 방명록 관리 | `/admin/guestbook`에서 글 숨기기 · 다시 공개 · 삭제 (전에는 DB에서 직접 지워야 했음) |
| 관리자 확인 3번 | ① `proxy.ts`가 로그인하지 않은 요청을 `/login`으로 보냄 ② 페이지에서 관리자가 아니면 404 ③ 관리자 기능(Server Action)을 실행할 때마다 다시 확인 |
| 보안관제 대시보드 | `/admin`에서 의심 활동을 모아 보여줌: XSS 시도, 함정 경로(`/.env`, `/wp-login.php` 등) 접근, 글자 수 제한 우회, 봇 입력칸, 로그인 실패, 로그인 시도 초과, 권한 없는 접근 |
| 개인정보 보호 | IP는 해시로만 저장, 이메일은 `ab***@…`처럼 가려서 남김, 기록은 90일 뒤 자동 삭제 |

### 2. 보안 등급 올리기

| 기능 | 내용 |
| --- | --- |
| CSP 강화 | 요청마다 nonce를 새로 만들어 CSP를 걺. COOP, CORP, API 전용 CSP 헤더 추가 |
| 보안 CI | `.github/workflows/security.yml`에서 4가지 검사: 빌드 + 보안 헤더 점검, npm audit, Semgrep(직접 만든 규칙 6개 포함), gitleaks |
| 의존성 관리 | README 맨 위에 Security 배지, Dependabot 설정 |
| 발표 준비 | 발표 순서와 예상 질문을 `docs/final-demo.md`에 정리 |

---

## 다음 할 일

- 오류 수정을 마치고 Vercel 배포 환경에서 전체 기능 다시 확인
- Security 워크플로 4개 작업이 모두 통과하는지 확인
- `docs/final-demo.md` 순서대로 기말 발표 리허설
