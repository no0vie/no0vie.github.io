import { progressStatuses, type ProgressStatus } from '../../content/interview';

export const INTERVIEW_PROGRESS_KEY = 'interview-lab-progress-v1';
const version = 1;
export type InterviewProgress = Record<string, ProgressStatus>;

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
    if (
      !entries.every(
        ([id, status]) => /^\d{2}$/.test(id) && progressStatuses.includes(status as ProgressStatus),
      )
    )
      return {};
    return Object.fromEntries<ProgressStatus>(entries);
  } catch {
    return {};
  }
}

export function serializeProgress(progress: InterviewProgress): string {
  return JSON.stringify({ version, statuses: progress });
}

export function updateProgress(
  progress: InterviewProgress,
  id: string,
  status: ProgressStatus,
): InterviewProgress {
  return { ...progress, [id]: status };
}

export interface ProgressStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export function readProgress(storage: ProgressStorage | undefined): InterviewProgress {
  if (!storage) return {};
  try {
    return parseProgress(storage.getItem(INTERVIEW_PROGRESS_KEY));
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
  } catch {
    /* Storage may be blocked. */
  }
}
