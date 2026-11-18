import { describe, expect, it } from 'vitest';
import { learningSessions, learningSessionsSchema } from '../src/content/study-flow';
import {
  algorithmPatterns,
  algorithmProblems,
  algorithmProblemSchema,
  getRecognitionQueue,
} from '../src/content/algorithmic-patterns';
import { learningPaths, preparationTopics } from '../src/content/preparation';
import { interviewExercises } from '../src/content/interview';
import {
  generateEventLoopChallenge,
  validateEventLoopChallenge,
} from '../src/features/study-flow/challenges';
import { createStudyFlowUrl, parseStudyFlowLocation } from '../src/features/study-flow/navigation';
import {
  STUDY_FLOW_PROGRESS_KEY,
  completeSession,
  createEmptyStudyProgress,
  readStudyProgress,
  recordCardVisit,
  rankSessions,
  recordAlgorithmAttempt,
} from '../src/features/study-flow/progress';

describe('Study Flow catalog', () => {
  it('preserves the four Phase 1 sessions and validates every 15–20 minute session', () => {
    expect(learningSessionsSchema.parse(learningSessions)).toEqual(learningSessions);
    expect(learningSessions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'browser-event-loop-mechanics' }),
        expect.objectContaining({ id: 'browser-event-loop-prediction' }),
        expect.objectContaining({ id: 'browser-rendering-critical-path' }),
        expect.objectContaining({ id: 'react-fiber-render-commit' }),
      ]),
    );
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

  it('validates the enriched senior catalog and its prerequisite graph', () => {
    const requiredCategories = new Set<string>([
      'web-fundamentals',
      'postgresql',
      'backend-architecture',
      'performance',
      'behavioral',
      'rails',
    ]);
    expect([...new Set(learningSessions.map(({ category }) => category))]).toEqual(
      expect.arrayContaining([...requiredCategories]),
    );
    expect(learningSessions.some(({ id }) => id === 'backend-message-email-outbox')).toBe(true);
    expect(
      learningSessions.filter(({ category }) => category === 'behavioral').length,
    ).toBeGreaterThanOrEqual(2);

    for (const session of learningSessions) {
      expect(new Set(session.cards.map(({ id }) => id)).size).toBe(session.cards.length);
      expect(session.priority).toMatch(/^P[0-2]$/);
      if (requiredCategories.has(session.category)) {
        expect(session.cards.some(({ kind }) => kind === 'mini-task')).toBe(true);
        expect(session.cards.some(({ kind }) => kind === 'answer')).toBe(true);
      }
    }

    const visiting = new Set<string>();
    const visited = new Set<string>();
    const byId = new Map(learningSessions.map((session) => [session.id, session]));
    const visit = (id: string) => {
      if (visiting.has(id)) throw new Error(`prerequisite cycle at ${id}`);
      if (visited.has(id)) return;
      visiting.add(id);
      for (const prerequisite of byId.get(id)?.prerequisiteSessionIds ?? []) visit(prerequisite);
      visiting.delete(id);
      visited.add(id);
    };
    for (const session of learningSessions) visit(session.id);
  });

  it('provides the Senior Software Engineer Interview Sprint 2026 path', () => {
    const sprint = learningPaths.find(({ id }) => id === 'senior-software-engineer-sprint-2026');
    expect(sprint?.title.ru).toContain('Interview Sprint 2026');
    expect(sprint?.sessionIds?.length).toBeGreaterThanOrEqual(12);
    expect(sprint?.sessionIds).toEqual(expect.arrayContaining(['backend-message-email-outbox']));
  });

  it('preserves Phase 1 source provenance', () => {
    expect(learningSessions.flatMap(({ sourceTopicIds }) => sourceTopicIds)).toEqual(
      expect.arrayContaining(['browser-event-loop', 'browser-rendering-pipeline', 'react-fiber']),
    );
    expect(learningSessions.flatMap(({ sourceExerciseIds }) => sourceExerciseIds)).toContain('01');
  });

  it('covers the complete bilingual AI Engineering track', () => {
    const aiTopics = preparationTopics.filter(({ category }) => category === 'ai-engineering');
    const aiExercises = interviewExercises.filter(({ category }) => category === 'ai-engineering');
    const aiSessions = learningSessions.filter(({ category }) => category === 'ai-engineering');
    const coveredTopics = new Set(aiSessions.flatMap(({ sourceTopicIds }) => sourceTopicIds));
    const coveredExercises = new Set(
      aiSessions.flatMap(({ sourceExerciseIds }) => sourceExerciseIds),
    );

    expect(aiTopics.length).toBeGreaterThanOrEqual(20);
    expect(new Set(aiTopics.map(({ interviewLevel }) => interviewLevel))).toEqual(
      new Set(['basic', 'middle', 'senior']),
    );
    expect(aiExercises).toHaveLength(4);
    expect(new Set(aiSessions.map(({ module }) => module))).toEqual(
      new Set([
        'llm-fundamentals',
        'rag',
        'ai-agents',
        'ai-architecture',
        'ai-first-sdd',
        'production-ai',
      ]),
    );
    expect(aiTopics.every(({ id }) => coveredTopics.has(id))).toBe(true);
    expect(aiExercises.every(({ id }) => coveredExercises.has(id))).toBe(true);
    expect(
      aiSessions.flatMap(({ cards }) => cards).filter(({ diagram }) => diagram).length,
    ).toBeGreaterThanOrEqual(5);
  });
});

describe('Algorithmic Patterns catalog', () => {
  it('covers every requested P0–P2 pattern without duplicate IDs', () => {
    expect(algorithmPatterns).toHaveLength(18);
    expect(new Set(algorithmPatterns.map(({ id }) => id)).size).toBe(18);
    expect(algorithmPatterns.filter(({ priority }) => priority === 'P0')).toHaveLength(8);
    expect(algorithmPatterns.filter(({ priority }) => priority === 'P1')).toHaveLength(6);
    expect(algorithmPatterns.filter(({ priority }) => priority === 'P2')).toHaveLength(4);
    for (const pattern of algorithmPatterns) {
      expect(pattern.name.ru).toBeTruthy();
      expect(pattern.name.en).toBeTruthy();
      expect(pattern.recognitionSignals.length).toBeGreaterThanOrEqual(3);
      expect(pattern.canonicalTypeScript).toContain('function');
      expect(pattern.practiceProblemIds).toHaveLength(3);
      expect(pattern.checkQuestions.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('provides at least 30 complete bilingual problems with executable-looking TS solutions', () => {
    expect(algorithmProblems.length).toBeGreaterThanOrEqual(30);
    expect(new Set(algorithmProblems.map(({ id }) => id)).size).toBe(algorithmProblems.length);
    for (const problem of algorithmProblems) {
      expect(algorithmProblemSchema.parse(problem)).toEqual(problem);
      expect(problem.solutionTypeScript).toMatch(/function|class/);
      expect(problem.tests.length).toBeGreaterThanOrEqual(2);
      expect(problem.acceptedPatternIds).toContain(problem.primaryPatternId);
      expect(problem.explanation.ru).toBeTruthy();
      expect(problem.explanation.en).toBeTruthy();
    }
  });

  it('shuffles recognition prompts deterministically without exposing pattern names', () => {
    const first = getRecognitionQueue(42, 12);
    expect(getRecognitionQueue(42, 12)).toEqual(first);
    expect(getRecognitionQueue(43, 12)).not.toEqual(first);
    expect(first).toHaveLength(12);
    expect(first.every(({ prompt }) => !prompt.en.includes('Pattern:'))).toBe(true);
  });
});

describe('Study Flow navigation policy', () => {
  const cardIds = ['hook', 'generated', 'recap'] as const;

  it('lets a valid URL override persisted state and canonicalizes invalid input', () => {
    expect(parseStudyFlowLocation('?card=generated&seed=42', cardIds, 'recap')).toMatchObject({
      cardId: 'generated',
      seed: 42,
      needsCanonicalization: false,
    });
    expect(parseStudyFlowLocation('?card=missing&seed=Infinity', cardIds, 'recap')).toEqual({
      cardId: 'hook',
      seed: 1,
      mode: 'learn',
      needsCanonicalization: true,
    });
  });

  it('uses persisted state only when the URL omits a card and builds stable URLs', () => {
    expect(parseStudyFlowLocation('', cardIds, 'recap')).toMatchObject({
      cardId: 'recap',
      needsCanonicalization: true,
    });
    expect(
      createStudyFlowUrl('/en/interview/session/example', {
        cardId: 'generated',
        seed: 42,
        mode: 'recognize',
      }),
    ).toBe('/en/interview/session/example?card=generated&seed=42&mode=recognize');
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

  it('records bounded algorithm attempts with distinct remediation signals', () => {
    const attempted = recordAlgorithmAttempt(createEmptyStudyProgress(), 'two-sum', {
      mode: 'recognize',
      result: 'partial',
      errorKinds: ['pattern-recognition', 'complexity'],
      attemptedAt: '2026-11-15T12:00:00.000Z',
    });
    expect(attempted.algorithmAttempts['two-sum']?.[0]?.errorKinds).toEqual([
      'pattern-recognition',
      'complexity',
    ]);
  });

  it('does not immediately recommend a freshly completed session ahead of new topics', () => {
    const progress = completeSession(
      createEmptyStudyProgress(),
      'browser-event-loop-mechanics',
      1,
      'good',
      new Date('2026-10-29T12:00:00.000Z'),
      false,
    );
    const ranked = rankSessions(learningSessions, progress, new Date('2026-10-29T12:01:00.000Z'));
    expect(ranked[0]?.session.id).not.toBe('browser-event-loop-mechanics');
    expect(
      ranked.find(({ session }) => session.id === 'browser-event-loop-mechanics')?.score,
    ).toBeLessThan(500);
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
