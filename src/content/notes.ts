import { z } from 'zod';

import type { Locale } from './schema';
import { rawNotes, notesBacklog } from './notes-data';

export const noteCategories = [
  'browser-js',
  'react-state',
  'architecture',
  'production-testing',
] as const;
export type NoteCategory = (typeof noteCategories)[number];

const text = z.string().trim().min(1);
const localizedList = z.object({ ru: z.array(text).min(1), en: z.array(text).min(1) }).strict();
const articleSchema = z
  .object({
    question: text,
    shortAnswer: text,
    deepDive: z.array(text).min(3),
    example: z.object({ label: text, code: text, language: text, explanation: text }).strict(),
    pitfalls: z.array(text).min(2),
    followUps: z.array(text).min(2).max(4),
  })
  .strict();
const noteSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    slug: z.string().regex(/^[a-z][a-z0-9-]*$/),
    category: z.enum(noteCategories),
    tags: z.array(text).min(1),
    keywords: localizedList,
    reviewedAt: z.string().date(),
    sources: z
      .array(z.object({ title: text, url: z.string().url().startsWith('https://') }).strict())
      .min(2),
    ru: articleSchema,
    en: articleSchema,
  })
  .strict();

export const notesSchema = z
  .array(noteSchema)
  .length(9)
  .superRefine((items, context) => {
    for (const field of ['id', 'slug'] as const) {
      if (new Set(items.map((item) => item[field])).size !== items.length)
        context.addIssue({ code: 'custom', message: `Note ${field}s must be unique` });
    }
  });
export type EngineeringNote = z.infer<typeof noteSchema>;
export const notes = notesSchema.parse(rawNotes);
export { notesBacklog };

export function filterNotes(
  items: readonly EngineeringNote[],
  locale: Locale,
  query: string,
  categories: readonly NoteCategory[],
): EngineeringNote[] {
  const normalized = query.trim().toLocaleLowerCase(locale);
  return items.filter((note) => {
    if (categories.length && !categories.includes(note.category)) return false;
    if (!normalized) return true;
    const article = note[locale];
    return [article.question, article.shortAnswer, ...note.tags, ...note.keywords[locale]]
      .join(' ')
      .toLocaleLowerCase(locale)
      .includes(normalized);
  });
}

export function notePath(locale: Locale, slug?: string, base = import.meta.env.BASE_URL): string {
  const path = slug ? `notes/${encodeURIComponent(slug)}` : 'notes';
  return `${base.replace(/\/$/, '')}/${path}?lang=${locale}`;
}

export interface InterviewState {
  enabled: boolean;
  revealed: Set<string>;
}
export type InterviewAction =
  { type: 'enable' } | { type: 'disable' } | { type: 'toggle-reveal'; id: string };

export function updateInterviewState(
  state: InterviewState,
  action: InterviewAction,
): InterviewState {
  if (action.type === 'enable') return { enabled: true, revealed: new Set() };
  if (action.type === 'disable') return { enabled: false, revealed: new Set() };
  const revealed = new Set(state.revealed);
  if (revealed.has(action.id)) revealed.delete(action.id);
  else revealed.add(action.id);
  return { ...state, revealed };
}
