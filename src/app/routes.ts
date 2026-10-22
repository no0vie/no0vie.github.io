import { cases } from '../content/cases';
import type { Locale } from '../content';

/** Prefix a site-local path for both user and project GitHub Pages deployments. */
export function basePath(path: string, base = import.meta.env.BASE_URL): string {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\/+/, '')}`;
}

export function localePath(locale: Locale, page = '', base = import.meta.env.BASE_URL): string {
  const suffix = page ? `/${page.split('/').map(encodeURIComponent).join('/')}` : '';
  return basePath(`${locale}${suffix}`, base);
}

export function pdfPath(locale: Locale, base = import.meta.env.BASE_URL): string {
  return basePath(`downloads/resume-${locale}.pdf`, base);
}

export function pageKind(
  page: string,
  enableEvolution = false,
): 'resume' | 'projects' | 'case' | 'evolution' | 'not-found' {
  if (cases.some((item) => page === `cases/${item.slug}`)) return 'case';
  if (page === 'evolution' && enableEvolution) return 'evolution';
  return page === '' ? 'resume' : page === 'projects' ? 'projects' : 'not-found';
}
