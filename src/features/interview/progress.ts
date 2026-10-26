import { interviewExercises, progressStatuses, type ProgressStatus } from '../../content/interview';

export const INTERVIEW_PROGRESS_KEY = 'interview-lab-progress-v2';
export const LEGACY_INTERVIEW_PROGRESS_KEY = 'interview-lab-progress-v1';
const version = 2;
const exerciseSlugs = new Set(interviewExercises.map(({ slug }) => slug));
const legacyIds = new Map(interviewExercises.map(({ id, slug }) => [id, slug]));
export type InterviewProgress = Record<string, ProgressStatus>;

function isProgressStatus(value: unknown): value is ProgressStatus {
  return progressStatuses.includes(value as ProgressStatus);
}

export function parseProgress(value: string | null): InterviewProgress {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object') return {};
    const candidate = parsed as { version?: unknown; statuses?: unknown };
    if (
      candidate.version !== version ||
      !candidate.statuses ||
      typeof candidate.statuses !== 'object'
    )
      return {};
    const entries = Object.entries(candidate.statuses);
    if (!entries.every(([slug, status]) => exerciseSlugs.has(slug) && isProgressStatus(status)))
      return {};
    return Object.fromEntries<ProgressStatus>(entries);
  } catch {
    return {};
  }
}

function migrateLegacyProgress(value: string | null): InterviewProgress {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object') return {};
    const candidate = parsed as { version?: unknown; statuses?: unknown };
    if (candidate.version !== 1 || !candidate.statuses || typeof candidate.statuses !== 'object')
      return {};
    const migrated: InterviewProgress = {};
    for (const [id, status] of Object.entries(candidate.statuses)) {
      const slug = legacyIds.get(id);
      if (!slug || !isProgressStatus(status)) return {};
      migrated[slug] = status;
    }
    return migrated;
  } catch {
    return {};
  }
}

export function serializeProgress(progress: InterviewProgress): string {
  return JSON.stringify({ version, statuses: progress });
}

export function exportProgress(progress: InterviewProgress): string {
  return `${JSON.stringify({ version, exportedAt: new Date().toISOString(), statuses: progress }, null, 2)}\n`;
}

export function importProgress(value: string): InterviewProgress {
  const parsed = parseProgress(value);
  let entryCount = 0;
  try {
    const candidate = JSON.parse(value) as { statuses?: unknown };
    entryCount =
      candidate.statuses && typeof candidate.statuses === 'object'
        ? Object.keys(candidate.statuses).length
        : 0;
  } catch {
    throw new Error('Invalid progress file');
  }
  if (entryCount > 0 && Object.keys(parsed).length === 0) throw new Error('Invalid progress file');
  return parsed;
}

export function updateProgress(
  progress: InterviewProgress,
  slug: string,
  status: ProgressStatus,
): InterviewProgress {
  if (!exerciseSlugs.has(slug)) return progress;
  return { ...progress, [slug]: status };
}

export interface ProgressStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export function readProgress(storage: ProgressStorage | undefined): InterviewProgress {
  if (!storage) return {};
  try {
    const current = parseProgress(storage.getItem(INTERVIEW_PROGRESS_KEY));
    if (Object.keys(current).length > 0) return current;
    const migrated = migrateLegacyProgress(storage.getItem(LEGACY_INTERVIEW_PROGRESS_KEY));
    if (Object.keys(migrated).length > 0) {
      storage.setItem(INTERVIEW_PROGRESS_KEY, serializeProgress(migrated));
      storage.removeItem(LEGACY_INTERVIEW_PROGRESS_KEY);
    }
    return migrated;
  } catch {
    return {};
  }
}
export function writeProgress(
  storage: ProgressStorage | undefined,
  progress: InterviewProgress,
): void {
  try {
    storage?.setItem(INTERVIEW_PROGRESS_KEY, serializeProgress(progress));
  } catch {
    /* In-memory UI remains usable. */
  }
}
export function resetProgress(storage: ProgressStorage | undefined): void {
  try {
    storage?.removeItem(INTERVIEW_PROGRESS_KEY);
    storage?.removeItem(LEGACY_INTERVIEW_PROGRESS_KEY);
  } catch {
    /* Storage may be blocked. */
  }
}
