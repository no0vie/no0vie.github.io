import { z } from 'zod';
import { localizedSchema } from './schema';
import { mtsArchitectureAchievement, mtsOutcome } from './seed';

const campaignWizardSectionsSchema = z
  .object({
    problem: localizedSchema,
    constraints: localizedSchema,
    approach: localizedSchema,
    tradeoffs: localizedSchema,
    results: localizedSchema,
    lessons: localizedSchema,
  })
  .strict();

const reliabilitySectionsSchema = z
  .object({
    context: localizedSchema,
    constraints: localizedSchema,
    approach: localizedSchema,
    environmentIsolation: localizedSchema,
    serverValidation: localizedSchema,
    apiProtection: localizedSchema,
    boundaries: localizedSchema,
    results: localizedSchema,
    lessons: localizedSchema,
  })
  .strict();

export const caseSchema = z.union([
  z
    .object({
      slug: z.literal('campaign-wizard'),
      title: localizedSchema,
      summary: localizedSchema,
      evidence: z.literal('confirmed'),
      publishable: z.literal(true),
      sections: campaignWizardSectionsSchema,
    })
    .strict(),
  z
    .object({
      slug: z.literal('public-service-reliability'),
      title: localizedSchema,
      summary: localizedSchema,
      evidence: z.literal('confirmed'),
      publishable: z.literal(true),
      sections: reliabilitySectionsSchema,
    })
    .strict(),
]);

export const cases = caseSchema.array().parse([
  {
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
  },
  {
    slug: 'public-service-reliability',
    title: {
      ru: 'Надёжность и защищённость публичного сервиса',
      en: 'Improving Public-Facing Service Reliability and API Protection',
    },
    summary: {
      ru: 'МТС Web Services: изоляция окружений, серверная валидация и дополнительная защита публичного API лендинга.',
      en: 'MTS Web Services: environment isolation, server-side validation, and additional protection for a landing page’s public API.',
    },
    evidence: 'confirmed',
    publishable: true,
    sections: {
      context: {
        ru: 'Публичный лендинг передавал заявки в смежные бизнес-системы. После обращения маркетинга о некорректных заявках требовалось найти причину, восстановить целостность данных и сохранить штатную обработку корректных обращений.',
        en: 'A public-facing landing page submitted requests to downstream business systems. After marketing reported invalid submissions, the task was to identify the root cause, restore data integrity, and preserve the normal handling of valid requests.',
      },
      constraints: {
        ru: 'Production-функциональность и возможность интеграционного тестирования должны были сохраниться. Параметры управления отправкой, правила идентификации и настройки ограничения запросов относятся к внутренним деталям и не раскрываются.',
        en: 'Production behavior and integration testing had to remain available. Submission controls, identification rules, and rate-limit settings are internal implementation details and are not disclosed.',
      },
      approach: {
        ru: 'Работа объединила плановую изоляцию окружений с оперативным устранением причины некорректных заявок: сначала были разделены безопасные режимы отправки, затем проверка данных перенесена на серверную границу и дополнена ограничением частоты запросов.',
        en: 'The work combined planned environment isolation with an incident-driven root-cause fix: safe submission modes were separated first, then data checks were enforced at the server boundary and complemented with request rate limiting.',
      },
      environmentIsolation: {
        ru: 'Для test и stage реальная отправка данных была отключена по умолчанию. Управляемые режимы позволили эмулировать успешный и неуспешный ответ либо явно включить реальную отправку для интеграционного тестирования, не меняя штатное поведение production.',
        en: 'Real submissions from test and stage were disabled by default. Controlled modes supported successful and unsuccessful emulation or explicit real submission for integration testing, while normal production behavior remained unchanged.',
      },
      serverValidation: {
        ru: 'Анализ показал отсутствие обязательной серверной проверки. На сервере были применены существующие правила клиентской валидации: некорректные заявки перестали передаваться дальше, а корректный сценарий сохранился.',
        en: 'The investigation found that mandatory server-side validation was missing. Existing client-side rules were enforced on the server, preventing invalid submissions from being forwarded while preserving the valid path.',
      },
      apiProtection: {
        ru: 'Публичный API был дополнен ограничением частоты запросов. Состояние ограничения хранится на уровне отдельного серверного инстанса и снижает риск локальных всплесков запросов.',
        en: 'The public API gained request rate limiting. Its state is stored on each individual server instance, reducing exposure to local request bursts.',
      },
      boundaries: {
        ru: 'Это локальное ограничение частоты запросов, а не распределённая защита, WAF или комплексное решение против DDoS. Кейс не утверждает полного устранения спама или предотвращения подтверждённой атаки.',
        en: 'This is per-instance rate limiting, not distributed protection, a WAF, or a comprehensive DDoS solution. The case does not claim complete spam prevention or that a confirmed attack was stopped.',
      },
      results: {
        ru: 'Причина передачи заявок, не соответствовавших действующим правилам, была устранена. Исправление серверной валидации выпущено в production в день обращения маркетинга, после чего заинтересованное подразделение получило информацию о результате.',
        en: 'The root cause of submissions violating the existing rules was removed. The server-side validation fix was deployed to production on the same day marketing reported the issue, and the stakeholder team was informed of the result.',
      },
      lessons: {
        ru: 'Надёжность публичной интеграции требует защиты на нескольких границах: безопасных значений по умолчанию для непродуктивных окружений, обязательной серверной валидации независимо от клиента и честно обозначенных пределов локальных защитных механизмов.',
        en: 'Reliable public integrations require controls at several boundaries: safe defaults for non-production environments, mandatory server-side validation independent of the client, and explicit limits for local protection mechanisms.',
      },
    },
  },
]);
