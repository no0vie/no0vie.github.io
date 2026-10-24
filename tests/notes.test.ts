import { describe, expect, it } from 'vitest';
import {
  filterNotes,
  notePath,
  notes,
  notesBacklog,
  notesSchema,
  updateInterviewState,
} from '../src/content/notes';

const requiredSlugs = [
  'what-happens-after-entering-a-url',
  'mvc-mvp-mvvm',
  'virtual-dom-relevant-today',
  'javascript-event-loop',
  'react-fiber-render-and-commit',
  'mobx-vs-redux',
  'microfrontends-when-not-to-use-them',
  'frontend-performance-diagnosis',
  'playwright-e2e-and-flaky-tests',
];

describe('engineering notes content', () => {
  it('publishes exactly nine complete bilingual notes with stable unique IDs and slugs', () => {
    expect(notesSchema.parse(notes)).toEqual(notes);
    expect(notes).toHaveLength(9);
    expect(notes.map(({ slug }) => slug)).toEqual(requiredSlugs);
    expect(new Set(notes.map(({ id }) => id)).size).toBe(notes.length);
    expect(new Set(notes.map(({ slug }) => slug)).size).toBe(notes.length);

    for (const note of notes) {
      expect(note.sources.length).toBeGreaterThanOrEqual(2);
      expect(note.reviewedAt).toBe('2026-10-23');
      for (const locale of ['ru', 'en'] as const) {
        const article = note[locale];
        expect(article.question.trim()).not.toBe('');
        expect(article.shortAnswer.length).toBeGreaterThan(120);
        expect(article.deepDive.length).toBeGreaterThanOrEqual(3);
        expect(article.example.code.trim()).not.toBe('');
        expect(article.pitfalls.length).toBeGreaterThanOrEqual(2);
        expect(article.followUps.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('keeps the future topic backlog in source without publishing empty cards', () => {
    expect(notesBacklog.length).toBeGreaterThanOrEqual(10);
    expect(notesBacklog.every((topic) => topic.ru.trim() && topic.en.trim())).toBe(true);
    expect(notes).toHaveLength(9);
  });

  it('searches localized questions, summaries, tags, and keywords case-insensitively', () => {
    expect(filterNotes(notes, 'en', '  EVENT LOOP ', [])).toHaveLength(1);
    expect(filterNotes(notes, 'ru', 'микрозадач', []).map(({ slug }) => slug)).toContain(
      'javascript-event-loop',
    );
    expect(filterNotes(notes, 'en', 'locators', []).map(({ slug }) => slug)).toContain(
      'playwright-e2e-and-flaky-tests',
    );
  });

  it('combines the search query and primary category filter', () => {
    expect(filterNotes(notes, 'en', '', ['architecture'])).toHaveLength(2);
    expect(filterNotes(notes, 'en', 'react', ['architecture']).map(({ slug }) => slug)).toEqual([
      'mvc-mvp-mvvm',
    ]);
    expect(filterNotes(notes, 'ru', 'no result at all', [])).toEqual([]);
  });

  it('builds base-path-safe localized note URLs', () => {
    expect(notePath('ru', undefined, '/')).toBe('/notes?lang=ru');
    expect(notePath('en', 'javascript-event-loop', '/career/')).toBe(
      '/career/notes/javascript-event-loop?lang=en',
    );
  });
});

describe('interview reveal state', () => {
  it('reveals notes independently and resets reveals every time mode is enabled', () => {
    let state = { enabled: false, revealed: new Set<string>(['stale']) };
    state = updateInterviewState(state, { type: 'enable' });
    expect(state.enabled).toBe(true);
    expect([...state.revealed]).toEqual([]);

    state = updateInterviewState(state, { type: 'toggle-reveal', id: 'event-loop' });
    expect([...state.revealed]).toEqual(['event-loop']);
    state = updateInterviewState(state, { type: 'disable' });
    expect(state.enabled).toBe(false);
    state = updateInterviewState(state, { type: 'enable' });
    expect([...state.revealed]).toEqual([]);
  });
});
