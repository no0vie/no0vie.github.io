import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { Locale } from '../content';
import {
  filterNotes,
  noteCategories,
  notePath,
  notes,
  updateInterviewState,
  type NoteCategory,
} from '../content/notes';

const labels = {
  en: {
    title: 'Engineering Notes',
    intro: 'Practical explanations for interview preparation and day-to-day engineering decisions.',
    search: 'Search notes',
    searchPlaceholder: 'Question, topic, or keyword',
    categories: 'Categories',
    all: 'All notes',
    empty: 'No notes match this search and category.',
    clear: 'Clear search and filters',
    interview: 'Interview mode',
    interviewHint: 'Answers stay hidden until you reveal them. Nothing is stored.',
    reveal: 'Reveal answer',
    hide: 'Hide answer',
    short: 'Short answer',
    deep: 'Deep dive',
    example: 'Example',
    pitfalls: 'Pitfalls and tradeoffs',
    followUps: 'Follow-up questions',
    sources: 'Primary sources',
    reviewed: 'Reviewed',
    backToNotes: 'All engineering notes',
    category: 'Category',
  },
  ru: {
    title: 'Инженерные заметки',
    intro: 'Практические объяснения для подготовки к интервью и повседневных инженерных решений.',
    search: 'Поиск по заметкам',
    searchPlaceholder: 'Вопрос, тема или ключевое слово',
    categories: 'Категории',
    all: 'Все заметки',
    empty: 'По этому запросу и категории заметок нет.',
    clear: 'Очистить поиск и фильтры',
    interview: 'Режим интервью',
    interviewHint: 'Ответы скрыты, пока вы их не откроете. Ничего не сохраняется.',
    reveal: 'Показать ответ',
    hide: 'Скрыть ответ',
    short: 'Короткий ответ',
    deep: 'Подробное объяснение',
    example: 'Пример',
    pitfalls: 'Ошибки и компромиссы',
    followUps: 'Дополнительные вопросы',
    sources: 'Первоисточники',
    reviewed: 'Проверено',
    backToNotes: 'Все инженерные заметки',
    category: 'Категория',
  },
} as const;

export const categoryLabels: Record<Locale, Record<NoteCategory, string>> = {
  en: {
    'browser-js': 'Browser & JavaScript',
    'react-state': 'React & State',
    architecture: 'Architecture',
    'production-testing': 'Production & Testing',
  },
  ru: {
    'browser-js': 'Браузер и JavaScript',
    'react-state': 'React и состояние',
    architecture: 'Архитектура',
    'production-testing': 'Продакшен и тестирование',
  },
};

function useInterviewState() {
  return useReducer(updateInterviewState, { enabled: false, revealed: new Set<string>() });
}

export function NotesPage({ locale, slug }: { locale: Locale; slug?: string }) {
  const t = labels[locale];
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<NoteCategory | ''>('');
  const [interview, dispatchInterview] = useInterviewState();
  const queryInitialized = useRef(false);

  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get('q') ?? '');
      const value = params.get('category');
      setCategory(noteCategories.includes(value as NoteCategory) ? (value as NoteCategory) : '');
    };
    const timer = window.setTimeout(() => {
      queryInitialized.current = true;
      sync();
    }, 0);
    window.addEventListener('popstate', sync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  useEffect(() => {
    const showAnswersForPrint = () => dispatchInterview({ type: 'disable' });
    window.addEventListener('beforeprint', showAnswersForPrint);
    return () => window.removeEventListener('beforeprint', showAnswersForPrint);
  }, [dispatchInterview]);

  useEffect(() => {
    if (!queryInitialized.current) return;
    const params = new URLSearchParams(window.location.search);
    params.set('lang', locale);
    if (query) params.set('q', query);
    else params.delete('q');
    if (category) params.set('category', category);
    else params.delete('category');
    window.history.replaceState(null, '', `${window.location.pathname}?${params}`);
  }, [category, locale, query]);

  const matches = useMemo(
    () => filterNotes(notes, locale, query, category ? [category] : []),
    [category, locale, query],
  );
  const note = slug ? notes.find((item) => item.slug === slug) : undefined;
  const resetFilters = () => {
    setQuery('');
    setCategory('');
  };

  if (slug && note) {
    const article = note[locale];
    const revealed = !interview.enabled || interview.revealed.has(note.id);
    return (
      <article className="notes-page note-article" aria-labelledby="note-title">
        <a className="text-link notes-back" href={notePath(locale)}>
          {t.backToNotes}
        </a>
        <p className="eyebrow">{categoryLabels[locale][note.category]}</p>
        <h1 id="note-title">{article.question}</h1>
        <div className="interview-control">
          <label>
            <input
              type="checkbox"
              checked={interview.enabled}
              onChange={(event) =>
                dispatchInterview({ type: event.currentTarget.checked ? 'enable' : 'disable' })
              }
            />{' '}
            {t.interview}
          </label>
          <small>{t.interviewHint}</small>
        </div>
        {interview.enabled && (
          <button
            className="button reveal-button"
            type="button"
            aria-expanded={revealed}
            aria-controls="note-answer"
            onClick={() => dispatchInterview({ type: 'toggle-reveal', id: note.id })}
          >
            {revealed ? t.hide : t.reveal}
          </button>
        )}
        {revealed && (
          <div id="note-answer" className="note-answer">
            <section className="short-answer" aria-labelledby="short-answer-title">
              <h2 id="short-answer-title">{t.short}</h2>
              <p>{article.shortAnswer}</p>
            </section>
            <section aria-labelledby="deep-dive-title">
              <h2 id="deep-dive-title">{t.deep}</h2>
              {article.deepDive.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
            <section aria-labelledby="example-title">
              <h2 id="example-title">{t.example}</h2>
              <h3>{article.example.label}</h3>
              <pre>
                <code data-language={article.example.language}>{article.example.code}</code>
              </pre>
              <p>{article.example.explanation}</p>
            </section>
            <section aria-labelledby="pitfalls-title">
              <h2 id="pitfalls-title">{t.pitfalls}</h2>
              <ul>
                {article.pitfalls.map((pitfall) => (
                  <li key={pitfall}>{pitfall}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="follow-ups-title">
              <h2 id="follow-ups-title">{t.followUps}</h2>
              <ol>
                {article.followUps.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ol>
            </section>
            <section aria-labelledby="sources-title">
              <h2 id="sources-title">{t.sources}</h2>
              <ul className="source-list">
                {note.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      className="text-link"
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.title} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
        <p className="reviewed-date">
          {t.reviewed}: <time dateTime={note.reviewedAt}>{note.reviewedAt}</time>
        </p>
      </article>
    );
  }

  return (
    <section className="notes-page" aria-labelledby="notes-title">
      <p className="eyebrow">{t.title}</p>
      <h1 id="notes-title">{t.title}</h1>
      <p className="notes-intro">{t.intro}</p>
      <div className="notes-tools">
        <label className="notes-search">
          <span>{t.search}</span>
          <input
            type="search"
            value={query}
            placeholder={t.searchPlaceholder}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>
        <fieldset className="category-filters">
          <legend>{t.categories}</legend>
          <label>
            <input
              type="radio"
              name="category"
              checked={!category}
              onChange={() => setCategory('')}
            />{' '}
            {t.all}
          </label>
          {noteCategories.map((item) => (
            <label key={item}>
              <input
                type="radio"
                name="category"
                checked={category === item}
                onChange={() => setCategory(item)}
              />{' '}
              {categoryLabels[locale][item]}
            </label>
          ))}
        </fieldset>
      </div>
      <div className="notes-list" aria-live="polite">
        {matches.length ? (
          matches.map((item) => (
            <article className="note-card" key={item.id}>
              <p className="note-category">{categoryLabels[locale][item.category]}</p>
              <h2>
                <a href={notePath(locale, item.slug)}>{item[locale].question}</a>
              </h2>
              <p>{item[locale].shortAnswer}</p>
              <p className="reviewed-date">
                {t.reviewed}: <time dateTime={item.reviewedAt}>{item.reviewedAt}</time>
              </p>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <p>{t.empty}</p>
            <button type="button" onClick={resetFilters}>
              {t.clear}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
