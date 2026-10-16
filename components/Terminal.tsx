'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { getTheme, setTheme } from '@/lib/theme';
import styles from './Terminal.module.css';

type Line = { id: number; kind: 'input' | 'output' | 'error'; text: string };

type TerminalProps = {
  projects: { slug: string; title: string }[];
  links: { github: string; blog: string; repo: string; demo: string };
  whoami: string;
  about: string;
};

const PROMPT = 'C:\\cucu\\portfolio>';

const LINE_CLASS: Record<Line['kind'], string> = {
  input: styles.lineInput,
  output: styles.lineOutput,
  error: styles.lineError,
};

// cd 로 이동할 수 있는 곳: 섹션(메인 페이지 안) 또는 페이지
const TARGETS: Record<string, string> = {
  home: '/',
  '~': '/',
  '..': '/',
  about: '/#about',
  skills: '/#skills',
  projects: '/#projects',
  activity: '/activity',
  course: '/#course',
  guestbook: '/guestbook',
};

const COMMANDS = ['help', 'ls', 'cd', 'open', 'projects', 'whoami', 'cat', 'theme', 'history', 'date', 'echo', 'clear'];

const HELP = [
  'help               사용 가능한 명령어',
  'ls                 이동할 수 있는 곳 목록',
  'cd <이름>          섹션/페이지로 이동 (예: cd projects)',
  'projects           프로젝트 목록',
  'open <이름>        github · blog · repo · demo 또는 프로젝트 열기',
  'whoami · cat about 자기소개',
  'theme [light|dark] 테마 바꾸기',
  'history · date · echo · clear',
  '(Tab 자동완성, ↑↓ 이전 명령어)',
].join('\n');

export function Terminal({ projects, links, whoami, about }: TerminalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [lines, setLines] = useState<Line[]>([
    { id: 0, kind: 'output', text: "cucu portfolio terminal — 'help'를 입력해 보세요." },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const nextId = useRef(1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 출력이 늘어나면 맨 아래로 스크롤
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const print = (entries: Omit<Line, 'id'>[]) =>
    setLines((prev) => [...prev, ...entries.map((e) => ({ ...e, id: nextId.current++ }))].slice(-80));

  const go = (href: string) => {
    const [path, hash] = href.split('#');
    // 이미 메인 페이지에 있으면 해당 섹션으로 부드럽게 스크롤
    if (hash && (path === '' || path === '/') && pathname === '/') {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${hash}`);
      return;
    }
    router.push(href);
  };

  const openExternal = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  const run = (raw: string): Omit<Line, 'id'>[] => {
    const [cmd = '', ...args] = raw.trim().split(/\s+/);
    const arg = args.join(' ');
    const out = (text: string): Omit<Line, 'id'>[] => [{ kind: 'output', text }];
    const err = (text: string): Omit<Line, 'id'>[] => [{ kind: 'error', text }];

    switch (cmd.toLowerCase()) {
      case '':
        return [];
      case 'help':
        return out(HELP);
      case 'ls':
        return out('about/  skills/  projects/  activity/  course/  guestbook/');
      case 'cd': {
        const key = arg.replace(/\/$/, '').toLowerCase();
        if (!key) return out('이동할 곳을 입력하세요. 예: cd projects');
        if (key.startsWith('projects/')) {
          const slug = key.slice('projects/'.length);
          if (projects.some((p) => p.slug === slug)) {
            go(`/#project-${slug}`);
            return out(`→ ${projects.find((p) => p.slug === slug)?.title}`);
          }
        }
        // Object.hasOwn: 'constructor' 같은 프로토타입 속성 이름이 목적지로 해석되지 않게 막는다
        const target = Object.hasOwn(TARGETS, key) ? TARGETS[key] : undefined;
        if (!target) return err(`cd: ${arg}: 그런 곳이 없습니다. 'ls'로 목록을 확인하세요.`);
        go(target);
        return out(`→ ${target}`);
      }
      case 'projects':
        return out(projects.map((p, i) => `${String(i + 1).padStart(2, '0')}  ${p.slug}\n    ${p.title}`).join('\n'));
      case 'open': {
        const key = arg.toLowerCase();
        const external: Record<string, string> = links;
        if (Object.hasOwn(external, key)) {
          openExternal(external[key]);
          return out(`새 탭에서 엽니다: ${external[key]}`);
        }
        const byIndex = projects[Number(key) - 1];
        const project = byIndex ?? projects.find((p) => p.slug === key);
        if (project) {
          go(`/#project-${project.slug}`);
          return out(`→ ${project.title}`);
        }
        return err(`open: ${arg || '(없음)'}: github, blog, repo, demo 또는 프로젝트 번호/이름을 입력하세요.`);
      }
      case 'whoami':
        return out(whoami);
      case 'cat':
        if (arg.toLowerCase() === 'about') return out(about);
        return err(`cat: ${arg || '(없음)'}: 읽을 수 있는 파일은 about 뿐입니다.`);
      case 'theme': {
        const next = arg === 'light' || arg === 'dark' ? arg : getTheme() === 'dark' ? 'light' : 'dark';
        setTheme(next);
        return out(`theme → ${next}`);
      }
      case 'history':
        return out(history.length ? history.map((h, i) => `${i + 1}  ${h}`).join('\n') : '(기록 없음)');
      case 'date':
        return out(new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
      case 'echo':
        return out(arg);
      case 'sudo':
        return err('cucu is not in the sudoers file. This incident will be reported.');
      case 'rm':
        return err('rm: 포트폴리오는 지울 수 없습니다 :)');
      default:
        return err(`'${cmd}'은(는) 알 수 없는 명령어입니다. 'help'를 입력해 보세요.`);
    }
  };

  const submit = () => {
    const raw = input;
    setInput('');
    setCursor(null);
    if (raw.trim().toLowerCase() === 'clear') {
      setLines([]);
      setHistory((h) => [...h, raw.trim()]);
      return;
    }
    if (raw.trim()) setHistory((h) => [...h, raw.trim()].slice(-50));
    print([{ kind: 'input', text: raw }, ...run(raw)]);
  };

  const complete = () => {
    const parts = input.split(/\s+/);
    if (parts.length <= 1) {
      const matches = COMMANDS.filter((c) => c.startsWith(parts[0].toLowerCase()));
      if (matches.length === 1) setInput(`${matches[0]} `);
      else if (matches.length > 1) print([{ kind: 'output', text: matches.join('  ') }]);
      return;
    }
    const [cmd, partial = ''] = parts;
    const pool =
      cmd === 'cd'
        ? Object.keys(TARGETS).filter((k) => /^[a-z]/.test(k))
        : cmd === 'open'
          ? [...Object.keys(links), ...projects.map((p) => p.slug)]
          : cmd === 'theme'
            ? ['light', 'dark']
            : cmd === 'cat'
              ? ['about']
              : [];
    const matches = pool.filter((k) => k.startsWith(partial.toLowerCase()));
    if (matches.length === 1) setInput(`${cmd} ${matches[0]}`);
    else if (matches.length > 1) print([{ kind: 'output', text: matches.join('  ') }]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'ArrowUp') {
      if (!history.length) return;
      e.preventDefault();
      const idx = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(idx);
      setInput(history[idx]);
    } else if (e.key === 'ArrowDown') {
      if (cursor === null) return;
      e.preventDefault();
      const idx = cursor + 1;
      if (idx >= history.length) {
        setCursor(null);
        setInput('');
      } else {
        setCursor(idx);
        setInput(history[idx]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className={styles.terminal} onClick={() => inputRef.current?.focus()}>
      <div className={styles.bar} aria-hidden>
        <span className={styles.lights}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.title}>cucu@portfolio — terminal</span>
      </div>

      <div ref={outputRef} className={styles.screen} role="log" aria-live="polite" aria-label="터미널 출력">
        {lines.map((line) => (
          <p key={line.id} className={LINE_CLASS[line.kind]}>
            {line.kind === 'input' ? (
              <>
                <span className={styles.prompt}>{PROMPT}</span> {line.text}
              </>
            ) : (
              line.text
            )}
          </p>
        ))}
        <div className={styles.inputRow}>
          <label htmlFor="terminal-input" className={styles.prompt}>
            {PROMPT}
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="go"
            placeholder="help, ls, cd projects ..."
            aria-label="터미널 명령어 입력"
          />
        </div>
      </div>
    </div>
  );
}
