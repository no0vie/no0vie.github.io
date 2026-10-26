import { describe, expect, it } from 'vitest';
import {
  filterAndSortExercises,
  interviewExercises,
  interviewExercisesSchema,
  nextHintCount,
} from '../src/content/interview';
import {
  INTERVIEW_PROGRESS_KEY,
  LEGACY_INTERVIEW_PROGRESS_KEY,
  exportProgress,
  importProgress,
  parseProgress,
  readProgress,
  serializeProgress,
  updateProgress,
} from '../src/features/interview/progress';

const requiredSlugs = [
  'event-loop-execution-order',
  'implement-promise-all',
  'concurrency-limiter',
  'production-ready-debounce',
  'autocomplete-race-conditions',
  'discriminated-union-state',
  'type-safe-polymorphic-button',
  'generic-group-by-index-by',
  'diagnose-memory-leak',
  'rendering-100000-items',
  'reactive-store',
  'browser-rendering-performance',
  'frontend-security-review',
  'resumable-large-file-upload',
  'realtime-messaging-system',
];

describe('Interview Lab content', () => {
  it('contains exactly 15 complete, uniquely addressable bilingual exercises', () => {
    expect(interviewExercisesSchema.parse(interviewExercises)).toEqual(interviewExercises);
    expect(interviewExercises.map(({ slug }) => slug)).toEqual(requiredSlugs);
    expect(new Set(interviewExercises.map(({ id }) => id)).size).toBe(15);
    expect(new Set(interviewExercises.map(({ slug }) => slug)).size).toBe(15);

    for (const exercise of interviewExercises) {
      expect(exercise.tags.length).toBeGreaterThan(0);
      for (const locale of ['ru', 'en'] as const) {
        const article = exercise.content[locale];
        expect(article.title.trim()).not.toBe('');
        expect(article.problem.length).toBeGreaterThan(120);
        expect(article.requirements.length).toBeGreaterThanOrEqual(3);
        expect(article.hints.every((hint) => hint.length > 40)).toBe(true);
        expect(article.solution.blocks.length).toBeGreaterThan(0);
        expect(article.explanation.length).toBeGreaterThanOrEqual(2);
        expect(article.edgeCases.length).toBeGreaterThanOrEqual(3);
        expect(article.followUps.length).toBeGreaterThanOrEqual(3);
        expect(article.production.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('filters by text, category, difficulty and completion status together', () => {
    const statuses = {
      'implement-promise-all': 'completed',
      'concurrency-limiter': 'in-progress',
    } as const;
    expect(
      filterAndSortExercises(
        interviewExercises,
        'en',
        {
          query: 'promise',
          category: 'javascript',
          difficulty: 'hard',
          status: 'completed',
          sort: 'default',
        },
        statuses,
      ).map(({ id }) => id),
    ).toEqual(['02']);
  });

  it('sorts by difficulty and estimated duration without mutating source order', () => {
    const original = interviewExercises.map(({ id }) => id);
    const byDuration = filterAndSortExercises(
      interviewExercises,
      'en',
      {
        query: '',
        category: 'all',
        difficulty: 'all',
        status: 'all',
        sort: 'duration',
      },
      {},
    );
    const byDifficulty = filterAndSortExercises(
      interviewExercises,
      'en',
      {
        query: '',
        category: 'all',
        difficulty: 'all',
        status: 'all',
        sort: 'difficulty',
      },
      {},
    );
    expect(byDuration.map(({ estimatedMinutes }) => estimatedMinutes)).toEqual(
      [...byDuration].map(({ estimatedMinutes }) => estimatedMinutes).sort((a, b) => a - b),
    );
    expect(byDifficulty[0]?.difficulty).toBe('medium');
    expect(interviewExercises.map(({ id }) => id)).toEqual(original);
  });

  it('unlocks hints in order and caps the count at three', () => {
    expect(nextHintCount(0)).toBe(1);
    expect(nextHintCount(2)).toBe(3);
    expect(nextHintCount(3)).toBe(3);
  });
});

describe('Interview Lab progress persistence', () => {
  it('uses a versioned key and round-trips all preparation progress states', () => {
    expect(INTERVIEW_PROGRESS_KEY).toMatch(/v\d+$/);
    const completed = updateProgress({}, 'implement-promise-all', 'completed');
    const needsReview = updateProgress(completed, 'event-loop-execution-order', 'needs-review');
    expect(parseProgress(serializeProgress(needsReview))).toEqual(needsReview);
  });

  it('exports and imports schema-validated JSON', () => {
    const source = { 'event-loop-execution-order': 'needs-review' } as const;
    expect(importProgress(exportProgress(source))).toEqual(source);
    expect(() => importProgress('{"version":2,"statuses":{"unknown":"completed"}}')).toThrow(
      /Invalid progress file/,
    );
  });

  it('recovers from unavailable or corrupted storage values', () => {
    expect(parseProgress(null)).toEqual({});
    expect(parseProgress('{broken')).toEqual({});
    expect(
      parseProgress(
        JSON.stringify({ version: 99, statuses: { 'implement-promise-all': 'completed' } }),
      ),
    ).toEqual({});
    expect(
      parseProgress(
        JSON.stringify({ version: 2, statuses: { 'implement-promise-all': 'invalid' } }),
      ),
    ).toEqual({});
    expect(
      parseProgress(JSON.stringify({ version: 2, statuses: { 'unknown-exercise': 'completed' } })),
    ).toEqual({});
  });

  it('migrates valid v1 ID progress to stable slugs and removes the legacy value', () => {
    const values = new Map<string, string>([
      [
        LEGACY_INTERVIEW_PROGRESS_KEY,
        JSON.stringify({ version: 1, statuses: { '02': 'completed' } }),
      ],
    ]);
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    };

    expect(readProgress(storage)).toEqual({ 'implement-promise-all': 'completed' });
    expect(values.has(LEGACY_INTERVIEW_PROGRESS_KEY)).toBe(false);
    expect(values.has(INTERVIEW_PROGRESS_KEY)).toBe(true);
  });
});
