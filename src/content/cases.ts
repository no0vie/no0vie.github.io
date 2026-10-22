import { z } from 'zod';
import { localizedSchema } from './schema';
import { mtsArchitectureAchievement, mtsOutcome } from './seed';

export const caseSchema = z
  .object({
    slug: z.literal('campaign-wizard'),
    title: localizedSchema,
    summary: localizedSchema,
    evidence: z.literal('confirmed'),
    publishable: z.literal(true),
    sections: z
      .object({
        problem: localizedSchema,
        constraints: localizedSchema,
        approach: localizedSchema,
        tradeoffs: localizedSchema,
        results: localizedSchema,
        lessons: localizedSchema,
      })
      .strict(),
  })
  .strict();

// Public editorial summary of SPEC §7; no implementation details or quantitative claims.
export const cases = [
  caseSchema.parse({
    slug: 'campaign-wizard',
    title: { ru: 'Расширяемый мастер кампаний', en: 'An extensible campaign wizard' },
    summary: {
      ru: 'МТС Web Services: общий контракт каналов и независимые формы в мастере каскадных кампаний.',
      en: 'MTS Web Services: a shared channel contract and independent forms in a cascade campaign wizard.',
    },
    evidence: 'confirmed',
    publishable: true,
    sections: {
      problem: {
        ru: 'Мастер каскадных кампаний объединял работу с SMS, MMS и электронной почтой. Я отвечал за значительную часть архитектуры и реализации его фронтенда.',
        en: 'The cascade campaign wizard brought together SMS, MMS, and email. I owned a substantial part of its frontend architecture and implementation.',
      },
      constraints: {
        ru: 'У каждого канала были свои формы, состояние и бизнес-правила. Интерфейс также учитывал ограничения сценариев, клиентскую валидацию и ошибки публичного API.',
        en: 'Each channel had its own forms, state, and business rules. The interface also addressed interaction constraints, client-side validation, and public API errors.',
      },
      approach: {
        ru: 'Я выделил общий контракт каналов, сохранив состояние, формы и правила изолированными для каждого канала. Ошибки публичного API преобразовывались в понятные пользователю сообщения.',
        en: 'I established a shared channel contract while isolating each channel’s state, forms, and rules. Public API errors were mapped to human-readable feedback.',
      },
      tradeoffs: {
        ru: 'Общими оставались договорённости между мастером и каналами, а не все детали форм. Это разграничение позволяло сохранять особенности каждого канала.',
        en: 'The shared abstraction covered the contract between the wizard and its channels, rather than every form detail. This boundary preserved channel-specific behavior.',
      },
      results: {
        ru: `${mtsArchitectureAchievement.ru} SMS и MMS были переведены на новые редакторы шаблонов без существенной переработки общего сценария мастера. ${mtsOutcome.ru}`,
        en: `${mtsArchitectureAchievement.en} SMS and MMS were migrated to new template editors without major changes to the wizard's shared workflow. ${mtsOutcome.en}`,
      },
      lessons: {
        ru: 'Этот пример иллюстрирует разделение общего контракта и изменяемых деталей: редакторы шаблонов можно заменять, сохраняя архитектуру мастера.',
        en: 'This example illustrates separating a shared contract from changing details: template editors can be replaced while preserving the wizard architecture.',
      },
    },
  }),
];
