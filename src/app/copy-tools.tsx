import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Locale } from '../content';
import { copy } from './copy';

export function useDelayedHover({ delayMs = 5_000 }: { delayMs?: number } = {}) {
  const [hoverRevealed, setHoverRevealed] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const clearTimer = () => {
    if (timer.current !== undefined) window.clearTimeout(timer.current);
    timer.current = undefined;
  };

  useEffect(() => clearTimer, []);

  return {
    hoverRevealed,
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType === 'touch') return;
      clearTimer();
      timer.current = window.setTimeout(() => {
        timer.current = undefined;
        setHoverRevealed(true);
      }, delayMs);
    },
    onPointerLeave: () => {
      clearTimer();
      setHoverRevealed(false);
    },
  };
}

interface CopyButtonProps {
  locale: Locale;
  text: string;
  targetLabel: string;
}

export function CopyButton({ locale, text, targetLabel }: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const resetTimer = useRef<number | undefined>(undefined);
  const t = copy[locale];

  useEffect(
    () => () => {
      if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  async function copyBlock() {
    if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
      resetTimer.current = window.setTimeout(() => setStatus('idle'), 2_000);
    } catch {
      setStatus('failed');
    }
  }

  const feedback = status === 'copied' ? t.copied : status === 'failed' ? t.copyFailed : '';
  return (
    <button
      type="button"
      className="copy-button"
      aria-label={targetLabel}
      onClick={() => void copyBlock()}
    >
      <span aria-hidden="true">{feedback || t.copy}</span>
      <span aria-hidden="true"> ⧉</span>
      <span className="visually-hidden" role="status" aria-live="polite">
        {feedback}
      </span>
    </button>
  );
}

type CopyableSectionProps = CopyButtonProps & {
  children: ReactNode;
  editMode: boolean;
  className?: string;
};

export function CopyableSection({
  children,
  editMode,
  className = '',
  ...buttonProps
}: CopyableSectionProps) {
  const hover = useDelayedHover({ delayMs: 5_000 });
  return (
    <div
      className={`copyable-section${editMode || hover.hoverRevealed ? ' is-copy-visible' : ''}${className ? ` ${className}` : ''}`}
      onPointerEnter={hover.onPointerEnter}
      onPointerLeave={hover.onPointerLeave}
    >
      {children}
      <CopyButton {...buttonProps} />
    </div>
  );
}
