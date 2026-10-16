// 테마 저장/적용 (클라이언트 전용)
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const EVENT = 'themechange';

// <head>에서 페인트 전에 실행되는 스크립트 — 새로고침 때 깜빡임 방지
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}document.documentElement.classList.add('js')})();`;

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)이면 이번 방문에만 적용
  }
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeTheme(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
