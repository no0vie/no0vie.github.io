import { z } from 'zod';
import type { Locale } from './schema';
import { javascriptExercises } from './interview-javascript';
import { platformExercises } from './interview-platform';
import { architectureExercises } from './interview-architecture';

export const exerciseCategories = [
  'javascript',
  'typescript',
  'browser',
  'security',
  'architecture',
] as const;
export const exerciseDifficulties = ['medium', 'hard', 'senior'] as const;
export const progressStatuses = ['not-started', 'in-progress', 'completed'] as const;
export type ExerciseCategory = (typeof exerciseCategories)[number];
export type Difficulty = (typeof exerciseDifficulties)[number];
export type ProgressStatus = (typeof progressStatuses)[number];
export type ExerciseSort = 'default' | 'difficulty' | 'duration';

const text = z.string().trim().min(1);
const codeBlockSchema = z.object({ label: text, language: text, code: text }).strict();
const localizedExerciseSchema = z
  .object({
    title: text,
    description: text,
    problem: text,
    examples: z.array(text),
    requirements: z.array(text).min(3),
    starterCode: codeBlockSchema.optional(),
    hints: z.array(text).length(3),
    solution: z
      .object({ blocks: z.array(codeBlockSchema).min(1), alternative: z.array(text) })
      .strict(),
    explanation: z.array(text).min(2),
    edgeCases: z.array(text).min(3),
    complexity: z.array(text),
    followUps: z.array(text).min(3),
    production: z.array(text).min(1),
    furtherReading: z.array(
      z.object({ label: text, url: z.string().url().startsWith('https://') }).strict(),
    ),
  })
  .strict();

export const interviewExerciseSchema = z
  .object({
    id: z.string().regex(/^\d{2}$/),
    slug: z.string().regex(/^[a-z][a-z0-9-]*$/),
    category: z.enum(exerciseCategories),
    difficulty: z.enum(exerciseDifficulties),
    estimatedMinutes: z.number().int().min(10).max(180),
    tags: z.array(text).min(1),
    runtime: z.enum(['universal', 'browser', 'node', 'react']),
    content: z.object({ ru: localizedExerciseSchema, en: localizedExerciseSchema }).strict(),
  })
  .strict();

export const interviewExercisesSchema = z
  .array(interviewExerciseSchema)
  .superRefine((items, context) => {
    for (const field of ['id', 'slug'] as const) {
      if (new Set(items.map((item) => item[field])).size !== items.length) {
        context.addIssue({ code: 'custom', message: `Exercise ${field}s must be unique` });
      }
    }
  });
export type InterviewExercise = z.infer<typeof interviewExerciseSchema>;
export const interviewExercises = interviewExercisesSchema.parse([
  ...javascriptExercises,
  ...platformExercises,
  ...architectureExercises,
]);

export interface ExerciseFilters {
  query: string;
  category: ExerciseCategory | 'all';
  difficulty: Difficulty | 'all';
  status: ProgressStatus | 'all';
  sort: ExerciseSort;
}

const difficultyRank: Record<Difficulty, number> = { medium: 0, hard: 1, senior: 2 };
export function filterAndSortExercises(
  items: readonly InterviewExercise[],
  locale: Locale,
  filters: ExerciseFilters,
  statuses: Readonly<Record<string, ProgressStatus>>,
): InterviewExercise[] {
  const query = filters.query.trim().toLocaleLowerCase(locale);
  return items
    .filter((item) => {
      const status = statuses[item.slug] ?? 'not-started';
      if (filters.category !== 'all' && item.category !== filters.category) return false;
      if (filters.difficulty !== 'all' && item.difficulty !== filters.difficulty) return false;
      if (filters.status !== 'all' && status !== filters.status) return false;
      if (!query) return true;
      const article = item.content[locale];
      return [article.title, article.description, ...item.tags]
        .join(' ')
        .toLocaleLowerCase(locale)
        .includes(query);
    })
    .sort((a, b) =>
      filters.sort === 'duration'
        ? a.estimatedMinutes - b.estimatedMinutes || a.id.localeCompare(b.id)
        : filters.sort === 'difficulty'
          ? difficultyRank[a.difficulty] - difficultyRank[b.difficulty] || a.id.localeCompare(b.id)
          : a.id.localeCompare(b.id),
    );
}

export const nextHintCount = (count: number) => Math.min(3, Math.max(0, count) + 1);
