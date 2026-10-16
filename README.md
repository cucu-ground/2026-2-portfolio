# cucu portfolio

금융 보안에 관심 있는 보안 전공 대학생 **cucu**의 포트폴리오입니다.
Next.js(App Router)와 MongoDB로 만들었고, 포트폴리오 데이터(프로필 · 프로젝트 · 활동 · 기술)와 방명록 · 좋아요를 모두 MongoDB에 저장합니다.

- 수업 실습 프로젝트 저장소: https://github.com/cucu-ground/assignments-92513326
- 수업 실습 프로젝트 배포: https://assignments-92513326.vercel.app

## 페이지 구성

| 경로 | 내용 |
| --- | --- |
| `/` | 메인. 스크롤하면 Hero(터미널) → About → Skills → Projects(프로젝트 전체 + 좋아요) → Activity → Course Project → Guestbook을 모두 보여줌 |
| `/activity` | 활동 타임라인 (대외활동 · 공모전 · 교내 활동/운영 · CTF 분류 필터) |
| `/guestbook` | 방명록 작성 / 목록 |
| `/api/portfolio` | 포트폴리오 데이터 JSON |
| `/api/guestbook` | 최근 방명록 JSON |

## 사용한 React / Next.js 기능

- **App Router** 파일 기반 라우팅, Metadata API, `sitemap.ts` · `robots.ts`
- **Server Component**에서 MongoDB(mongoose) 직접 조회, `React.cache`로 한 요청 안의 중복 조회 제거, `connection()`으로 요청 시점 렌더링
- **Server Action**: 방명록 작성(`useActionState` + `useFormStatus`), 좋아요(`useOptimistic` + `useTransition`), `revalidatePath`
- **Streaming**: GitHub 커밋 목록과 방명록 미리보기를 `Suspense`로 분리해 나머지 화면을 먼저 표시
- `loading.tsx` · `error.tsx`(Next 16.3의 `retry`) · `not-found.tsx`
- **Route Handler** JSON API, `fetch` 데이터 캐시(`next.revalidate`)로 GitHub API 호출 30분 캐시
- `next/font`, `next/image`, React Compiler(`reactCompiler: true`)
- Client Component: 터미널(명령어 · Tab 자동완성 · 히스토리 · `useRouter` 이동), 제목 복호화 효과, 스크롤 등장 효과(IntersectionObserver), 다크 모드(`useSyncExternalStore`), 활동 필터

## 보안 처리

- Server Action 입력값 서버 재검증 (길이 · 제어문자 제거), 사용자 입력을 쿼리 연산자로 쓰지 않음
- 방명록 도배 방지: honeypot 입력칸 + IP 기반 rate limit (IP 원문 대신 salt를 붙인 SHA-256 해시만 저장, MongoDB TTL 인덱스로 10분 뒤 자동 삭제)
- 좋아요 중복 방지: httpOnly · SameSite=Lax 쿠키
- 보안 헤더: `frame-ancestors 'none'` CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS, `X-Powered-By` 제거
- React 기본 이스케이프만 사용 (`dangerouslySetInnerHTML`은 테마 초기화 스크립트에만 사용, 사용자 입력 없음)
- Next.js 16.3.8 사용 (16.3.7 이하의 알려진 취약점 패치 버전)

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # MONGODB_URI 입력
npm run dev                   # http://localhost:3000
```

`MONGODB_URI`가 없거나 DB에 연결할 수 없으면 `lib/content.ts`의 기본 데이터로 화면을 보여주고 방명록 · 좋아요는 비활성됩니다. 연결 여부는 `/api/portfolio`를 열었을 때 `"source": "mongodb"`(연결됨) / `"fallback"`(미연결)으로 확인할 수 있습니다.

연결 문자열에 DB 이름이 없으면(Atlas에서 복사한 기본 형태 `...mongodb.net/?retryWrites=...`) 자동으로 `portfolio` DB를 사용합니다.

Atlas를 쓰는 경우 **Network Access**에 지금 쓰는 컴퓨터의 IP(또는 `0.0.0.0/0`)가 등록되어 있어야 로컬에서도 연결됩니다.

## 배포 (Vercel + MongoDB Atlas)

1. **MongoDB Atlas**에서 클러스터를 만들고 Database User를 추가합니다.
2. Atlas **Network Access**에 `0.0.0.0/0`을 추가합니다. (Vercel은 고정 IP가 없어서 필요합니다. 대신 DB 사용자 비밀번호를 길고 무작위로 만들어 주세요.)
3. **Connect → Drivers**에서 연결 문자열을 복사해 `<password>` 자리에 비밀번호를 넣습니다. (DB 이름은 비워 두면 `portfolio`를 사용합니다. 비밀번호에 `@ / : ?` 같은 특수문자가 있으면 URL 인코딩이 필요합니다.)
4. **Vercel**에서 이 저장소를 Import 합니다.
5. Vercel **Settings → Environment Variables**에 아래 값을 등록하고 배포합니다.
   - `MONGODB_URI` (필수)
   - `RATE_LIMIT_SALT` (권장, 아무 긴 랜덤 문자열)
   - `GITHUB_TOKEN` (선택, GitHub API 호출 한도를 늘릴 때)
6. 첫 요청 때 `lib/content.ts`의 내용이 MongoDB에 자동으로 들어갑니다. 배포 후 `/api/portfolio`의 `source`가 `mongodb`이면 완료입니다.

## 내용 수정 방법

1. `lib/content.ts`에서 프로필 · 프로젝트 · 활동 · 기술을 고칩니다.
2. 저장(로컬) 또는 배포하면, 다음 요청 때 MongoDB 문서가 새 내용으로 자동 동기화됩니다. 내용의 해시를 비교해 바뀐 것을 알아내므로 따로 버전을 올릴 필요는 없습니다. 좋아요 수와 방명록은 그대로 유지됩니다.

방명록 글을 지우려면 Atlas의 **Browse Collections → guestbookentries**에서 해당 문서를 삭제합니다.

## 폴더 구조

```
app/                    페이지, 레이아웃, API, 에러/로딩 화면
components/             화면 컴포넌트 (home/, project/, guestbook/)
lib/content.ts          포트폴리오 원본 데이터 (MongoDB 시드)
lib/portfolio.ts        MongoDB 조회 + 시드 동기화 + 기본 데이터 대체
lib/actions.ts          Server Action (방명록, 좋아요)
lib/mongodb.ts          MongoDB 연결 캐시
models/                 mongoose 스키마
```
