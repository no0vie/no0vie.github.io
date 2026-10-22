import type { CareerItem, Locale, Profile } from '../content';

const period = (item: CareerItem, locale: Locale) =>
  `${item.start} — ${item.end ?? (locale === 'ru' ? 'по настоящее время' : 'present')}`;

export function formatAboutForClipboard(profile: Profile, locale: Locale): string {
  return profile.about[locale];
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
