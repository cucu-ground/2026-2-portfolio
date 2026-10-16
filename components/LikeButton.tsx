'use client';

import { useOptimistic, useState, useTransition } from 'react';
import { toggleLikeAction } from '@/lib/actions';
import { Heart } from './icons';
import styles from './LikeButton.module.css';

// 수업의 LikeButton(useTransition)에 useOptimistic을 더해, 서버 응답 전에 숫자가 먼저 바뀐다.
// 한 번 더 누르면 좋아요가 취소된다.
export function LikeButton({
  slug,
  initialLikes,
  initialLiked,
  disabled = false,
}: {
  slug: string;
  initialLikes: number;
  initialLiked: boolean;
  disabled?: boolean;
}) {
  const [state, setState] = useState({ likes: initialLikes, liked: initialLiked });
  const [optimistic, setOptimistic] = useOptimistic(state, (s, liked: boolean) => ({
    liked,
    likes: Math.max(0, s.likes + (liked ? 1 : -1)),
  }));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const onClick = () => {
    const nextLiked = !optimistic.liked;
    setError('');
    startTransition(async () => {
      setOptimistic(nextLiked);
      const result = await toggleLikeAction(slug);
      startTransition(() => {
        if (result.ok) setState({ likes: result.likes, liked: result.liked });
        else setError(result.message ?? '다시 시도해주세요.');
      });
    });
  };

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={`${styles.button} ${optimistic.liked ? styles.liked : ''}`}
        onClick={onClick}
        disabled={disabled || isPending}
        aria-pressed={optimistic.liked}
        title={disabled ? '데이터베이스가 연결되면 사용할 수 있어요' : optimistic.liked ? '좋아요 취소' : undefined}
      >
        <Heart filled={optimistic.liked} />
        <span>좋아요</span>
        <b>{optimistic.likes}</b>
      </button>
      {error && (
        <p className={styles.error} role="status">
          {error}
        </p>
      )}
    </div>
  );
}
