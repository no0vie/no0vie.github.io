import { profile, type Locale } from '../content';
import { cases } from '../content/cases';
import { notes } from '../content/notes';
import { interviewExerciseSlugs } from '../content/interview-manifest';
import { preparationTopicSlugs } from '../content/preparation-manifest';

/** Prefix a site-local path for both user and project GitHub Pages deployments. */
export function basePath(path: string, base = import.meta.env.BASE_URL): string {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
}

export function localePath(locale: Locale, page = '', base = import.meta.env.BASE_URL): string {
  const suffix = page ? `/${page.split('/').map(encodeURIComponent).join('/')}` : '';
  return basePath(`${locale}${suffix}`, base);
}

export const interviewPath = (locale: Locale, slug?: string, base = import.meta.env.BASE_URL) =>
  localePath(locale, slug ? `interview/${slug}` : 'interview', base);

export const preparationPath = (locale: Locale, page = '', base = import.meta.env.BASE_URL) =>
  localePath(locale, page ? `interview/${page}` : 'interview', base);

export function pdfFileName(locale: Locale): string {
  return `eugene-novikov-sse-${profile.updated}-${locale}.pdf`;
}

export function pdfPath(locale: Locale, base = import.meta.env.BASE_URL): string {
  return basePath(`downloads/${pdfFileName(locale)}`, base);
}

export function pageKind(
  page: string,
  enableEvolution = false,
):
  | 'resume'
  | 'projects'
  | 'case'
  | 'evolution'
  | 'notes'
  | 'note'
  | 'interview'
  | 'interview-topics'
  | 'interview-topic'
  | 'interview-practice'
  | 'interview-paths'
  | 'interview-exercise'
  | 'not-found' {
  if (cases.some((item) => page === `cases/${item.slug}`)) return 'case';
  if (page === 'notes') return 'notes';
  if (notes.some((item) => page === `notes/${item.slug}`)) return 'note';
  if (page === 'interview') return 'interview';
  if (page === 'interview/topics') return 'interview-topics';
  if (preparationTopicSlugs.some((slug) => page === `interview/topics/${slug}`))
    return 'interview-topic';
  if (page === 'interview/practice') return 'interview-practice';
  if (page === 'interview/paths') return 'interview-paths';
  if (
    interviewExerciseSlugs.some(
      (slug) => page === `interview/${slug}` || page === `interview/practice/${slug}`,
    )
  )
    return 'interview-exercise';
  if (page === 'evolution' && enableEvolution) return 'evolution';
  return page === '' ? 'resume' : page === 'projects' ? 'projects' : 'not-found';
}
