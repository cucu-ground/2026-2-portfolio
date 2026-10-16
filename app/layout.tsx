import type { Metadata, Viewport } from 'next';
import { Inconsolata, Noto_Sans_KR } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { themeInitScript } from '@/lib/theme';
import { siteDescription, siteUrl } from '@/lib/site';

// next/font: 빌드 때 폰트를 내려받아 같은 도메인에서 제공 (외부 요청 · 레이아웃 흔들림 없음)
const noto = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto',
});

const inconsolata = Inconsolata({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inconsolata',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'cucu — 보안 전공 대학생 포트폴리오',
    template: '%s | cucu',
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'cucu portfolio',
    title: 'cucu — 보안 전공 대학생 포트폴리오',
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0f11' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // 테마 스크립트가 data-theme / class를 먼저 바꾸므로 html 속성 불일치 경고는 무시
    // data-scroll-behavior: 페이지 이동 때는 부드러운 스크롤을 끄고 바로 맨 위로 (같은 페이지 안 이동은 부드럽게)
    <html
      lang="ko"
      className={`${noto.variable} ${inconsolata.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          본문으로 건너뛰기
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
