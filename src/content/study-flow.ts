import { z } from 'zod';

const localized = z.object({ ru: z.string().min(1), en: z.string().min(1) }).strict();
const cardKinds = [
  'hook',
  'concept',
  'diagram',
  'worked-example',
  'interactive-prediction',
  'mini-task',
  'answer',
  'pitfall',
  'production-case',
  'recap',
  'self-check',
] as const;
const cardSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    kind: z.enum(cardKinds),
    title: localized,
    body: localized,
    estimatedMinutes: z.number().int().min(1).max(8),
    details: localized.optional(),
    assessment: z
      .object({ question: localized, criteria: z.array(localized).min(1) })
      .strict()
      .optional(),
    diagram: z
      .object({ steps: z.array(localized).min(2), alternative: localized })
      .strict()
      .optional(),
    challengeTemplateId: z.literal('event-loop-order').optional(),
  })
  .strict();

export const learningSessionSchema = z
  .object({
    id: z.string().regex(/^[a-z][a-z0-9-]*$/),
    version: z.number().int().positive(),
    title: localized,
    goal: localized,
    category: z.enum(['browser', 'react']),
    tags: z.array(z.string()).min(1),
    difficulty: z.enum(['hard', 'senior']),
    estimatedMinutes: z.number().int().min(15).max(20),
    cards: z.array(cardSchema).min(4).max(8),
    sourceTopicIds: z.array(z.string()),
    sourceExerciseIds: z.array(z.string()),
    prerequisiteSessionIds: z.array(z.string()),
    relatedSessionIds: z.array(z.string()),
    conceptIds: z.array(z.string()).min(1),
    reviewPolicy: z
      .object({
        againDays: z.literal(1),
        hardDays: z.literal(3),
        goodDays: z.literal(7),
        easyDays: z.literal(14),
      })
      .strict(),
    sources: z.array(z.object({ title: z.string(), url: z.string().url() }).strict()).min(1),
    updatedAt: z.string().date(),
  })
  .strict()
  .superRefine((session, context) => {
    if (
      session.cards.reduce((sum, card) => sum + card.estimatedMinutes, 0) + 1 !==
      session.estimatedMinutes
    )
      context.addIssue({
        code: 'custom',
        message: 'Card minutes plus one reflection minute must equal session duration',
      });
    if (!session.cards.some(({ kind }) => kind === 'self-check'))
      context.addIssue({ code: 'custom', message: 'Session requires self-check' });
  });
export type LearningSession = z.infer<typeof learningSessionSchema>;
const reviewPolicy = { againDays: 1, hardDays: 3, goodDays: 7, easyDays: 14 } as const;
const l = (ru: string, en: string) => ({ ru, en });
const source = (title: string, url: string) => ({ title, url });

export const learningSessionsSchema = z
  .array(learningSessionSchema)
  .superRefine((sessions, context) => {
    const ids = new Set(sessions.map(({ id }) => id));
    if (ids.size !== sessions.length)
      context.addIssue({ code: 'custom', message: 'Session IDs must be unique' });
    for (const session of sessions)
      for (const id of [...session.prerequisiteSessionIds, ...session.relatedSessionIds])
        if (!ids.has(id))
          context.addIssue({ code: 'custom', message: `Unknown session relation: ${id}` });
  });

export const learningSessions: LearningSession[] = learningSessionsSchema.parse([
  {
    id: 'browser-event-loop-mechanics',
    version: 1,
    title: l('Event Loop: механизм', 'Event Loop mechanics'),
    goal: l(
      'Объяснить порядок task, microtask и возможности рендера.',
      'Explain task, microtask, and rendering opportunity order.',
    ),
    category: 'browser',
    tags: ['event-loop', 'timing'],
    difficulty: 'hard',
    estimatedMinutes: 17,
    sourceTopicIds: ['browser-event-loop'],
    sourceExerciseIds: [],
    prerequisiteSessionIds: [],
    relatedSessionIds: ['browser-event-loop-prediction'],
    conceptIds: ['call-stack', 'task', 'microtask', 'rendering-opportunity'],
    reviewPolicy,
    updatedAt: '2026-10-29',
    sources: [
      source(
        'HTML — Event loops',
        'https://html.spec.whatwg.org/multipage/webappapis.html#event-loops',
      ),
    ],
    cards: [
      {
        id: 'question',
        kind: 'hook',
        title: l('Почему Promise раньше таймера?', 'Why does a Promise run before a timer?'),
        body: l(
          'Сформулируйте правило до чтения ответа: одинаков ли порядок с порядком строк?',
          'State a rule before reading: is execution order the same as source order?',
        ),
        estimatedMinutes: 2,
      },
      {
        id: 'queues',
        kind: 'concept',
        title: l('Task и microtask', 'Tasks and microtasks'),
        body: l(
          'Один task выполняется до конца. Затем event loop очищает очередь microtask, включая добавленные во время checkpoint.',
          'One task runs to completion. The event loop then drains microtasks, including those queued during the checkpoint.',
        ),
        estimatedMinutes: 4,
      },
      {
        id: 'timeline',
        kind: 'diagram',
        title: l('Один оборот цикла', 'One event-loop turn'),
        body: l(
          'Следуйте причинному порядку, а не считайте очереди параллельными.',
          'Follow causal order; do not treat queues as parallel.',
        ),
        estimatedMinutes: 3,
        diagram: {
          steps: [
            l('Task: синхронный стек', 'Task: synchronous stack'),
            l('Microtask checkpoint до опустошения', 'Drain microtask checkpoint'),
            l('Возможность обновить rendering', 'Rendering opportunity'),
            l('Следующий task', 'Next task'),
          ],
          alternative: l(
            'Task завершается, затем полностью очищаются microtasks, браузер может отрисовать кадр, после чего берёт следующий task.',
            'A task completes, all microtasks drain, the browser may render, then it takes the next task.',
          ),
        },
      },
      {
        id: 'starvation',
        kind: 'pitfall',
        title: l('Microtask starvation', 'Microtask starvation'),
        body: l(
          'Рекурсивное добавление microtask может не дать циклу дойти до рендера и следующего task.',
          'Recursively adding microtasks can prevent rendering and the next task.',
        ),
        estimatedMinutes: 3,
      },
      {
        id: 'check',
        kind: 'self-check',
        title: l('Самопроверка', 'Self-check'),
        body: l(
          'Ответьте вслух и сравните с критериями.',
          'Answer aloud and compare with the criteria.',
        ),
        estimatedMinutes: 4,
        assessment: {
          question: l(
            'Когда браузер может отрисовать кадр и почему Promise callback обычно раньше setTimeout(0)?',
            'When may the browser render, and why does a Promise callback usually precede setTimeout(0)?',
          ),
          criteria: [
            l('Task выполняется до конца.', 'A task runs to completion.'),
            l(
              'Microtasks очищаются перед следующим task.',
              'Microtasks drain before the next task.',
            ),
            l(
              'Рендер — возможность, а не гарантия после каждого task.',
              'Rendering is an opportunity, not guaranteed after each task.',
            ),
          ],
        },
      },
    ],
  },
  {
    id: 'browser-event-loop-prediction',
    version: 1,
    title: l('Event Loop: предсказание порядка', 'Event Loop order prediction'),
    goal: l(
      'Предсказывать вывод и объяснять каждый переход.',
      'Predict output and explain every transition.',
    ),
    category: 'browser',
    tags: ['event-loop', 'practice'],
    difficulty: 'senior',
    estimatedMinutes: 18,
    sourceTopicIds: ['browser-event-loop'],
    sourceExerciseIds: ['01'],
    prerequisiteSessionIds: ['browser-event-loop-mechanics'],
    relatedSessionIds: ['browser-event-loop-mechanics'],
    conceptIds: ['task', 'microtask'],
    reviewPolicy,
    updatedAt: '2026-10-29',
    sources: [
      source(
        'MDN — Microtask guide',
        'https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide',
      ),
    ],
    cards: [
      {
        id: 'contract',
        kind: 'concept',
        title: l('Алгоритм решения', 'Prediction algorithm'),
        body: l(
          'Выпишите sync, зарегистрированные tasks и microtasks; после sync очищайте microtasks до конца.',
          'List sync work, registered tasks, and microtasks; after sync, drain microtasks completely.',
        ),
        estimatedMinutes: 3,
      },
      {
        id: 'generated',
        kind: 'interactive-prediction',
        title: l('Вариант по seed', 'Seeded variant'),
        body: l(
          'Предскажите пять строк. Seed хранится в URL и воспроизводит условие.',
          'Predict five lines. The URL seed reproduces the prompt.',
        ),
        estimatedMinutes: 5,
        challengeTemplateId: 'event-loop-order',
      },
      {
        id: 'reveal',
        kind: 'answer',
        title: l('Разбор', 'Reveal'),
        body: l(
          'Сначала sync-логи, затем Promise microtask и вложенная microtask, затем timer task.',
          'Sync logs come first, then the Promise microtask and nested microtask, then the timer task.',
        ),
        estimatedMinutes: 3,
        details: l(
          'Положение setTimeout в исходнике не переносит его callback в текущий task.',
          'The location of setTimeout in source does not move its callback into the current task.',
        ),
      },
      {
        id: 'production',
        kind: 'production-case',
        title: l('Цена длинной очереди', 'Cost of a long queue'),
        body: l(
          'Длинный sync task и бесконечная microtask-цепочка одинаково задерживают отзывчивость, но диагностируются по-разному.',
          'A long sync task and an unbounded microtask chain both delay responsiveness but require different diagnosis.',
        ),
        estimatedMinutes: 3,
      },
      {
        id: 'check',
        kind: 'self-check',
        title: l('Самопроверка', 'Self-check'),
        body: l(
          'Объясните решение без ссылки на запомненный вывод.',
          'Explain the solution without relying on memorized output.',
        ),
        estimatedMinutes: 3,
        assessment: {
          question: l(
            'Что изменится, если timer создаётся внутри Promise callback?',
            'What changes if the timer is created inside the Promise callback?',
          ),
          criteria: [
            l(
              'Регистрация timer произойдёт во время microtask.',
              'The timer is registered during the microtask.',
            ),
            l('Callback всё равно будет отдельным task.', 'Its callback remains a separate task.'),
          ],
        },
      },
    ],
  },
  {
    id: 'browser-rendering-critical-path',
    version: 1,
    title: l('Критический путь рендера', 'Critical rendering path'),
    goal: l(
      'Связать DOM/CSSOM, layout, paint и compositing с наблюдаемой задержкой.',
      'Connect DOM/CSSOM, layout, paint, and compositing to visible latency.',
    ),
    category: 'browser',
    tags: ['rendering', 'performance'],
    difficulty: 'senior',
    estimatedMinutes: 17,
    sourceTopicIds: ['browser-rendering-pipeline'],
    sourceExerciseIds: [],
    prerequisiteSessionIds: [],
    relatedSessionIds: ['browser-event-loop-mechanics'],
    conceptIds: ['dom', 'cssom', 'layout', 'paint', 'composite'],
    reviewPolicy,
    updatedAt: '2026-10-29',
    sources: [
      source(
        'web.dev — Critical rendering path',
        'https://web.dev/learn/performance/understanding-the-critical-path',
      ),
    ],
    cards: [
      {
        id: 'question',
        kind: 'hook',
        title: l('Когда появятся пиксели?', 'When do pixels appear?'),
        body: l(
          'Загрузка HTML не равна первому paint: нужны данные и возможность главного потока выполнить работу.',
          'Loading HTML is not first paint: data and main-thread opportunity are required.',
        ),
        estimatedMinutes: 2,
      },
      {
        id: 'pipeline',
        kind: 'diagram',
        title: l('Pipeline', 'Pipeline'),
        body: l(
          'Изменение свойства запускает не всегда все этапы.',
          'A property change does not always trigger every stage.',
        ),
        estimatedMinutes: 4,
        diagram: {
          steps: [
            l('HTML → DOM; CSS → CSSOM', 'HTML → DOM; CSS → CSSOM'),
            l('Style → render tree', 'Style → render tree'),
            l('Layout: геометрия', 'Layout: geometry'),
            l('Paint: команды рисования', 'Paint: drawing commands'),
            l('Composite: слои в кадр', 'Composite: layers into a frame'),
          ],
          alternative: l(
            'DOM и CSSOM участвуют в style; layout вычисляет геометрию, paint записывает рисунок, compositor собирает слои.',
            'DOM and CSSOM feed style; layout computes geometry, paint records drawing, and the compositor assembles layers.',
          ),
        },
      },
      {
        id: 'defer',
        kind: 'worked-example',
        title: l('defer не обещает first paint', 'defer does not guarantee first paint'),
        body: l(
          'defer сохраняет порядок выполнения после parsing, но CSS, шрифты, main-thread work и политика браузера влияют на paint.',
          'defer preserves execution order after parsing, while CSS, fonts, main-thread work, and browser policy affect paint.',
        ),
        estimatedMinutes: 4,
      },
      {
        id: 'tradeoff',
        kind: 'production-case',
        title: l('Измеряйте этап', 'Measure the stage'),
        body: l(
          'DevTools Performance и Web Vitals помогают разделить network, long tasks, layout и paint; оптимизация без диагноза может перенести стоимость.',
          'DevTools Performance and Web Vitals separate network, long tasks, layout, and paint; undiagnosed optimization can only move cost.',
        ),
        estimatedMinutes: 3,
      },
      {
        id: 'check',
        kind: 'self-check',
        title: l('Самопроверка', 'Self-check'),
        body: l('Разберите изменение width и transform.', 'Compare changing width with transform.'),
        estimatedMinutes: 3,
        assessment: {
          question: l(
            'Почему transform часто дешевле width и когда это не спасает?',
            'Why is transform often cheaper than width, and when does that not help?',
          ),
          criteria: [
            l('width обычно требует layout и paint.', 'width usually requires layout and paint.'),
            l('transform может ограничиться compositing.', 'transform may be compositing-only.'),
            l(
              'Большие слои и rasterization тоже имеют цену.',
              'Large layers and rasterization still have costs.',
            ),
          ],
        },
      },
    ],
  },
  {
    id: 'react-fiber-render-commit',
    version: 1,
    title: l('React Fiber: render и commit', 'React Fiber: render and commit'),
    goal: l(
      'Разделять вычисление следующего UI и применение изменений.',
      'Separate computing the next UI from applying changes.',
    ),
    category: 'react',
    tags: ['react', 'fiber'],
    difficulty: 'senior',
    estimatedMinutes: 18,
    sourceTopicIds: ['react-fiber'],
    sourceExerciseIds: [],
    prerequisiteSessionIds: [],
    relatedSessionIds: ['browser-event-loop-mechanics'],
    conceptIds: ['fiber', 'render-phase', 'commit-phase'],
    reviewPolicy,
    updatedAt: '2026-10-29',
    sources: [source('React — Render and Commit', 'https://react.dev/learn/render-and-commit')],
    cards: [
      {
        id: 'question',
        kind: 'hook',
        title: l('Почему render можно прервать?', 'Why can render be interrupted?'),
        body: l(
          'Потому что render вычисляет описание изменений; незавершённый результат ещё не должен быть виден пользователю.',
          'Render computes a description of changes; incomplete work must not become visible.',
        ),
        estimatedMinutes: 2,
      },
      {
        id: 'fiber',
        kind: 'concept',
        title: l('Fiber как единица работы', 'Fiber as a unit of work'),
        body: l(
          'Fiber хранит связь с компонентом и позволяет React планировать небольшие units of work по приоритету.',
          'A Fiber represents component-related work and lets React schedule small units by priority.',
        ),
        estimatedMinutes: 4,
      },
      {
        id: 'phases',
        kind: 'diagram',
        title: l('Две фазы', 'Two phases'),
        body: l(
          'Render может быть повторён или отброшен; commit применяет согласованный результат.',
          'Render may restart or be discarded; commit applies a consistent result.',
        ),
        estimatedMinutes: 4,
        diagram: {
          steps: [
            l('Update получает priority', 'Update receives priority'),
            l('Render строит work-in-progress tree', 'Render builds a work-in-progress tree'),
            l('Commit изменяет DOM и refs', 'Commit mutates DOM and refs'),
            l('Effects выполняются по своим правилам', 'Effects run according to their timing'),
          ],
          alternative: l(
            'Планировщик выбирает update, render вычисляет дерево, commit синхронно применяет согласованные мутации, затем запускаются effects.',
            'The scheduler selects an update, render computes a tree, commit synchronously applies consistent mutations, then effects run.',
          ),
        },
      },
      {
        id: 'purity',
        kind: 'pitfall',
        title: l('Render должен быть чистым', 'Render must stay pure'),
        body: l(
          'Side effect в render может выполниться несколько раз или для отброшенной работы. Переносите синхронизацию во event handler или effect.',
          'A render side effect may run repeatedly or for discarded work. Put synchronization in an event handler or effect.',
        ),
        estimatedMinutes: 3,
      },
      {
        id: 'check',
        kind: 'self-check',
        title: l('Самопроверка', 'Self-check'),
        body: l('Свяжите interruptibility с purity.', 'Connect interruptibility to purity.'),
        estimatedMinutes: 4,
        assessment: {
          question: l(
            'Почему commit не прерывают посередине и чем опасен side effect в render?',
            'Why is commit not interrupted halfway, and why is a render side effect unsafe?',
          ),
          criteria: [
            l(
              'Частичный commit показал бы несогласованный UI.',
              'A partial commit would expose inconsistent UI.',
            ),
            l('Render может повториться или быть отброшен.', 'Render may repeat or be discarded.'),
            l(
              'Effects не являются частью чистого вычисления UI.',
              'Effects are not part of pure UI computation.',
            ),
          ],
        },
      },
    ],
  },
]);

export const learningSessionIds = learningSessions.map(({ id }) => id);
