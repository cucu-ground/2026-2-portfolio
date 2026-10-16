'use client';

import { useSyncExternalStore } from 'react';
import { getTheme, setTheme, subscribeTheme } from '@/lib/theme';
import { Moon, Sun } from './icons';

export function ThemeToggle({ className }: { className?: string }) {
  // 서버 렌더링 때는 테마를 알 수 없으므로 null → 아이콘 대신 빈 버튼
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => null);
  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className={className}
      onClick={() => setTheme(next)}
      aria-label={theme ? `${next === 'dark' ? '다크' : '라이트'} 모드로 전환` : '테마 전환'}
      title="테마 전환"
    >
      {theme === 'dark' ? <Sun /> : theme === 'light' ? <Moon /> : null}
    </button>
  );
}
