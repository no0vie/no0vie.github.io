import { describe, expect, it } from 'vitest';
import {
  filterAndSortExercises,
  interviewExercises,
  interviewExercisesSchema,
  nextHintCount,
} from '../src/content/interview';
import {
  INTERVIEW_PROGRESS_KEY,
  parseProgress,
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
      expect(exercise.hints).toHaveLength(3);
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
    const statuses = { '02': 'completed', '03': 'in-progress' } as const;
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
  it('uses a versioned key and round-trips valid progress', () => {
    expect(INTERVIEW_PROGRESS_KEY).toMatch(/v\d+$/);
    const progress = updateProgress({}, '02', 'completed');
    expect(parseProgress(serializeProgress(progress))).toEqual(progress);
  });

  it('recovers from unavailable or corrupted storage values', () => {
    expect(parseProgress(null)).toEqual({});
    expect(parseProgress('{broken')).toEqual({});
    expect(parseProgress(JSON.stringify({ version: 99, statuses: { '02': 'completed' } }))).toEqual(
      {},
    );
    expect(parseProgress(JSON.stringify({ version: 1, statuses: { '02': 'invalid' } }))).toEqual(
      {},
    );
  });
});
