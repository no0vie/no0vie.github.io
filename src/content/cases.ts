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
    broaderContext: localizedSchema,
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
      ru: 'Развитие и повышение надёжности публичного сервиса',
      en: 'Improving the Reliability of an Existing Public-Facing Service',
    },
    summary: {
      ru: 'МТС Web Services: устранение технического долга, повышение надёжности интеграций и защита данных существующего публичного сервиса.',
      en: 'MTS Web Services: addressing technical debt, improving integration reliability, and protecting data in an existing public-facing service.',
    },
    evidence: 'confirmed',
    publishable: true,
    sections: {
      context: {
        ru: 'В рамках развития существующих публичных лендингов выполнял работы по повышению надёжности интеграций и совершенствованию общих технических решений. В ходе работы над одним из ранее существовавших сервисов был выявлен накопленный технический долг, влиявший на корректность обработки пользовательских заявок и создававший дополнительную нагрузку на бизнес-подразделения.',
        en: 'As part of the ongoing development of existing public-facing landing pages, I worked on improving integration reliability and shared technical solutions. While enhancing one of the existing services, I identified pre-existing technical debt affecting submission processing and creating additional workload for business teams.',
      },
      constraints: {
        ru: 'Изменения должны были сохранить штатную production-функциональность, обработку корректных заявок и возможность интеграционного тестирования. Чувствительные параметры и внутренние механизмы защиты не раскрываются.',
        en: 'The changes had to preserve normal production behavior, valid submission processing, and integration testing. Sensitive parameters and internal protection mechanisms are not disclosed.',
      },
      approach: {
        ru: 'Работа была разделена на три инженерных направления: надёжность интеграций и тестовых сред, обязательная серверная проверка данных и дополнительная защита публичного API. Оперативное исправление production-проблемы выполнялось отдельно от планового развития сервиса.',
        en: 'The work covered three engineering areas: integration and test-environment reliability, mandatory server-side data validation, and additional protection for the public API. The production issue was addressed separately from the service’s planned development.',
      },
      environmentIsolation: {
        ru: 'Исправил тестовые среды, исключив непреднамеренную отправку данных в бизнес-системы и сохранив возможность интеграционного тестирования.',
        en: 'Corrected test-environment behavior to prevent unintended submissions to business systems while preserving integration testing.',
      },
      serverValidation: {
        ru: 'Реализовал обязательную серверную валидацию на основе действующих правил обработки заявок. Заявки, не проходящие проверку, перестали передаваться дальше, при этом штатная обработка корректных заявок сохранилась.',
        en: 'Implemented mandatory server-side validation based on the existing submission rules. Submissions that failed validation were no longer forwarded, while valid submissions continued to be processed normally.',
      },
      apiProtection: {
        ru: 'Добавил rate limiting как дополнительную меру защиты публичного API от избыточного потока повторных запросов.',
        en: 'Added rate limiting as an additional safeguard for the public API against excessive repeated requests.',
      },
      broaderContext: {
        ru: 'Параллельно в рамках развития всех публичных лендингов выполнялись доработки общих технических решений в соответствии с требованиями законодательства о персональных данных, направленные на снижение правовых и финансовых рисков компании.',
        en: 'In parallel, shared technical solutions across all public-facing landing pages were adapted to support applicable personal data protection requirements and mitigate regulatory and financial risks.',
      },
      results: {
        ru: 'Исключена непреднамеренная отправка данных из тестовых сред и передача заявок, не проходящих серверную валидацию. Публичный API получил дополнительную защиту, а исправление было выпущено в production в день обращения маркетинга с сохранением штатной обработки корректных заявок. Эти изменения направлены на снижение риска избыточной операционной нагрузки и повышение надёжности взаимодействия со смежными бизнес-системами.',
        en: 'Unintended submissions from test environments and submissions failing server-side validation were prevented. The public API gained an additional safeguard, and the fix was deployed to production on the same day marketing reported the issue while valid submissions continued to be processed normally. These changes are intended to reduce the risk of excessive operational workload and improve the reliability of downstream business-system interactions.',
      },
      lessons: {
        ru: 'Развитие публичного веб-приложения не ограничивается реализацией пользовательского интерфейса. Инженерная ответственность включает надёжность интеграций, целостность данных и влияние технических решений на бизнес-процессы. Работа с существующими системами требует своевременного выявления и устранения накопленного технического долга.',
        en: 'Engineering a public-facing application goes beyond implementing its user interface. Engineering ownership includes integration reliability, data integrity, and the impact of technical decisions on business processes. Maintaining existing systems requires identifying and addressing accumulated technical debt.',
      },
    },
  },
]);
