import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '../../content';
import { learningSessions } from '../../content/study-flow';
import { algorithmPatterns, algorithmProblems } from '../../content/algorithmic-patterns';
import { preparationPath } from '../../app/routes';
import { generateEventLoopChallenge } from './challenges';
import { createStudyFlowUrl, parseStudyFlowLocation, type StudyMode } from './navigation';
import {
  completeSession,
  rankSessions,
  openStudyProgress,
  createEmptyStudyProgress,
  recordCardVisit,
  recordAlgorithmAttempt,
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
    modes: 'Режим обучения',
    recognize: 'Угадай паттерн',
    solve: 'Решить',
    learn: 'Изучить',
    choosePattern: 'Выберите подход',
    explain: 'Объясните выбор и оцените сложность',
    feedback: 'Обратная связь',
    optimal: 'Оптимальный подход',
    alternatives: 'Допустимые альтернативы',
    solution: 'Полное решение',
    checkAnswer: 'Проверить выбор',
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
    modes: 'Learning mode',
    recognize: 'Recognize pattern',
    solve: 'Solve',
    learn: 'Learn',
    choosePattern: 'Choose an approach',
    explain: 'Explain the choice and estimate complexity',
    feedback: 'Feedback',
    optimal: 'Optimal approach',
    alternatives: 'Accepted alternatives',
    solution: 'Full solution',
    checkAnswer: 'Check choice',
  },
} as const;

export function StudyFlowPage({ locale, sessionId }: { locale: Locale; sessionId?: string }) {
  const t = text[locale];
  // The static HTML has no query or browser storage; hydrate that same snapshot first.
  const [progress, setProgress] = useState<StudyProgress>(createEmptyStudyProgress);
  const [ready, setReady] = useState(false);
  const storage = useRef<ReturnType<typeof openStudyProgress> | null>(null);
  useEffect(() => {
    storage.current = openStudyProgress(window);
    setProgress(storage.current.progress);
    setReady(true);
  }, []);
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
  if (!ready)
    return (
      <main
        id="main"
        className="study-session"
        aria-busy="true"
        aria-label={session.title[locale]}
      />
    );
  return (
    <Session
      key={session.id}
      locale={locale}
      session={session}
      progress={progress}
      onProgress={(next) => {
        setProgress(next);
        storage.current?.write(next);
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
  const cardIds = useMemo(() => session.cards.map(({ id }) => id), [session.cards]);
  const initialNavigation = useMemo(
    () =>
      parseStudyFlowLocation(location.search, cardIds, progress.sessions[session.id]?.lastCardId),
    // Session is keyed by ID; this navigation snapshot belongs to this mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [index, setIndex] = useState(() => cardIds.indexOf(initialNavigation.cardId));
  const [revealed, setRevealed] = useState(false);
  const [seed, setSeed] = useState(initialNavigation.seed);
  const [mode, setMode] = useState<StudyMode>(initialNavigation.mode);
  const [selectedPattern, setSelectedPattern] = useState('');
  const [explanation, setExplanation] = useState('');
  const [checked, setChecked] = useState(false);
  const [ready, setReady] = useState(false);
  const touch = useRef<{ x: number; y: number; interactive: boolean } | null>(null);
  const card = session.cards[index];
  const patternId = session.id.startsWith('algorithm-')
    ? session.id.slice('algorithm-'.length)
    : undefined;
  const pattern = algorithmPatterns.find((item) => item.id === patternId);
  const practiceProblems =
    pattern?.practiceProblemIds
      .map((id) => algorithmProblems.find((problem) => problem.id === id))
      .filter((problem) => problem !== undefined) ?? [];
  const problem = practiceProblems[Math.abs(seed) % Math.max(1, practiceProblems.length)];
  const recognitionOptions = pattern
    ? [
        ...algorithmPatterns
          .filter((item) => item.priority === pattern.priority && item.id !== pattern.id)
          .slice(0, 3),
        pattern,
      ].sort((a, b) => a.id.localeCompare(b.id))
    : [];
  const sessionPath = preparationPath(locale, `session/${session.id}`);
  function replaceUrl(nextIndex: number, nextSeed = seed, nextMode = mode) {
    const url = createStudyFlowUrl(sessionPath, {
      cardId: session.cards[nextIndex].id,
      seed: nextSeed,
      mode: nextMode,
    });
    if (typeof history !== 'undefined' && `${location.pathname}${location.search}` !== url)
      history.replaceState({}, '', url);
  }
  function move(next: number) {
    const bounded = Math.max(0, Math.min(session.cards.length - 1, next));
    if (bounded === index) return;
    setIndex(bounded);
    setRevealed(false);
    const url = createStudyFlowUrl(sessionPath, {
      cardId: session.cards[bounded].id,
      seed,
      mode,
    });
    if (typeof history !== 'undefined' && `${location.pathname}${location.search}` !== url)
      history.pushState({}, '', url);
    onProgress(recordCardVisit(progress, session.id, session.version, session.cards[bounded].id));
  }
  useEffect(() => {
    if (initialNavigation.needsCanonicalization)
      replaceUrl(index, initialNavigation.seed, initialNavigation.mode);
    onProgress(recordCardVisit(progress, session.id, session.version, initialNavigation.cardId));
    // Session is keyed by ID; visible-visit initialization happens once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const pop = () => {
      if (location.pathname !== sessionPath) return;
      const nextLocation = parseStudyFlowLocation(
        location.search,
        cardIds,
        progress.sessions[session.id]?.lastCardId,
      );
      const next = session.cards.findIndex((card) => card.id === nextLocation.cardId);
      setIndex(next);
      setSeed(nextLocation.seed);
      setMode(nextLocation.mode);
      setRevealed(false);
      if (next !== index)
        onProgress(recordCardVisit(progress, session.id, session.version, nextLocation.cardId));
      if (nextLocation.needsCanonicalization)
        replaceUrl(next, nextLocation.seed, nextLocation.mode);
    };
    const key = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        target.isContentEditable ||
        target.closest('input, textarea, select, button, a, [role="button"]')
      )
        return;
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
  }, [cardIds, index, locale, mode, progress, seed, session.id, session.cards]);
  const challenge = card.challengeTemplateId ? generateEventLoopChallenge(seed) : undefined;
  function finish(confidence: Confidence, skipped = false) {
    onProgress(
      completeSession(progress, session.id, session.version, confidence, new Date(), skipped),
    );
    setReady(false);
  }
  return (
    <article
      className="study-session"
      aria-labelledby="session-title"
      onTouchStart={(e) => {
        const p = e.touches[0];
        const target = e.target as HTMLElement;
        if (p)
          touch.current = {
            x: p.clientX,
            y: p.clientY,
            interactive: Boolean(
              target.closest(
                'button, a, input, textarea, select, pre, code, [contenteditable="true"]',
              ),
            ),
          };
      }}
      onTouchEnd={(e) => {
        const start = touch.current,
          p = e.changedTouches[0];
        touch.current = null;
        if (!start || !p || start.interactive || getSelection()?.toString()) return;
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
        {pattern && (
          <nav className="study-mode-switch" aria-label={t.modes}>
            {(['learn', 'recognize', 'solve'] as const).map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={mode === value}
                onClick={() => {
                  setMode(value);
                  setChecked(false);
                  const url = createStudyFlowUrl(sessionPath, {
                    cardId: card.id,
                    seed,
                    mode: value,
                  });
                  if (`${location.pathname}${location.search}` !== url)
                    history.pushState({}, '', url);
                }}
              >
                {t[value]}
              </button>
            ))}
          </nav>
        )}
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
        {mode === 'learn' || !pattern || !problem ? (
          <p>{card.body[locale]}</p>
        ) : (
          <section className="algorithm-practice" aria-labelledby="algorithm-prompt">
            <h3 id="algorithm-prompt">
              {mode === 'recognize' ? t.choosePattern : problem.title[locale]}
            </h3>
            <p>{problem.prompt[locale]}</p>
            {mode === 'recognize' ? (
              <>
                <fieldset>
                  <legend>{t.choosePattern}</legend>
                  {recognitionOptions.map((option) => (
                    <label key={option.id}>
                      <input
                        type="radio"
                        name="pattern"
                        value={option.id}
                        checked={selectedPattern === option.id}
                        onChange={() => {
                          setSelectedPattern(option.id);
                          setChecked(false);
                        }}
                      />
                      {option.name[locale]}
                    </label>
                  ))}
                </fieldset>
                <label>
                  {t.explain}
                  <textarea
                    value={explanation}
                    onChange={(event) => setExplanation(event.target.value)}
                  />
                </label>
                <button
                  type="button"
                  disabled={!selectedPattern}
                  onClick={() => {
                    setChecked(true);
                    const correct = problem.acceptedPatternIds.includes(selectedPattern as never);
                    onProgress(
                      recordAlgorithmAttempt(progress, problem.id, {
                        mode: 'recognize',
                        result: correct ? 'correct' : 'incorrect',
                        errorKinds: correct ? [] : ['pattern-recognition'],
                        attemptedAt: new Date().toISOString(),
                      }),
                    );
                  }}
                >
                  {t.checkAnswer}
                </button>
              </>
            ) : (
              <>
                <p>
                  <strong>{problem.input[locale]}</strong>
                </p>
                <ul>
                  {problem.edgeCases.map((item, i) => (
                    <li key={i}>{item[locale]}</li>
                  ))}
                </ul>
                <button type="button" aria-expanded={checked} onClick={() => setChecked(!checked)}>
                  {t.solution}
                </button>
              </>
            )}
            {checked && (
              <div className="algorithm-feedback" aria-live="polite">
                <h4>{t.feedback}</h4>
                <p>
                  <strong>{t.optimal}:</strong>{' '}
                  {
                    algorithmPatterns.find((item) => item.id === problem.primaryPatternId)?.name[
                      locale
                    ]
                  }{' '}
                  · {problem.timeComplexity} / {problem.spaceComplexity}
                </p>
                <p>
                  <strong>{t.alternatives}:</strong>{' '}
                  {problem.alternatives.map((item) => item[locale]).join(' ')}
                </p>
                <p>{problem.explanation[locale]}</p>
                {mode === 'solve' && (
                  <pre>
                    <code>{problem.solutionTypeScript}</code>
                  </pre>
                )}
              </div>
            )}
          </section>
        )}
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
                const next = seed >= 2_147_483_647 ? 0 : seed + 1;
                setSeed(next);
                const url = createStudyFlowUrl(sessionPath, { cardId: card.id, seed: next, mode });
                if (`${location.pathname}${location.search}` !== url)
                  history.pushState({}, '', url);
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
    </article>
  );
}
