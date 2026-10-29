import { z } from 'zod';
import type { LearningSession } from '../../content/study-flow';

export const STUDY_FLOW_PROGRESS_KEY = 'study-flow:v1';
const confidenceSchema = z.enum(['again', 'hard', 'good', 'easy']);
const sessionSchema = z
  .object({
    version: z.number().int().positive(),
    lastOpenedAt: z.string().datetime().optional(),
    lastCompletedAt: z.string().datetime().optional(),
    visitCount: z.number().int().nonnegative().default(0),
    completedCount: z.number().int().nonnegative().default(0),
    confidence: confidenceSchema.optional(),
    dueAt: z.string().datetime().optional(),
    lastCardId: z.string().optional(),
    skippedCheck: z.boolean().optional(),
    answers: z.record(z.string(), z.boolean()).default({}),
  })
  .strict();
const progressSchema = z
  .object({
    schemaVersion: z.literal(1),
    sessions: z.record(z.string(), sessionSchema),
    queueHistory: z.array(z.string()).max(20),
    lastCategory: z.string().optional(),
  })
  .strict();
export type StudyProgress = z.infer<typeof progressSchema>;
export type Confidence = z.infer<typeof confidenceSchema>;
export interface ProgressStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export const createEmptyStudyProgress = (): StudyProgress => ({
  schemaVersion: 1,
  sessions: {},
  queueHistory: [],
});
export function parseStudyProgress(value: string | null): StudyProgress {
  if (!value) return createEmptyStudyProgress();
  try {
    return progressSchema.parse(JSON.parse(value));
  } catch {
    return createEmptyStudyProgress();
  }
}
const legacyMap: Record<string, string> = {
  '01': 'browser-event-loop-prediction',
  'event-loop-execution-order': 'browser-event-loop-prediction',
};
function migrateLegacy(storage: ProgressStorage): StudyProgress {
  const now = '2026-10-29T00:00:00.000Z';
  for (const [key, version] of [
    ['interview-lab-progress-v2', 2],
    ['interview-lab-progress-v1', 1],
  ] as const) {
    try {
      const raw = storage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as { version?: number; statuses?: Record<string, string> };
      if (parsed.version !== version || !parsed.statuses) continue;
      const result = createEmptyStudyProgress();
      for (const [source, status] of Object.entries(parsed.statuses)) {
        const id = legacyMap[source];
        if (!id || status === 'not-started') continue;
        result.sessions[id] = {
          version: 1,
          visitCount: 1,
          completedCount: status === 'completed' ? 1 : 0,
          lastOpenedAt: now,
          lastCompletedAt: status === 'completed' ? now : undefined,
          confidence:
            status === 'needs-review' ? 'again' : status === 'completed' ? 'good' : undefined,
          dueAt: status === 'needs-review' ? now : undefined,
          answers: {},
        };
      }
      return result;
    } catch {
      continue;
    }
  }
  return createEmptyStudyProgress();
}
export function readStudyProgress(storage: ProgressStorage | undefined): StudyProgress {
  if (!storage) return createEmptyStudyProgress();
  try {
    const raw = storage.getItem(STUDY_FLOW_PROGRESS_KEY);
    if (raw) return parseStudyProgress(raw);
    const migrated = migrateLegacy(storage);
    storage.setItem(STUDY_FLOW_PROGRESS_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return createEmptyStudyProgress();
  }
}
export function writeStudyProgress(
  storage: ProgressStorage | undefined,
  progress: StudyProgress,
): void {
  try {
    storage?.setItem(STUDY_FLOW_PROGRESS_KEY, JSON.stringify(progressSchema.parse(progress)));
  } catch {
    /* in-memory fallback */
  }
}
export function recordCardVisit(
  progress: StudyProgress,
  sessionId: string,
  version: number,
  cardId: string,
  now = new Date(),
): StudyProgress {
  const previous = progress.sessions[sessionId];
  return {
    ...progress,
    sessions: {
      ...progress.sessions,
      [sessionId]: {
        version,
        lastOpenedAt: now.toISOString(),
        visitCount: (previous?.visitCount ?? 0) + 1,
        completedCount: previous?.completedCount ?? 0,
        confidence: previous?.confidence,
        dueAt: previous?.dueAt,
        lastCompletedAt: previous?.lastCompletedAt,
        lastCardId: cardId,
        skippedCheck: previous?.skippedCheck,
        answers: previous?.answers ?? {},
      },
    },
  };
}
const interval = { again: 1, hard: 3, good: 7, easy: 14 } as const;
export function completeSession(
  progress: StudyProgress,
  sessionId: string,
  version: number,
  confidence: Confidence,
  now: Date,
  skippedCheck: boolean,
): StudyProgress {
  const previous = progress.sessions[sessionId];
  const due = new Date(now);
  due.setUTCDate(due.getUTCDate() + interval[confidence]);
  return {
    ...progress,
    queueHistory: [...progress.queueHistory.filter((id) => id !== sessionId), sessionId].slice(-20),
    sessions: {
      ...progress.sessions,
      [sessionId]: {
        version,
        lastOpenedAt: previous?.lastOpenedAt ?? now.toISOString(),
        lastCompletedAt: now.toISOString(),
        visitCount: previous?.visitCount ?? 1,
        completedCount: (previous?.completedCount ?? 0) + 1,
        confidence,
        dueAt: due.toISOString(),
        lastCardId: previous?.lastCardId,
        skippedCheck,
        answers: previous?.answers ?? {},
      },
    },
  };
}
export interface RankedSession {
  session: LearningSession;
  score: number;
  reason: { ru: string; en: string };
}
export function rankSessions(
  catalog: readonly LearningSession[],
  progress: StudyProgress,
  now: Date,
): RankedSession[] {
  const done = new Set(
    Object.entries(progress.sessions)
      .filter(([, p]) => p.completedCount > 0)
      .map(([id]) => id),
  );
  return catalog
    .map((session) => {
      const state = progress.sessions[session.id];
      const missing = session.prerequisiteSessionIds.some((id) => !done.has(id));
      const due = state?.dueAt && new Date(state.dueAt) <= now;
      const score = missing ? -1000 : due ? 1000 : state?.completedCount ? 50 : 500;
      const reason = missing
        ? { ru: 'Сначала prerequisite', en: 'Complete the prerequisite first' }
        : due
          ? { ru: 'Повторить — наступил срок', en: 'Review — it is due' }
          : state?.completedCount
            ? { ru: 'Можно повторить', en: 'Available for review' }
            : { ru: 'Новая тема', en: 'New topic' };
      return { session, score, reason };
    })
    .sort((a, b) => b.score - a.score || a.session.id.localeCompare(b.session.id));
}
export function exportStudyProgress(progress: StudyProgress): string {
  return `${JSON.stringify(progressSchema.parse(progress), null, 2)}\n`;
}
export function importStudyProgress(value: string): StudyProgress {
  return progressSchema.parse(JSON.parse(value));
}
