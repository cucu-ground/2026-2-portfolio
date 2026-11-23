# 개인 포트폴리오 진척사항 보고서

- 저장소: https://github.com/cucu-ground/2026-2-portfolio
- 기술 스택: Next.js(App Router), MongoDB(mongoose), NextAuth(Auth.js), Vercel

## 현재 상태

기존 포트폴리오(메인, 활동, 방명록, 좋아요)에 **보안 기능 두 가지를 추가**했습니다.
기능은 다 넣었고, 지금은 **오류를 잡으면서 테스트하는 중**입니다.

---

## 1. 관리자 콘솔 + 보안관제 대시보드

- `/login`, `/admin`(보안관제), `/admin/guestbook`(숨기기 · 다시 공개 · 삭제) 페이지를 만들었습니다.
- 관리자인지 세 번 확인합니다.

  | 단계 | 위치 | 내용 |
  | --- | --- | --- |
  | 1 | `proxy.ts` | 로그인하지 않은 요청을 `/login`으로 보냄 |
  | 2 | 페이지 | 관리자가 아니면 404 |
  | 3 | Server Action | 관리자 기능을 실행할 때마다 다시 확인 |

- 회원가입 화면은 없습니다. 계정은 `npm run create-admin` 스크립트로만 만들고, 비밀번호는 화면에 보이지 않게 입력받습니다.
- 대시보드에 기록되는 것: XSS 시도, 함정 경로(`/.env`, `/wp-login.php` 등) 접근, 글자 수 제한 우회, 봇 입력칸, 로그인 실패, 로그인 시도 초과, 권한 없는 접근
- IP는 해시로만 저장하고, 이메일은 `ab***@…`처럼 가려서 남깁니다. 기록은 90일 뒤 자동으로 지워집니다.

## 2. 보안 등급 올리기

- 요청마다 nonce를 새로 만들어 CSP를 겁니다. 헤더도 추가했습니다(COOP, CORP, API 전용 CSP).
- `.github/workflows/security.yml`에서 네 가지를 검사합니다.
  - 빌드 + 보안 헤더 점검
  - npm audit
  - Semgrep (직접 만든 규칙 6개 포함)
  - gitleaks
- README 맨 위에 Security 배지를 달고, Dependabot도 설정했습니다.
- 발표 순서와 예상 질문은 `docs/final-demo.md`에 정리했습니다.

---

## 다음 할 일

- 오류 수정을 마치고 Vercel 배포 환경에서 전체 기능 다시 확인
- Security 워크플로 4개 작업이 모두 통과하는지 확인
- `docs/final-demo.md` 순서대로 기말 발표 리허설
