import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { Locale } from '../../content';
import {
  exerciseCategories,
  exerciseDifficulties,
  filterAndSortExercises,
  interviewExercises,
  nextHintCount,
  progressStatuses,
  type ExerciseCategory,
  type ExerciseFilters,
  type InterviewExercise,
  type ProgressStatus,
} from '../../content/interview';
import { interviewPath, preparationPath } from '../../app/routes';
import {
  learningPaths,
  preparationTopics,
  resolveExerciseNavigation,
  topicForExercise,
} from '../../content/preparation';
import {
  INTERVIEW_PROGRESS_KEY,
  LEGACY_INTERVIEW_PROGRESS_KEY,
  readProgress,
  resetProgress,
  updateProgress,
  writeProgress,
  type InterviewProgress,
} from './progress';

const labels = {
  en: {
    title: 'Interview Lab',
    intro:
      'Practical senior-level JavaScript, TypeScript, browser, security, and system-design exercises. Work from the problem through progressive hints before comparing your reasoning with a reference solution.',
    search: 'Search exercises',
    searchPlaceholder: 'Title, description, or tag',
    category: 'Category',
    difficulty: 'Difficulty',
    status: 'Progress',
    sort: 'Sort',
    all: 'All',
    defaultSort: 'Default order',
    difficultySort: 'Difficulty',
    durationSort: 'Duration',
    empty: 'No exercises match these filters.',
    resetFilters: 'Clear filters',
    resetProgress: 'Reset progress',
    resetConfirm: 'Reset progress for all Interview Lab exercises?',
    notStarted: 'Not started',
    inProgress: 'In progress',
    needsReview: 'Needs review',
    completed: 'Completed',
    minutes: 'min',
    back: 'All exercises',
    problem: 'Problem statement',
    examples: 'Examples',
    requirements: 'Requirements and constraints',
    starter: 'Starter code',
    hints: 'Progressive hints',
    revealHint: 'Reveal next hint',
    solution: 'Reference solution',
    showSolution: 'Show solution',
    hideSolution: 'Hide solution',
    copy: 'Copy code',
    copied: 'Copied',
    copyFailed: 'Select the visible code manually',
    allHints: 'All hints revealed',
    results: 'Exercises shown',
    explanation: 'Why it works',
    edgeCases: 'Edge cases',
    complexity: 'Complexity analysis',
    alternatives: 'Alternative approaches',
    followUps: 'Senior follow-up questions',
    production: 'Production considerations',
    reading: 'Further reading',
    runtime: 'Runtime',
    exercise: 'Exercise',
    preparation: 'Interview Preparation',
    topics: 'Theory topics',
    practice: 'Practice exercises',
    paths: 'Learning paths',
    continueLearning: 'Continue learning',
    shortAnswer: '30–60 second answer',
    detailed: 'Detailed explanation',
    mistakes: 'Common mistakes',
    relatedTheory: 'Related theory',
    relatedPractice: 'Related practice',
    previous: 'Previous exercise',
    next: 'Next exercise',
    position: 'Position',
  },
  ru: {
    title: 'Лаборатория интервью',
    intro:
      'Практические задания уровня Senior по JavaScript, TypeScript, браузеру, безопасности и системному дизайну. Сначала разберите условие и последовательные подсказки, затем сравните рассуждения с эталонным решением.',
    search: 'Поиск заданий',
    searchPlaceholder: 'Название, описание или тег',
    category: 'Категория',
    difficulty: 'Сложность',
    status: 'Прогресс',
    sort: 'Сортировка',
    all: 'Все',
    defaultSort: 'По умолчанию',
    difficultySort: 'По сложности',
    durationSort: 'По времени',
    empty: 'Нет заданий, соответствующих фильтрам.',
    resetFilters: 'Очистить фильтры',
    resetProgress: 'Сбросить прогресс',
    resetConfirm: 'Сбросить прогресс по всем заданиям?',
    notStarted: 'Не начато',
    inProgress: 'В процессе',
    needsReview: 'Нужно повторить',
    completed: 'Завершено',
    minutes: 'мин',
    back: 'Все задания',
    problem: 'Условие задачи',
    examples: 'Примеры',
    requirements: 'Требования и ограничения',
    starter: 'Начальный код',
    hints: 'Последовательные подсказки',
    revealHint: 'Открыть следующую подсказку',
    solution: 'Эталонное решение',
    showSolution: 'Показать решение',
    hideSolution: 'Скрыть решение',
    copy: 'Копировать код',
    copied: 'Скопировано',
    copyFailed: 'Выделите видимый код вручную',
    allHints: 'Все подсказки открыты',
    results: 'Показано заданий',
    explanation: 'Почему это работает',
    edgeCases: 'Граничные случаи',
    complexity: 'Оценка сложности',
    alternatives: 'Альтернативные подходы',
    followUps: 'Дополнительные вопросы уровня Senior',
    production: 'Продакшен-соображения',
    reading: 'Дополнительные материалы',
    runtime: 'Среда',
    exercise: 'Задание',
    preparation: 'Подготовка к интервью',
    topics: 'Теоретические темы',
    practice: 'Практические задания',
    paths: 'Учебные маршруты',
    continueLearning: 'Продолжить обучение',
    shortAnswer: 'Ответ на 30–60 секунд',
    detailed: 'Подробное объяснение',
    mistakes: 'Типичные ошибки',
    relatedTheory: 'Связанная теория',
    relatedPractice: 'Связанная практика',
    previous: 'Предыдущее задание',
    next: 'Следующее задание',
    position: 'Позиция',
  },
} as const;

const categoryLabels: Record<Locale, Record<ExerciseCategory, string>> = {
  en: {
    javascript: 'JavaScript & async',
    typescript: 'TypeScript',
    browser: 'Browser & performance',
    security: 'Security',
    architecture: 'System design',
  },
  ru: {
    javascript: 'JavaScript и асинхронность',
    typescript: 'TypeScript',
    browser: 'Браузер и производительность',
    security: 'Безопасность',
    architecture: 'Системный дизайн',
  },
};
const difficultyLabels: Record<Locale, Record<InterviewExercise['difficulty'], string>> = {
  en: { medium: 'Medium', hard: 'Hard', senior: 'Senior' },
  ru: { medium: 'Средняя', hard: 'Сложная', senior: 'Senior' },
};
const statusLabel = (locale: Locale, status: ProgressStatus) =>
  labels[locale][
    status === 'not-started'
      ? 'notStarted'
      : status === 'in-progress'
        ? 'inProgress'
        : status === 'needs-review'
          ? 'needsReview'
          : 'completed'
  ];

const emptyProgress: InterviewProgress = {};
let progressSnapshot = emptyProgress;
const progressListeners = new Set<() => void>();

function publishProgress(progress: InterviewProgress) {
  progressSnapshot = progress;
  for (const listener of progressListeners) listener();
}

function subscribeProgress(listener: () => void) {
  progressListeners.add(listener);
  const stored = readProgress(window.localStorage);
  if (JSON.stringify(stored) !== JSON.stringify(progressSnapshot)) publishProgress(stored);
  const syncAcrossTabs = (event: StorageEvent) => {
    if (event.key === INTERVIEW_PROGRESS_KEY || event.key === LEGACY_INTERVIEW_PROGRESS_KEY)
      publishProgress(readProgress(window.localStorage));
  };
  window.addEventListener('storage', syncAcrossTabs);
  return () => {
    progressListeners.delete(listener);
    window.removeEventListener('storage', syncAcrossTabs);
  };
}

function useProgress() {
  const progress = useSyncExternalStore(
    subscribeProgress,
    () => progressSnapshot,
    () => emptyProgress,
  );
  const setStatus = (slug: string, status: ProgressStatus) => {
    const next = updateProgress(progressSnapshot, slug, status);
    writeProgress(window.localStorage, next);
    publishProgress(next);
  };
  const clear = () => {
    resetProgress(window.localStorage);
    publishProgress(emptyProgress);
  };
  return { progress, setStatus, clear };
}

function CodeBlock({
  label,
  language,
  code,
  locale,
}: {
  label: string;
  language: string;
  code: string;
  locale: Locale;
}) {
  const t = labels[locale];
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const resetTimer = useRef<number | undefined>(undefined);
  useEffect(
    () => () => {
      if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current);
    },
    [],
  );
  async function copyCode() {
    if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
    resetTimer.current = window.setTimeout(() => {
      setCopyState('idle');
      resetTimer.current = undefined;
    }, 1200);
  }
  return (
    <figure className="interview-code">
      <figcaption>
        <span>
          {label} · {language}
        </span>
        <button className="requires-js" type="button" onClick={() => void copyCode()}>
          {t.copy}
        </button>
        <span className="visually-hidden" role="status" aria-live="polite">
          {copyState === 'copied' ? t.copied : copyState === 'failed' ? t.copyFailed : ''}
        </span>
      </figcaption>
      <pre>
        <code data-language={language}>{code}</code>
      </pre>
    </figure>
  );
}

function ProgressSelect({
  locale,
  value,
  onChange,
  label,
}: {
  locale: Locale;
  value: ProgressStatus;
  onChange: (status: ProgressStatus) => void;
  label: string;
}) {
  return (
    <label className="progress-select">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.currentTarget.value as ProgressStatus)}
      >
        {progressStatuses.map((status) => (
          <option key={status} value={status}>
            {statusLabel(locale, status)}
          </option>
        ))}
      </select>
    </label>
  );
}

function ExerciseArticle({
  exercise,
  locale,
  status,
  setStatus,
}: {
  exercise: InterviewExercise;
  locale: Locale;
  status: ProgressStatus;
  setStatus: (status: ProgressStatus) => void;
}) {
  const t = labels[locale];
  const article = exercise.content[locale];
  const [hintCount, setHintCount] = useState(0);
  const [solutionVisible, setSolutionVisible] = useState(false);
  const pathId = useSyncExternalStore(
    () => () => undefined,
    () => new URLSearchParams(window.location.search).get('path') ?? undefined,
    () => undefined,
  );
  const navigation = resolveExerciseNavigation(exercise.slug, { pathId });
  const theory = topicForExercise(exercise.id);
  const exerciseHref = (target: InterviewExercise) =>
    `${preparationPath(locale, `practice/${target.slug}`)}${navigation.context ? `?path=${encodeURIComponent(navigation.context)}` : ''}`;
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
      const destination =
        event.altKey && event.key === 'ArrowLeft'
          ? navigation.previous
          : event.altKey && event.key === 'ArrowRight'
            ? navigation.next
            : undefined;
      if (destination) window.location.assign(exerciseHref(destination));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });
  return (
    <article className="interview-page exercise-page" aria-labelledby="exercise-title">
      <nav className="exercise-navigation" aria-label={t.practice}>
        <a className="text-link interview-back" href={preparationPath(locale, 'practice')}>
          ← {t.back}
        </a>
        <span>
          {t.position}: {navigation.position}/{navigation.total}
        </span>
        {navigation.previous && (
          <a className="text-link" rel="prev" href={exerciseHref(navigation.previous)}>
            ← {t.previous}
          </a>
        )}
        {navigation.next && (
          <a className="text-link" rel="next" href={exerciseHref(navigation.next)}>
            {t.next} →
          </a>
        )}
      </nav>
      <header className="exercise-header">
        <p className="eyebrow">
          {t.exercise} {exercise.id} · {categoryLabels[locale][exercise.category]}
        </p>
        <h1 id="exercise-title">{article.title}</h1>
        <p className="exercise-description">{article.description}</p>
        <div className="exercise-meta">
          <span>{difficultyLabels[locale][exercise.difficulty]}</span>
          <span>
            {exercise.estimatedMinutes} {t.minutes}
          </span>
          <span>
            {t.runtime}: {exercise.runtime}
          </span>
        </div>
        <ProgressSelect locale={locale} value={status} onChange={setStatus} label={t.status} />
        {theory && (
          <p>
            <a className="text-link" href={preparationPath(locale, `topics/${theory.slug}`)}>
              {t.relatedTheory}: {theory.title[locale]}
            </a>
          </p>
        )}
      </header>
      <div className="exercise-layout">
        <div className="exercise-statement">
          <section>
            <h2>{t.problem}</h2>
            <p>{article.problem}</p>
          </section>
          {article.examples.length > 0 && (
            <section>
              <h2>{t.examples}</h2>
              <ul>
                {article.examples.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h2>{t.requirements}</h2>
            <ul>
              {article.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          {article.starterCode && (
            <section>
              <h2>{t.starter}</h2>
              <CodeBlock {...article.starterCode} locale={locale} />
            </section>
          )}
        </div>
        <aside className="hint-panel" aria-labelledby="hints-title">
          <h2 id="hints-title">{t.hints}</h2>
          <div id="revealed-hints">
            {article.hints.slice(0, hintCount).map((hint, index) => (
              <section key={hint} tabIndex={-1}>
                <h3>{locale === 'ru' ? `Подсказка ${index + 1}` : `Hint ${index + 1}`}</h3>
                <p>{hint}</p>
              </section>
            ))}
          </div>
          <button
            className="requires-js"
            type="button"
            aria-controls="revealed-hints"
            aria-expanded={hintCount === 3}
            disabled={hintCount === 3}
            onClick={() => {
              setHintCount((count) => nextHintCount(count));
              if (status === 'not-started') setStatus('in-progress');
            }}
          >
            {hintCount === 3 ? t.allHints : `${t.revealHint} (${hintCount + 1}/3)`}
          </button>
          <noscript>
            {article.hints.map((hint, index) => (
              <section key={hint}>
                <h3>{locale === 'ru' ? `Подсказка ${index + 1}` : `Hint ${index + 1}`}</h3>
                <p>{hint}</p>
              </section>
            ))}
          </noscript>
        </aside>
      </div>
      <section className="solution-section" aria-labelledby="solution-title">
        <div className="solution-heading">
          <h2 id="solution-title">{t.solution}</h2>
          <button
            className="requires-js"
            type="button"
            aria-expanded={solutionVisible}
            aria-controls="solution-content"
            onClick={() => {
              setSolutionVisible((visible) => !visible);
              if (status === 'not-started') setStatus('in-progress');
            }}
          >
            {solutionVisible ? t.hideSolution : t.showSolution}
          </button>
        </div>
        {solutionVisible && (
          <div id="solution-content" className="solution-content">
            {article.solution.blocks.map((block) => (
              <CodeBlock key={`${block.label}-${block.language}`} {...block} locale={locale} />
            ))}
            <section>
              <h3>{t.explanation}</h3>
              {article.explanation.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </section>
            <section>
              <h3>{t.edgeCases}</h3>
              <ul>
                {article.edgeCases.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </section>
            {article.complexity.length > 0 && (
              <section>
                <h3>{t.complexity}</h3>
                <ul>
                  {article.complexity.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              </section>
            )}
            {article.solution.alternative.length > 0 && (
              <section>
                <h3>{t.alternatives}</h3>
                <ul>
                  {article.solution.alternative.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              </section>
            )}
            <section>
              <h3>{t.followUps}</h3>
              <ol>
                {article.followUps.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ol>
            </section>
            <section>
              <h3>{t.production}</h3>
              {article.production.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </section>
            {article.furtherReading.length > 0 && (
              <section>
                <h3>{t.reading}</h3>
                <ul>
                  {article.furtherReading.map((link) => (
                    <li key={link.url}>
                      <a
                        className="text-link"
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
        <noscript>
          <div className="solution-content no-script-solution">
            {article.solution.blocks.map((block) => (
              <figure className="interview-code" key={`${block.label}-${block.language}`}>
                <figcaption>
                  {block.label} · {block.language}
                </figcaption>
                <pre>
                  <code data-language={block.language}>{block.code}</code>
                </pre>
              </figure>
            ))}
            <section>
              <h3>{t.explanation}</h3>
              {article.explanation.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </section>
            <section>
              <h3>{t.edgeCases}</h3>
              <ul>
                {article.edgeCases.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>{t.followUps}</h3>
              <ol>
                {article.followUps.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ol>
            </section>
            <section>
              <h3>{t.production}</h3>
              {article.production.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </section>
          </div>
        </noscript>
      </section>
    </article>
  );
}

export function InterviewPage({
  locale,
  slug,
  view = 'home',
}: {
  locale: Locale;
  slug?: string;
  view?: 'home' | 'topics' | 'topic' | 'practice' | 'paths';
}) {
  const t = labels[locale];
  const { progress, setStatus, clear } = useProgress();
  const [filters, setFilters] = useState<ExerciseFilters>({
    query: '',
    category: 'all',
    difficulty: 'all',
    status: 'all',
    sort: 'default',
  });
  const matches = useMemo(
    () => filterAndSortExercises(interviewExercises, locale, filters, progress),
    [filters, locale, progress],
  );
  const exercise = slug ? interviewExercises.find((item) => item.slug === slug) : undefined;
  const topic = view === 'topic' ? preparationTopics.find((item) => item.slug === slug) : undefined;
  if (topic) {
    const theory = topic.theory;
    return (
      <article className="interview-page exercise-page" aria-labelledby="topic-title">
        <a className="text-link interview-back" href={preparationPath(locale, 'topics')}>
          ← {t.topics}
        </a>
        <p className="eyebrow">{topic.category}</p>
        <h1 id="topic-title">{topic.title[locale]}</h1>
        <p className="exercise-description">{topic.description[locale]}</p>
        <section>
          <h2>{t.shortAnswer}</h2>
          <p>{theory.shortAnswer[locale]}</p>
        </section>
        <section>
          <h2>{t.detailed}</h2>
          {theory.detailedExplanation[locale].map((text) => (
            <p key={text}>{text}</p>
          ))}
        </section>
        {theory.codeExamples.map((example) => (
          <CodeBlock
            key={example.label[locale]}
            label={example.label[locale]}
            language={example.language}
            code={example.code}
            locale={locale}
          />
        ))}
        <section>
          <h2>{t.mistakes}</h2>
          <ul>
            {theory.commonMistakes[locale].map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>
        {topic.practiceIds.length > 0 && (
          <section>
            <h2>{t.relatedPractice}</h2>
            <ul>
              {topic.practiceIds.map((id) => {
                const item = interviewExercises.find((candidate) => candidate.id === id);
                return item ? (
                  <li key={id}>
                    <a
                      className="text-link"
                      href={preparationPath(locale, `practice/${item.slug}`)}
                    >
                      {item.content[locale].title}
                    </a>
                  </li>
                ) : null;
              })}
            </ul>
          </section>
        )}
        <section>
          <h2>{t.reading}</h2>
          <ul>
            {topic.references.map((reference) => (
              <li key={reference.url}>
                <a
                  className="text-link"
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {reference.title} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>
    );
  }
  if (exercise)
    return (
      <ExerciseArticle
        exercise={exercise}
        locale={locale}
        status={progress[exercise.slug] ?? 'not-started'}
        setStatus={(status) => setStatus(exercise.slug, status)}
      />
    );
  if (view === 'home')
    return (
      <section className="interview-page" aria-labelledby="interview-title">
        <p className="eyebrow">{t.preparation}</p>
        <h1 id="interview-title">{t.preparation}</h1>
        <p className="interview-intro">{t.intro}</p>
        <div className="exercise-grid">
          <article className="exercise-card">
            <h2>
              <a href={preparationPath(locale, 'topics')}>{t.topics}</a>
            </h2>
            <p>
              {preparationTopics.length} {locale === 'ru' ? 'тем' : 'topics'}
            </p>
          </article>
          <article className="exercise-card">
            <h2>
              <a href={preparationPath(locale, 'practice')}>{t.practice}</a>
            </h2>
            <p>
              {interviewExercises.length} {locale === 'ru' ? 'заданий' : 'exercises'}
            </p>
          </article>
          <article className="exercise-card">
            <h2>
              <a href={preparationPath(locale, 'paths')}>{t.paths}</a>
            </h2>
            <p>
              {learningPaths.length} {locale === 'ru' ? 'маршрутов' : 'paths'}
            </p>
          </article>
        </div>
      </section>
    );
  if (view === 'topics')
    return (
      <section className="interview-page" aria-labelledby="topics-title">
        <p className="eyebrow">{t.preparation}</p>
        <h1 id="topics-title">{t.topics}</h1>
        <div className="exercise-grid">
          {preparationTopics.map((item) => (
            <article className="exercise-card" key={item.id}>
              <p className="note-category">{item.category}</p>
              <h2>
                <a href={preparationPath(locale, `topics/${item.slug}`)}>{item.title[locale]}</a>
              </h2>
              <p>{item.description[locale]}</p>
              <div className="exercise-meta">
                <span>
                  {item.estimatedMinutes} {t.minutes}
                </span>
                <span>{difficultyLabels[locale][item.difficulty]}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  if (view === 'paths')
    return (
      <section className="interview-page" aria-labelledby="paths-title">
        <p className="eyebrow">{t.preparation}</p>
        <h1 id="paths-title">{t.paths}</h1>
        <div className="exercise-grid">
          {learningPaths.map((path) => (
            <article className="exercise-card" key={path.id}>
              <h2>{path.title[locale]}</h2>
              <p>{path.description[locale]}</p>
              <p>
                {path.estimatedMinutes} {t.minutes}
              </p>
              {path.exerciseIds[0] &&
                (() => {
                  const first = interviewExercises.find(({ id }) => id === path.exerciseIds[0]);
                  return first ? (
                    <a
                      className="text-link"
                      href={`${preparationPath(locale, `practice/${first.slug}`)}?path=${path.id}`}
                    >
                      {t.continueLearning} →
                    </a>
                  ) : null;
                })()}
            </article>
          ))}
        </div>
      </section>
    );
  const update = <Key extends keyof ExerciseFilters>(key: Key, value: ExerciseFilters[Key]) =>
    setFilters((current) => ({ ...current, [key]: value }));
  const resetFilters = () =>
    setFilters({ query: '', category: 'all', difficulty: 'all', status: 'all', sort: 'default' });
  return (
    <section className="interview-page" aria-labelledby="interview-title">
      <p className="eyebrow">{t.title}</p>
      <h1 id="interview-title">{t.title}</h1>
      <p className="interview-intro">{t.intro}</p>
      <div className="interview-toolbar">
        <label>
          <span>{t.search}</span>
          <input
            type="search"
            value={filters.query}
            placeholder={t.searchPlaceholder}
            onChange={(event) => update('query', event.currentTarget.value)}
          />
        </label>
        <label>
          <span>{t.category}</span>
          <select
            value={filters.category}
            onChange={(event) =>
              update('category', event.currentTarget.value as ExerciseFilters['category'])
            }
          >
            <option value="all">{t.all}</option>
            {exerciseCategories.map((value) => (
              <option key={value} value={value}>
                {categoryLabels[locale][value]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{t.difficulty}</span>
          <select
            value={filters.difficulty}
            onChange={(event) =>
              update('difficulty', event.currentTarget.value as ExerciseFilters['difficulty'])
            }
          >
            <option value="all">{t.all}</option>
            {exerciseDifficulties.map((value) => (
              <option key={value} value={value}>
                {difficultyLabels[locale][value]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{t.status}</span>
          <select
            value={filters.status}
            onChange={(event) =>
              update('status', event.currentTarget.value as ExerciseFilters['status'])
            }
          >
            <option value="all">{t.all}</option>
            {progressStatuses.map((value) => (
              <option key={value} value={value}>
                {statusLabel(locale, value)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{t.sort}</span>
          <select
            value={filters.sort}
            onChange={(event) =>
              update('sort', event.currentTarget.value as ExerciseFilters['sort'])
            }
          >
            <option value="default">{t.defaultSort}</option>
            <option value="difficulty">{t.difficultySort}</option>
            <option value="duration">{t.durationSort}</option>
          </select>
        </label>
      </div>
      <div className="interview-actions">
        <button type="button" onClick={resetFilters}>
          {t.resetFilters}
        </button>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(t.resetConfirm)) clear();
          }}
        >
          {t.resetProgress}
        </button>
      </div>
      <p className="visually-hidden" role="status" aria-live="polite">
        {t.results}: {matches.length}
      </p>
      <div className="exercise-grid">
        {matches.length ? (
          matches.map((item) => {
            const article = item.content[locale];
            const status = progress[item.slug] ?? 'not-started';
            return (
              <article className="exercise-card" key={item.id}>
                <div className="exercise-card-heading">
                  <span className="exercise-number">{item.id}</span>
                  <span className={`progress-badge status-${status}`}>
                    {statusLabel(locale, status)}
                  </span>
                </div>
                <p className="note-category">{categoryLabels[locale][item.category]}</p>
                <h2>
                  <a
                    href={
                      view === 'practice'
                        ? preparationPath(locale, `practice/${item.slug}`)
                        : interviewPath(locale, item.slug)
                    }
                  >
                    {article.title}
                  </a>
                </h2>
                <p>{article.description}</p>
                <div className="exercise-meta">
                  <span>{difficultyLabels[locale][item.difficulty]}</span>
                  <span>
                    {item.estimatedMinutes} {t.minutes}
                  </span>
                </div>
                <ul className="tags" aria-label="Tags">
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            );
          })
        ) : (
          <div className="empty-state">
            <p>{t.empty}</p>
            <button type="button" onClick={resetFilters}>
              {t.resetFilters}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
