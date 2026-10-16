'use client';

import { useEffect, useRef, useState, type ElementType } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

// 기존 포트폴리오의 "제목 복호화" 효과를 재사용 가능한 컴포넌트로 옮겼다.
// 화면에 처음 보일 때 한 번, 마우스를 올릴 때마다 다시 실행된다.
export function DecryptText({
  text,
  as: Tag = 'span',
  className,
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const run = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (timer.current) clearInterval(timer.current);
    let iteration = 0;
    timer.current = setInterval(() => {
      setDisplay(
        Array.from(text, (ch, i) => {
          if (i < iteration || ch === ' ' || ch === '.') return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join(''),
      );
      if (iteration >= text.length) {
        if (timer.current) clearInterval(timer.current);
        setDisplay(text);
      }
      iteration += 0.5;
    }, 40);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer.current) clearInterval(timer.current);
    };
    // run은 text에만 의존하므로 text가 바뀔 때만 다시 등록
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <Tag ref={ref} className={className} onMouseEnter={run}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{display}</span>
    </Tag>
  );
}
