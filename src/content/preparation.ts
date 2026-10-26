import { z } from 'zod';
import { interviewExercises, type InterviewExercise } from './interview';
import { notes } from './notes';

const localizedText = z
  .object({ ru: z.string().trim().min(1), en: z.string().trim().min(1) })
  .strict();
const referenceSchema = z
  .object({ title: z.string().trim().min(1), url: z.string().url().startsWith('https://') })
  .strict();
export const preparationCategories = [
  'javascript',
  'browser',
  'react',
  'node',
  'postgresql',
  'system-design',
  'architecture',
  'testing',
] as const;
export const preparationTopicSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    slug: z.string().regex(/^[a-z][a-z0-9-]*$/),
    title: localizedText,
    description: localizedText,
    category: z.enum(preparationCategories),
    difficulty: z.enum(['medium', 'hard', 'senior']),
    estimatedMinutes: z.number().int().positive(),
    prerequisites: z.array(z.string()),
    relatedTopics: z.array(z.string()),
    theory: z
      .object({
        shortAnswer: localizedText,
        detailedExplanation: z
          .object({ ru: z.array(z.string().min(1)).min(1), en: z.array(z.string().min(1)).min(1) })
          .strict(),
        mechanism: z
          .object({ ru: z.array(z.string().min(1)).min(1), en: z.array(z.string().min(1)).min(1) })
          .strict(),
        codeExamples: z.array(
          z
            .object({ label: localizedText, language: z.string(), code: z.string().min(1) })
            .strict(),
        ),
        commonMistakes: z
          .object({ ru: z.array(z.string().min(1)).min(1), en: z.array(z.string().min(1)).min(1) })
          .strict(),
        productionUse: localizedText,
        tradeoffs: localizedText,
        followUps: z
          .object({ ru: z.array(z.string().min(1)).min(1), en: z.array(z.string().min(1)).min(1) })
          .strict(),
      })
      .strict(),
    practiceIds: z.array(z.string()),
    scenarioIds: z.array(z.string()),
    references: z.array(referenceSchema).min(1),
    lastReviewedAt: z.string().date(),
  })
  .strict();
export type PreparationTopic = z.infer<typeof preparationTopicSchema>;

const categoryMap = {
  'browser-js': 'browser',
  'react-state': 'react',
  architecture: 'architecture',
  'production-testing': 'testing',
} as const;
const practiceByNote: Record<string, string[]> = {
  'browser-event-loop': ['01'],
  'virtual-dom': ['10'],
  'react-fiber': ['10'],
  'frontend-performance': ['09', '10', '12'],
  'mobx-redux': ['11'],
  'microfrontends-tradeoffs': ['15'],
  'playwright-flakiness': [],
  'url-navigation': ['12'],
  'mv-patterns': ['15'],
};

const noteTopics: PreparationTopic[] = notes.map((note) => ({
  id: note.id,
  slug: note.slug,
  title: { ru: note.ru.question, en: note.en.question },
  description: { ru: note.ru.shortAnswer, en: note.en.shortAnswer },
  category: categoryMap[note.category],
  difficulty: 'senior',
  estimatedMinutes: 35,
  prerequisites: [],
  relatedTopics: [],
  theory: {
    shortAnswer: { ru: note.ru.shortAnswer, en: note.en.shortAnswer },
    detailedExplanation: { ru: note.ru.deepDive, en: note.en.deepDive },
    mechanism: { ru: note.ru.deepDive, en: note.en.deepDive },
    codeExamples: [
      {
        label: { ru: note.ru.example.label, en: note.en.example.label },
        language: note.ru.example.language,
        code: note.ru.example.code,
      },
    ],
    commonMistakes: { ru: note.ru.pitfalls, en: note.en.pitfalls },
    productionUse: { ru: note.ru.example.explanation, en: note.en.example.explanation },
    tradeoffs: { ru: note.ru.pitfalls.join(' '), en: note.en.pitfalls.join(' ') },
    followUps: { ru: note.ru.followUps, en: note.en.followUps },
  },
  practiceIds: practiceByNote[note.id] ?? [],
  scenarioIds: [],
  references: note.sources,
  lastReviewedAt: note.reviewedAt,
}));

function compactTopic(input: {
  id: string;
  titleRu: string;
  titleEn: string;
  category: PreparationTopic['category'];
  summaryRu: string;
  summaryEn: string;
  practiceIds?: string[];
  relatedTopics?: string[];
  reference: { title: string; url: string };
}): PreparationTopic {
  const mistakes = {
    ru: ['Не путайте гарантию платформы с наблюдаемым порядком в одном окружении.'],
    en: ['Do not confuse a platform guarantee with an order observed in one environment.'],
  };
  return {
    id: input.id,
    slug: input.id,
    title: { ru: input.titleRu, en: input.titleEn },
    description: { ru: input.summaryRu, en: input.summaryEn },
    category: input.category,
    difficulty: 'senior',
    estimatedMinutes: 45,
    prerequisites: [],
    relatedTopics: input.relatedTopics ?? [],
    theory: {
      shortAnswer: { ru: input.summaryRu, en: input.summaryEn },
      detailedExplanation: { ru: [input.summaryRu], en: [input.summaryEn] },
      mechanism: { ru: [input.summaryRu], en: [input.summaryEn] },
      codeExamples: [],
      commonMistakes: mistakes,
      productionUse: {
        ru: 'Используйте измерения, ограничения платформы и явные инварианты.',
        en: 'Use measurements, platform constraints, and explicit invariants.',
      },
      tradeoffs: {
        ru: 'Надёжность и предсказуемость обычно требуют дополнительной сложности и наблюдаемости.',
        en: 'Reliability and predictability usually require extra complexity and observability.',
      },
      followUps: {
        ru: ['Как проверить гипотезу в production?'],
        en: ['How would you verify the hypothesis in production?'],
      },
    },
    practiceIds: input.practiceIds ?? [],
    scenarioIds: [],
    references: [input.reference],
    lastReviewedAt: '2026-10-27',
  };
}

const priorityTopics: PreparationTopic[] = [
  compactTopic({
    id: 'react-batching-closures',
    titleRu: 'React: batching, snapshots и замыкания',
    titleEn: 'React batching, snapshots, and closures',
    category: 'react',
    summaryRu:
      'Каждый render получает снимок state; функциональный updater читает предыдущее значение из очереди обновлений и устраняет stale state.',
    summaryEn:
      'Each render receives a state snapshot; a functional updater reads the previous queued value and avoids stale state.',
    reference: {
      title: 'React — Queueing a Series of State Updates',
      url: 'https://react.dev/learn/queueing-a-series-of-state-updates',
    },
  }),
  compactTopic({
    id: 'react-memoization',
    titleRu: 'React.memo, useCallback и useMemo',
    titleEn: 'React.memo, useCallback, and useMemo',
    category: 'react',
    summaryRu:
      'Мемоизация полезна только при измеримой стоимости и стабильных props; она не исправляет stale state и сама имеет цену.',
    summaryEn:
      'Memoization helps only with measured cost and stable props; it does not fix stale state and has its own cost.',
    practiceIds: ['10'],
    reference: { title: 'React — memo', url: 'https://react.dev/reference/react/memo' },
  }),
  compactTopic({
    id: 'browser-rendering-pipeline',
    titleRu: 'Browser Rendering Pipeline',
    titleEn: 'Browser Rendering Pipeline',
    category: 'browser',
    summaryRu:
      'DOM и CSSOM формируют render tree, после чего выполняются style, layout, paint и compositing; defer гарантирует порядок относительно parsing, но не первый paint.',
    summaryEn:
      'DOM and CSSOM form the render tree followed by style, layout, paint, and compositing; defer constrains parsing order, not the first paint.',
    practiceIds: ['12'],
    reference: {
      title: 'web.dev — How browsers work',
      url: 'https://web.dev/articles/howbrowserswork',
    },
  }),
  compactTopic({
    id: 'node-event-loop',
    titleRu: 'Node.js Event Loop и libuv',
    titleEn: 'Node.js Event Loop and libuv',
    category: 'node',
    summaryRu:
      'JavaScript выполняется в основном потоке; libuv управляет фазами I/O и ограниченным thread pool, а CPU-bound синхронная работа блокирует все запросы процесса.',
    summaryEn:
      'JavaScript runs on the main thread; libuv manages I/O phases and a bounded thread pool, while synchronous CPU-bound work blocks every request in the process.',
    reference: {
      title: 'Node.js — Event Loop',
      url: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick',
    },
  }),
  compactTopic({
    id: 'postgresql-concurrency',
    titleRu: 'PostgreSQL concurrency и isolation',
    titleEn: 'PostgreSQL concurrency and isolation',
    category: 'postgresql',
    summaryRu:
      'Изоляция определяет видимость конкурентных изменений; UNIQUE устраняет конкретную гонку атомарно, а locks и Serializable нужны для более широких инвариантов.',
    summaryEn:
      'Isolation controls visibility of concurrent changes; UNIQUE atomically removes a specific race, while locks and Serializable protect broader invariants.',
    reference: {
      title: 'PostgreSQL — Transaction Isolation',
      url: 'https://www.postgresql.org/docs/current/transaction-iso.html',
    },
  }),
  compactTopic({
    id: 'idempotency',
    titleRu: 'Идемпотентность операций',
    titleEn: 'Operation idempotency',
    category: 'postgresql',
    summaryRu:
      'Idempotency-Key должен иметь UNIQUE-ограничение, привязку к payload и сохранённый результат, чтобы безопасно отвечать на retry после неопределённого исхода.',
    summaryEn:
      'An Idempotency-Key needs a UNIQUE constraint, payload binding, and a stored result to answer retries safely after an uncertain outcome.',
    relatedTopics: ['postgresql-concurrency'],
    reference: {
      title: 'PostgreSQL — INSERT ON CONFLICT',
      url: 'https://www.postgresql.org/docs/current/sql-insert.html',
    },
  }),
  compactTopic({
    id: 'reliable-messaging',
    titleRu: 'Надёжная доставка сообщений',
    titleEn: 'Reliable message delivery',
    category: 'system-design',
    summaryRu:
      'At-least-once допускает дубликаты и требует идемпотентного consumer; exactly-once ограничено границами конкретной системы и не устраняет неопределённый внешний вызов.',
    summaryEn:
      'At-least-once permits duplicates and needs an idempotent consumer; exactly-once is bounded by a specific system and cannot erase uncertainty around an external call.',
    practiceIds: ['15'],
    relatedTopics: ['idempotency'],
    reference: {
      title: 'AWS — REL04-BP04 Make mutating operations idempotent',
      url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_prevent_interaction_failure_idempotent.html',
    },
  }),
];

export const preparationTopics = z
  .array(preparationTopicSchema)
  .superRefine((items, ctx) => {
    for (const key of ['id', 'slug'] as const)
      if (new Set(items.map((item) => item[key])).size !== items.length)
        ctx.addIssue({ code: 'custom', message: `${key} must be unique` });
    const topicIds = new Set(items.map(({ id }) => id));
    const exerciseIds = new Set(interviewExercises.map(({ id }) => id));
    for (const item of items) {
      for (const id of [...item.prerequisites, ...item.relatedTopics])
        if (!topicIds.has(id))
          ctx.addIssue({ code: 'custom', message: `Unknown topic relation ${id}` });
      for (const id of item.practiceIds)
        if (!exerciseIds.has(id))
          ctx.addIssue({ code: 'custom', message: `Unknown exercise ${id}` });
    }
  })
  .parse([...noteTopics, ...priorityTopics]);

const pathInput = [
  [
    'senior-javascript-browser',
    ['browser-event-loop', 'browser-rendering-pipeline', 'url-navigation'],
    ['01', '09', '12'],
  ],
  [
    'senior-react-frontend',
    ['react-batching-closures', 'react-memoization', 'virtual-dom', 'react-fiber'],
    ['05', '10', '11'],
  ],
  [
    'senior-node-backend',
    ['node-event-loop', 'postgresql-concurrency', 'idempotency'],
    ['01', '03'],
  ],
  ['senior-system-design', ['reliable-messaging', 'microfrontends-tradeoffs'], ['14', '15']],
  [
    'senior-fullstack',
    [
      'browser-event-loop',
      'react-batching-closures',
      'node-event-loop',
      'postgresql-concurrency',
      'reliable-messaging',
    ],
    ['01', '05', '10', '12', '15'],
  ],
  [
    'weak-spots',
    [
      'react-batching-closures',
      'react-memoization',
      'browser-rendering-pipeline',
      'node-event-loop',
      'postgresql-concurrency',
      'idempotency',
      'reliable-messaging',
    ],
    ['01', '10', '12', '15'],
  ],
] as const;

export const learningPaths = pathInput.map(([id, topicIds, exerciseIds]) => ({
  id,
  title: {
    ru: id === 'weak-spots' ? 'Работа над слабыми местами' : id.replaceAll('-', ' '),
    en: id === 'weak-spots' ? 'Focused review' : id.replaceAll('-', ' '),
  },
  description: {
    ru:
      id === 'weak-spots'
        ? 'Стартовый маршрут повторения, не публичная оценка профессионального уровня.'
        : 'Упорядоченная подготовка Senior-уровня.',
    en:
      id === 'weak-spots'
        ? 'A starter review path, not a public assessment of professional level.'
        : 'An ordered senior-level preparation path.',
  },
  targetRole: 'Senior Software Engineer',
  topicIds: [...topicIds],
  exerciseIds: [...exerciseIds],
  recommendedOrder: [...topicIds, ...exerciseIds],
  estimatedMinutes: topicIds.length * 45 + exerciseIds.length * 60,
}));

export function resolveExerciseNavigation(
  slug: string,
  options: { pathId?: string; exerciseSlugs?: string[] } = {},
) {
  const path = learningPaths.find(({ id }) => id === options.pathId);
  const byId = new Map(interviewExercises.map((exercise) => [exercise.id, exercise]));
  const selected =
    options.exerciseSlugs
      ?.map((item) => interviewExercises.find(({ slug: candidate }) => candidate === item))
      .filter((item): item is InterviewExercise => Boolean(item)) ??
    path?.exerciseIds
      .map((id) => byId.get(id))
      .filter((item): item is InterviewExercise => Boolean(item)) ??
    interviewExercises;
  const usable = selected.some((item) => item.slug === slug) ? selected : interviewExercises;
  const index = usable.findIndex((item) => item.slug === slug);
  return {
    previous: usable[index - 1],
    next: usable[index + 1],
    position: index + 1,
    total: usable.length,
    context: path && usable === selected ? path.id : undefined,
  };
}

export const topicForExercise = (id: string) =>
  preparationTopics.find((topic) => topic.practiceIds.includes(id));
