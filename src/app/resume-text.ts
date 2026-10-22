import type { Achievement, CareerItem, Highlight, Locale, Profile, Project } from '../content';
import type { cases } from '../content/cases';

type CaseStudy = (typeof cases)[number];

const period = (item: CareerItem, locale: Locale) =>
  item.datePrecision === 'approximate' && item.end
    ? `${item.start.slice(0, 4)}–${item.end.slice(0, 4)}`
    : `${item.start} — ${item.end ?? (locale === 'ru' ? 'по настоящее время' : 'present')}`;

export function formatAboutForClipboard(profile: Profile, locale: Locale): string {
  return profile.about[locale];
}

export function formatExperienceSummaryForClipboard(item: CareerItem, locale: Locale): string {
  return item.overview[locale];
}

export function formatAchievementForClipboard(item: Achievement, locale: Locale): string {
  return item.text[locale];
}

export function formatHighlightForClipboard(item: Highlight, locale: Locale): string {
  return `${item.heading[locale]}\n\n${item.text[locale]}`;
}

export function formatProjectForClipboard(item: Project, locale: Locale): string {
  return `${item.title[locale]}\n\n${item.summary[locale]}`;
}

export function formatCaseSummaryForClipboard(item: CaseStudy, locale: Locale): string {
  return `${item.title[locale]}\n\n${item.summary[locale]}`;
}

export function formatCaseSectionForClipboard(
  item: CaseStudy,
  section: keyof CaseStudy['sections'],
  locale: Locale,
): string {
  return item.sections[section][locale];
}

export function formatExperienceForClipboard(item: CareerItem, locale: Locale): string {
  return [
    `${item.role[locale]} — ${item.employer[locale]}`,
    period(item, locale),
    '',
    item.overview[locale],
    '',
    ...item.achievements.map(({ text }) => `• ${text[locale]}`),
    '',
    `${locale === 'ru' ? 'Технологии' : 'Technologies'}: ${item.technologies.join(', ')}`,
  ].join('\n');
}
