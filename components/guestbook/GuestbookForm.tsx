'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createGuestbookEntryAction, type GuestbookFormState } from '@/lib/actions';
import { MESSAGE_MAX, NAME_MAX } from '@/lib/limits';
import styles from './guestbook.module.css';

const initialState: GuestbookFormState = { status: 'idle', message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? '저장 중...' : '남기기'}
    </button>
  );
}

// 입력칸 묶음. 제출 결과가 나올 때마다 key가 바뀌어 새로 마운트된다.
// (React 19는 action 후 폼을 비우므로, 실패했을 때는 defaultValue로 입력값을 되살린다)
function Fields({ state }: { state: GuestbookFormState }) {
  const values = state.status === 'error' ? state.values : undefined;
  const [length, setLength] = useState(() => [...(values?.message ?? '')].length);

  return (
    <>
      <div className={styles.field}>
        <label htmlFor="gb-name">이름</label>
        <input
          id="gb-name"
          name="name"
          type="text"
          required
          maxLength={NAME_MAX}
          autoComplete="nickname"
          defaultValue={values?.name}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          aria-describedby={state.fieldErrors?.name ? 'gb-name-error' : undefined}
          placeholder={`${NAME_MAX}자 이내`}
        />
        {state.fieldErrors?.name && (
          <p id="gb-name-error" className={styles.fieldError}>
            {state.fieldErrors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="gb-message">메시지</label>
        <textarea
          id="gb-message"
          name="message"
          required
          rows={4}
          maxLength={MESSAGE_MAX}
          defaultValue={values?.message}
          onChange={(e) => setLength([...e.target.value].length)}
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={`gb-message-count${state.fieldErrors?.message ? ' gb-message-error' : ''}`}
          placeholder="응원, 피드백, 하고 싶은 말을 남겨주세요."
        />
        <div className={styles.fieldFoot}>
          {state.fieldErrors?.message ? (
            <p id="gb-message-error" className={styles.fieldError}>
              {state.fieldErrors.message}
            </p>
          ) : (
            <span />
          )}
          <span id="gb-message-count" className={styles.count}>
            {length} / {MESSAGE_MAX}
          </span>
        </div>
      </div>
    </>
  );
}

export function GuestbookForm() {
  const [state, formAction] = useActionState(createGuestbookEntryAction, initialState);

  return (
    <form action={formAction} className={styles.form} noValidate>
      <Fields key={state.submittedAt ?? 0} state={state} />

      {/* 봇이 채우는 숨은 입력칸 (사람에게는 보이지 않음) */}
      <div className={styles.honeypot} aria-hidden>
        <label htmlFor="gb-website">웹사이트</label>
        <input id="gb-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.actions}>
        <SubmitButton />
        <p className={state.status === 'error' ? styles.errorMsg : styles.successMsg} role="status" aria-live="polite">
          {state.message}
        </p>
      </div>

      <p className={styles.privacy}>
        이름과 메시지만 저장합니다. 도배 방지를 위해 접속 IP는 원문 대신 해시값으로만 10분간 보관한 뒤 자동 삭제됩니다.
      </p>
    </form>
  );
}
