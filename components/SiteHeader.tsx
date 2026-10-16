'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Close, Menu } from './icons';
import styles from './SiteHeader.module.css';

// 상세 페이지가 있는 항목은 페이지로, 나머지는 메인의 섹션으로 이동
const NAV = [
  { href: '/#about', label: 'about' },
  { href: '/#skills', label: 'skills' },
  { href: '/#projects', label: 'projects' },
  { href: '/activity', label: 'activity' },
  { href: '/#course', label: 'course' },
  { href: '/guestbook', label: 'guestbook' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  // 페이지가 바뀌면 모바일 메뉴를 닫는다 (렌더 중 상태 보정 패턴)
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => !href.includes('#') && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo} aria-label="cucu 포트폴리오 홈">
          cucu<span className={styles.cursor} aria-hidden>_</span>
        </Link>

        <nav id="site-nav" className={`${styles.nav} ${open ? styles.open : ''}`} aria-label="주요 메뉴">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={isActive(item.href) ? styles.active : undefined}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle className={styles.iconBtn} />
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
