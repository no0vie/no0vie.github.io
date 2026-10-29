import { describe, expect, it } from 'vitest';
import { learningSessions, learningSessionsSchema } from '../src/content/study-flow';
import {
  generateEventLoopChallenge,
  validateEventLoopChallenge,
} from '../src/features/study-flow/challenges';
import {
  STUDY_FLOW_PROGRESS_KEY,
  completeSession,
  createEmptyStudyProgress,
  readStudyProgress,
  recordCardVisit,
  rankSessions,
} from '../src/features/study-flow/progress';

describe('Study Flow catalog', () => {
  it('contains four complete bilingual 15–20 minute sessions with valid relations', () => {
    expect(learningSessionsSchema.parse(learningSessions)).toEqual(learningSessions);
    expect(learningSessions).toHaveLength(4);
    for (const session of learningSessions) {
      expect(session.estimatedMinutes).toBeGreaterThanOrEqual(15);
      expect(session.estimatedMinutes).toBeLessThanOrEqual(20);
      expect(session.cards.length).toBeGreaterThanOrEqual(4);
      expect(session.cards.length).toBeLessThanOrEqual(8);
      expect(session.cards.reduce((sum, card) => sum + card.estimatedMinutes, 0) + 1).toBe(
        session.estimatedMinutes,
      );
    }
  });

  it('preserves Phase 1 source provenance', () => {
    expect(learningSessions.flatMap(({ sourceTopicIds }) => sourceTopicIds)).toEqual(
      expect.arrayContaining(['browser-event-loop', 'browser-rendering-pipeline', 'react-fiber']),
    );
    expect(learningSessions.flatMap(({ sourceExerciseIds }) => sourceExerciseIds)).toContain('01');
  });
});

describe('Study Flow progress and recommendations', () => {
  it('does not complete a session merely by visiting its final card', () => {
    const visited = recordCardVisit(
      createEmptyStudyProgress(),
      'browser-event-loop-mechanics',
      1,
      'recap',
    );
    expect(visited.sessions['browser-event-loop-mechanics']?.lastCardId).toBe('recap');
    expect(visited.sessions['browser-event-loop-mechanics']?.completedCount).toBe(0);
  });

  it('completes only explicitly and schedules transparent review intervals', () => {
    const completed = completeSession(
      createEmptyStudyProgress(),
      'browser-event-loop-mechanics',
      1,
      'good',
      new Date('2026-10-29T12:00:00.000Z'),
      false,
    );
    expect(completed.sessions['browser-event-loop-mechanics']?.completedCount).toBe(1);
    expect(completed.sessions['browser-event-loop-mechanics']?.dueAt).toBe(
      '2026-11-05T12:00:00.000Z',
    );
  });

  it('migrates legacy exercise status while tolerating corrupt storage', () => {
    const values = new Map<string, string>([
      [
        'interview-lab-progress-v1',
        JSON.stringify({ version: 1, statuses: { '01': 'completed' } }),
      ],
    ]);
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    };
    const migrated = readStudyProgress(storage);
    expect(migrated.sessions['browser-event-loop-prediction']?.completedCount).toBe(1);
    expect(values.has(STUDY_FLOW_PROGRESS_KEY)).toBe(true);

    values.set(STUDY_FLOW_PROGRESS_KEY, '{broken');
    values.delete('interview-lab-progress-v1');
    expect(readStudyProgress(storage)).toEqual(createEmptyStudyProgress());
  });

  it('ranks prerequisites, due reviews and new categories deterministically', () => {
    const progress = completeSession(
      createEmptyStudyProgress(),
      'browser-event-loop-mechanics',
      1,
      'again',
      new Date('2026-10-27T12:00:00.000Z'),
      false,
    );
    const first = rankSessions(learningSessions, progress, new Date('2026-10-29T12:00:00.000Z'));
    const second = rankSessions(learningSessions, progress, new Date('2026-10-29T12:00:00.000Z'));
    expect(first).toEqual(second);
    expect(first[0]?.session.id).toBe('browser-event-loop-mechanics');
    expect(first[0]?.reason.en).toMatch(/review/i);
  });
});

describe('Event Loop challenge generator', () => {
  it('is reproducible, valid and produces multiple semantic variants', () => {
    const signatures = new Set<string>();
    for (let seed = 0; seed < 100; seed += 1) {
      const first = generateEventLoopChallenge(seed);
      const replay = generateEventLoopChallenge(seed);
      expect(replay).toEqual(first);
      expect(validateEventLoopChallenge(first)).toBe(true);
      signatures.add(first.expectedOrder.join('|'));
    }
    expect(signatures.size).toBeGreaterThan(8);
  });
});
