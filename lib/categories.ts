import type { ActivityCategory } from './types';

export const ACTIVITY_CATEGORIES: { key: ActivityCategory; label: string }[] = [
  { key: 'external', label: '대외활동' },
  { key: 'contest', label: '공모전' },
  { key: 'campus', label: '교내 활동 · 운영' },
  { key: 'ctf', label: 'CTF 참가' },
];
