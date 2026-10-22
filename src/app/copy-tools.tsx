import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Locale } from '../content';
import { copy } from './copy';

interface CopyButtonProps {
  locale: Locale;
  text: string;
  targetLabel: string;
}

type ParticleStyle = CSSProperties & {
  '--particle-angle': string;
  '--particle-distance': string;
  '--particle-rotation': string;
};

const particleStyles: ParticleStyle[] = Array.from({ length: 12 }, (_, index) => ({
  '--particle-angle': `${index * 30}deg`,
  '--particle-distance': `${20 + (index % 5) * 4}px`,
  '--particle-rotation': `${index % 2 === 0 ? 90 : -120}deg`,
}));

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function CopyButton({ locale, text, targetLabel }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const resetTimer = useRef<number | undefined>(undefined);
  const runId = useRef(0);
  const t = copy[locale];

  function clearResetTimer() {
    if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current);
    resetTimer.current = undefined;
  }

  useEffect(
    () => () => {
      runId.current += 1;
      clearResetTimer();
    },
    [],
  );

  async function copyBlock() {
    clearResetTimer();
    const currentRun = ++runId.current;
    setStatus('idle');
    try {
      await navigator.clipboard.writeText(text);
      if (currentRun !== runId.current) return;
      setStatus('copied');
      resetTimer.current = window.setTimeout(() => {
        if (currentRun === runId.current) setStatus('idle');
        resetTimer.current = undefined;
      }, 800);
    } catch {
      if (currentRun === runId.current) setStatus('failed');
    }
  }

  const feedback = status === 'copied' ? t.copied : status === 'failed' ? t.copyFailed : '';
  return (
    <button
      type="button"
      className={`copy-button${status === 'copied' ? ' is-copied' : ''}${status === 'failed' ? ' is-failed' : ''}`}
      aria-label={targetLabel}
      title={targetLabel}
      onClick={() => void copyBlock()}
    >
      <span className="copy-icon" aria-hidden="true">
        {status === 'copied' ? <CheckIcon /> : <CopyIcon />}
      </span>
      {status === 'copied' && (
        <span className="copy-explosion" aria-hidden="true">
          <span className="copy-flash" />
          <span className="copy-particles">
            {particleStyles.map((style, index) => (
              <span className="copy-particle" style={style} key={index} />
            ))}
          </span>
        </span>
      )}
      <span className="visually-hidden" role="status" aria-live="polite">
        {feedback}
      </span>
    </button>
  );
}
