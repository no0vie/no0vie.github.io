import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '../../content';
import { learningSessions } from '../../content/study-flow';
import { preparationPath } from '../../app/routes';
import { generateEventLoopChallenge } from './challenges';
import {
  completeSession,
  rankSessions,
  readStudyProgress,
  recordCardVisit,
  writeStudyProgress,
  type Confidence,
  type StudyProgress,
} from './progress';

const text = {
  ru: {
    title: 'Учебный поток',
    intro: 'Связные сессии по 15–20 минут. Просмотр карточек не считается завершением.',
    continue: 'Продолжить',
    quick: '15–20 минут сейчас',
    choose: 'Выбрать тему',
    review: 'Повторить',
    all: 'Все материалы',
    back: 'Назад',
    next: 'Далее',
    collection: 'К подборке',
    finish: 'Завершить',
    show: 'Показать ответ',
    hide: 'Скрыть ответ',
    check: 'Самопроверка',
    skip: 'Пропустить проверку',
    seed: 'Другой вариант',
    completed: 'Сессия завершена. Выберите уверенность:',
    reason: 'Почему рекомендовано',
    minutes: 'мин',
    diagram: 'Текстовая альтернатива',
    criteria: 'Критерии ответа',
  },
  en: {
    title: 'Study Flow',
    intro: 'Coherent 15–20 minute sessions. Swiping through cards does not count as completion.',
    continue: 'Continue',
    quick: '15–20 minutes now',
    choose: 'Choose a topic',
    review: 'Review',
    all: 'All materials',
    back: 'Back',
    next: 'Next',
    collection: 'Collection',
    finish: 'Finish',
    show: 'Show answer',
    hide: 'Hide answer',
    check: 'Self-check',
    skip: 'Skip self-check',
    seed: 'Another variant',
    completed: 'Session completed. Rate your confidence:',
    reason: 'Why recommended',
    minutes: 'min',
    diagram: 'Text alternative',
    criteria: 'Answer criteria',
  },
} as const;

export function StudyFlowPage({ locale, sessionId }: { locale: Locale; sessionId?: string }) {
  const t = text[locale];
  const [progress, setProgress] = useState<StudyProgress>(() =>
    readStudyProgress(typeof window === 'undefined' ? undefined : window.localStorage),
  );
  const session = learningSessions.find(({ id }) => id === sessionId);
  const ranked = useMemo(() => rankSessions(learningSessions, progress, new Date()), [progress]);
  if (!session)
    return (
      <main id="main" className="study-flow-home" aria-labelledby="study-flow-title">
        <p className="eyebrow">Study Flow</p>
        <h1 id="study-flow-title">{t.title}</h1>
        <p>{t.intro}</p>
        <div className="study-actions">
          <a
            className="button primary"
            href={preparationPath(locale, `session/${ranked[0]?.session.id}`)}
          >
            {t.continue}
          </a>
          <a
            className="button"
            href={preparationPath(
              locale,
              `session/${ranked.find(({ session }) => session.estimatedMinutes <= 20)?.session.id}`,
            )}
          >
            {t.quick}
          </a>
          <a className="button" href="#sessions">
            {t.choose}
          </a>
          <a className="button" href={preparationPath(locale, 'practice')}>
            {t.all}
          </a>
        </div>
        <section id="sessions" aria-labelledby="sessions-title">
          <h2 id="sessions-title">{t.choose}</h2>
          <div className="study-session-grid">
            {ranked.map(({ session: item, reason }) => (
              <article className="study-session-card" key={item.id}>
                <p className="eyebrow">
                  {item.category} · {item.estimatedMinutes} {t.minutes}
                </p>
                <h3>
                  <a href={preparationPath(locale, `session/${item.id}`)}>{item.title[locale]}</a>
                </h3>
                <p>{item.goal[locale]}</p>
                <small>
                  {t.reason}: {reason[locale]}
                </small>
              </article>
            ))}
          </div>
        </section>
      </main>
    );
  return (
    <Session
      locale={locale}
      session={session}
      progress={progress}
      onProgress={(next) => {
        setProgress(next);
        writeStudyProgress(typeof window === 'undefined' ? undefined : window.localStorage, next);
      }}
    />
  );
}

function Session({
  locale,
  session,
  progress,
  onProgress,
}: {
  locale: Locale;
  session: (typeof learningSessions)[number];
  progress: StudyProgress;
  onProgress: (value: StudyProgress) => void;
}) {
  const t = text[locale];
  const saved = progress.sessions[session.id];
  const requestedCard =
    typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('card');
  const initial = Math.max(
    0,
    session.cards.findIndex(({ id }) => id === (requestedCard ?? saved?.lastCardId)),
  );
  const [index, setIndex] = useState(initial);
  const [revealed, setRevealed] = useState(false);
  const [seed, setSeed] = useState(
    () =>
      Number(
        new URLSearchParams(typeof location === 'undefined' ? '' : location.search).get('seed') ??
          '1',
      ) || 1,
  );
  const [ready, setReady] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const card = session.cards[index];
  function move(next: number, replace = false) {
    const bounded = Math.max(0, Math.min(session.cards.length - 1, next));
    setIndex(bounded);
    setRevealed(false);
    const url = `${preparationPath(locale, `session/${session.id}`)}?card=${session.cards[bounded]?.id}${seed ? `&seed=${seed}` : ''}`;
    if (typeof history !== 'undefined')
      history[replace ? 'replaceState' : 'pushState']({}, '', url);
    onProgress(recordCardVisit(progress, session.id, session.version, session.cards[bounded].id));
  }
  useEffect(() => {
    const pop = () => {
      const id = new URLSearchParams(location.search).get('card');
      const next = session.cards.findIndex((card) => card.id === id);
      if (next >= 0) setIndex(next);
    };
    const key = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (/INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
      if (event.key === 'ArrowRight') move(index + 1);
      if (event.key === 'ArrowLeft') move(index - 1);
      if (event.key === 'Escape') location.href = preparationPath(locale);
    };
    addEventListener('popstate', pop);
    addEventListener('keydown', key);
    return () => {
      removeEventListener('popstate', pop);
      removeEventListener('keydown', key);
    };
    // `move` intentionally follows the current card index; listeners are refreshed per card.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, locale, session.id, session.cards]);
  const challenge = card.challengeTemplateId ? generateEventLoopChallenge(seed) : undefined;
  function finish(confidence: Confidence, skipped = false) {
    onProgress(
      completeSession(progress, session.id, session.version, confidence, new Date(), skipped),
    );
    setReady(true);
  }
  return (
    <main
      id="main"
      className="study-session"
      aria-labelledby="session-title"
      onTouchStart={(e) => {
        const p = e.touches[0];
        if (p) touch.current = { x: p.clientX, y: p.clientY };
      }}
      onTouchEnd={(e) => {
        const start = touch.current,
          p = e.changedTouches[0];
        touch.current = null;
        if (!start || !p) return;
        const dx = p.clientX - start.x,
          dy = p.clientY - start.y;
        if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) move(index + (dx < 0 ? 1 : -1));
      }}
    >
      <header className="study-session-header">
        <p className="eyebrow">
          {session.category} · {session.estimatedMinutes} {t.minutes}
        </p>
        <h1 id="session-title">{session.title[locale]}</h1>
        <p>{session.goal[locale]}</p>
        <div className="study-progress" aria-label={`${index + 1}/${session.cards.length}`}>
          <span>
            {index + 1}/{session.cards.length}
          </span>
          <progress value={index + 1} max={session.cards.length} />
        </div>
      </header>
      <article className="study-card" aria-labelledby="card-title">
        <p className="eyebrow">
          {card.kind} · {card.estimatedMinutes} {t.minutes}
        </p>
        <h2 id="card-title">{card.title[locale]}</h2>
        <p>{card.body[locale]}</p>
        {card.diagram && (
          <figure className="study-diagram">
            <ol>
              {card.diagram.steps.map((step, i) => (
                <li key={i}>{step[locale]}</li>
              ))}
            </ol>
            <figcaption>
              <strong>{t.diagram}:</strong> {card.diagram.alternative[locale]}
            </figcaption>
          </figure>
        )}
        {challenge && (
          <div className="challenge">
            <pre>
              <code>{challenge.source}</code>
            </pre>
            <button
              type="button"
              onClick={() => {
                const next = seed + 1;
                setSeed(next);
                history.replaceState({}, '', `?card=${card.id}&seed=${next}`);
              }}
            >
              {t.seed} (seed {seed})
            </button>
            <button type="button" aria-expanded={revealed} onClick={() => setRevealed(!revealed)}>
              {revealed ? t.hide : t.show}
            </button>
            {revealed && <p>{challenge.expectedOrder.join(' → ')}</p>}
          </div>
        )}
        {card.details && (
          <>
            <button type="button" aria-expanded={revealed} onClick={() => setRevealed(!revealed)}>
              {revealed ? t.hide : t.show}
            </button>
            {revealed && <p>{card.details[locale]}</p>}
          </>
        )}
        {card.assessment && (
          <section className="self-check">
            <h3>{t.check}</h3>
            <p>{card.assessment.question[locale]}</p>
            <button type="button" aria-expanded={revealed} onClick={() => setRevealed(!revealed)}>
              {revealed ? t.hide : t.show}
            </button>
            {revealed && (
              <div>
                <h4>{t.criteria}</h4>
                <ul>
                  {card.assessment.criteria.map((criterion, i) => (
                    <li key={i}>{criterion[locale]}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}
      </article>
      <nav className="study-navigation" aria-label={t.title}>
        <button type="button" disabled={index === 0} onClick={() => move(index - 1)}>
          {t.back}
        </button>
        <a className="button" href={preparationPath(locale)}>
          {t.collection}
        </a>
        {index < session.cards.length - 1 ? (
          <button type="button" onClick={() => move(index + 1)}>
            {t.next}
          </button>
        ) : (
          <button type="button" onClick={() => setReady(true)}>
            {t.finish}
          </button>
        )}
      </nav>
      {ready && (
        <section className="completion" aria-live="polite">
          <h2>{t.completed}</h2>
          <div>
            {(['again', 'hard', 'good', 'easy'] as const).map((value) => (
              <button type="button" key={value} onClick={() => finish(value)}>
                {value}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => finish('hard', true)}>
            {t.skip}
          </button>
        </section>
      )}
    </main>
  );
}
