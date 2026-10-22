import type { CareerItem, Locale, Profile } from '../content';

function normalizeClipboardText(value: string): string {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/[ \t]+/g, ' '))
    .filter(Boolean)
    .join(' ');
}

export function formatAboutForClipboard(profile: Profile, locale: Locale): string {
  return normalizeClipboardText(profile.about[locale]);
}

export function formatExperienceForClipboard(item: CareerItem, locale: Locale): string {
  const overview = normalizeClipboardText(item.overview[locale]);
  const seen = new Set<string>();
  const bullets = [...item.achievements.map(({ text }) => text[locale]), item.outcome?.[locale]]
    .filter((value): value is string => Boolean(value))
    .map(normalizeClipboardText)
    .filter((value) => {
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    })
    .map((value) => `• ${value}`);

  return [overview, bullets.join('\n')].filter(Boolean).join('\n\n');
}
