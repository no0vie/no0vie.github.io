export const javascriptExercises = [
  {
    id: '01',
    slug: 'event-loop-execution-order',
    category: 'javascript',
    difficulty: 'medium',
    estimatedMinutes: 25,
    tags: ['JavaScript', 'Event Loop', 'Promises', 'Microtasks'],
    runtime: 'universal',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Порядок выполнения Event Loop',
        description:
          'Разберите очереди синхронного кода, микрозадач и таймеров без запуска программы.',
        problem:
          'Определите точный порядок строк в консоли для приведённого фрагмента и объясните каждый переход. Затем измените пример так, чтобы отменённая микрозадача не влияла на ответ. Важно рассуждать по спецификации: стек текущей задачи завершается до checkpoint микрозадач, а таймер создаёт следующую задачу.',
        examples: [
          "Вход:\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => { console.log('C'); queueMicrotask(() => console.log('D')); });\nqueueMicrotask(() => console.log('E'));\nconsole.log('F');\n\nОжидаемый вывод: A, F, C, E, D, B.",
          'Микрозадача, поставленная во время выполнения другой микрозадачи, добавляется в конец той же очереди; она выполняется до следующего таймера.',
        ],
        requirements: [
          'Назовите отдельно синхронную фазу, checkpoint микрозадач и следующую задачу таймера.',
          'Объясните FIFO-порядок C, E и D, включая момент постановки D в очередь.',
          'Укажите, почему нулевая задержка таймера не означает немедленное выполнение.',
        ],
        starterCode: {
          label: 'Фрагмент для анализа',
          language: 'ts',
          code: `console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => {\n  console.log('C');\n  queueMicrotask(() => console.log('D'));\n});\nqueueMicrotask(() => console.log('E'));\nconsole.log('F');`,
        },
        hints: [
          'Сначала полностью выполните текущий скрипт как одну задачу: callbacks таймера и Promise пока только регистрируются в соответствующих очередях.',
          'После освобождения стека среда опустошает очередь микрозадач целиком; новые микрозадачи добавляются в её хвост, а не запускаются рекурсивно сразу.',
          'Запишите состояние очереди после каждой строки: после скрипта там C и E, при выполнении C в хвост добавляется D; только затем допускается B.',
        ],
        solution: {
          blocks: [
            {
              label: 'Проверяемый пример',
              language: 'ts',
              code: `const output: string[] = [];\nconst record = (value: string): void => { output.push(value); };\n\nrecord('A');\nsetTimeout(() => {\n  record('B');\n  console.assert(output.join(',') === 'A,F,C,E,D,B');\n}, 0);\nPromise.resolve().then(() => {\n  record('C');\n  queueMicrotask(() => record('D'));\n});\nqueueMicrotask(() => record('E'));\nrecord('F');\n\n// До первого checkpoint: ['A', 'F']; итог: ['A', 'F', 'C', 'E', 'D', 'B']`,
            },
          ],
          alternative: [
            'Для теста без реальных таймеров можно вынести бизнес-логику в функции и проверять их отдельно, но порядок очередей всё равно должен проверяться интеграционным тестом среды выполнения.',
            'В Node.js дополнительные очереди вроде process.nextTick имеют особые правила; этот ответ намеренно использует только универсальные Promise, queueMicrotask и setTimeout.',
          ],
        },
        explanation: [
          'A и F записываются синхронно. Promise reaction C и queueMicrotask E уже стоят в FIFO-очереди, когда стек скрипта освобождается. C выполняется первой и добавляет D после E, поэтому checkpoint даёт C, E, D.',
          'setTimeout с задержкой 0 задаёт минимальную задержку допуска, а не приоритет. Callback B может стать задачей только после завершения текущей задачи и полного опустошения очереди микрозадач.',
        ],
        edgeCases: [
          'Бесконечная цепочка микрозадач способна задерживать таймеры и отрисовку — microtask starvation.',
          'Необработанное исключение в callback не меняет уже сформированный порядок, но способ сообщения об ошибке зависит от среды.',
          'Вложенный setTimeout попадает в будущую задачу, а не в текущий microtask checkpoint.',
        ],
        complexity: [
          'По времени O(n) для n выполненных callbacks.',
          'По памяти O(q), где q — максимальное число ожидающих callbacks.',
        ],
        followUps: [
          'Чем браузерный цикл событий отличается от фаз Node.js?',
          'Когда MutationObserver и async/await ставят продолжения в очередь?',
          'Как starvation микрозадач влияет на отзывчивость интерфейса?',
        ],
        production: [
          'Не полагайтесь на setTimeout(..., 0) для точной синхронизации: используйте явные Promise/API-сигналы и тестируйте порядок в целевых средах.',
        ],
        furtherReading: [
          {
            label: 'MDN: Event loop',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop',
          },
          {
            label: 'MDN: queueMicrotask',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide',
          },
        ],
      },
      en: {
        title: 'Event Loop Execution Order',
        description:
          'Reason about synchronous code, microtasks, and timers without running the program.',
        problem:
          'Determine the exact console output for the snippet and explain every transition. Then describe how cancellation could prevent scheduled application work from changing the result. Base the answer on event-loop semantics: the current task finishes before the microtask checkpoint, while a timer callback belongs to a later task.',
        examples: [
          "Input:\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => { console.log('C'); queueMicrotask(() => console.log('D')); });\nqueueMicrotask(() => console.log('E'));\nconsole.log('F');\n\nExpected output: A, F, C, E, D, B.",
          'A microtask queued by another microtask is appended to the same queue and runs before the next timer task.',
        ],
        requirements: [
          'Separate the synchronous phase, the microtask checkpoint, and the subsequent timer task.',
          'Explain the FIFO order of C, E, and D, including when D is enqueued.',
          'Explain why a zero-delay timer does not execute immediately.',
        ],
        starterCode: {
          label: 'Snippet to analyze',
          language: 'ts',
          code: `console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => {\n  console.log('C');\n  queueMicrotask(() => console.log('D'));\n});\nqueueMicrotask(() => console.log('E'));\nconsole.log('F');`,
        },
        hints: [
          'First execute the whole script as one task: timer and Promise callbacks are only registered while the current JavaScript stack is non-empty.',
          'Once the stack is empty, the runtime drains the microtask queue completely; microtasks created during that process join the tail instead of running recursively.',
          'Write the queue after every statement: C and E are queued after the script; C appends D behind E, and only after that checkpoint may B run.',
        ],
        solution: {
          blocks: [
            {
              label: 'Verifiable example',
              language: 'ts',
              code: `const output: string[] = [];\nconst record = (value: string): void => { output.push(value); };\n\nrecord('A');\nsetTimeout(() => {\n  record('B');\n  console.assert(output.join(',') === 'A,F,C,E,D,B');\n}, 0);\nPromise.resolve().then(() => {\n  record('C');\n  queueMicrotask(() => record('D'));\n});\nqueueMicrotask(() => record('E'));\nrecord('F');\n\n// Before the first checkpoint: ['A', 'F']; final: ['A', 'F', 'C', 'E', 'D', 'B']`,
            },
          ],
          alternative: [
            'A fake scheduler can make application tests deterministic, but an integration test in the target runtime is still needed to verify queue semantics.',
            'Node.js adds queues such as process.nextTick with distinct precedence; this answer deliberately uses only universal Promise, queueMicrotask, and setTimeout APIs.',
          ],
        },
        explanation: [
          'A and F are recorded synchronously. Promise reaction C and microtask E are already queued FIFO when the script stack clears. C runs first and appends D after E, so the checkpoint produces C, E, D.',
          'A zero timeout is an eligibility delay, not an immediate-call guarantee. B cannot run until the current task and the complete microtask checkpoint have finished.',
        ],
        edgeCases: [
          'An unbounded microtask chain can delay timers and rendering through microtask starvation.',
          'An uncaught callback exception does not reorder queued work, although reporting differs by runtime.',
          'A nested setTimeout creates another future task rather than joining the current checkpoint.',
        ],
        complexity: [
          'Time is O(n) for n executed callbacks.',
          'Space is O(q) for the maximum number of queued callbacks.',
        ],
        followUps: [
          'How does the browser event loop differ from Node.js phases?',
          'Where do MutationObserver and async/await continuations run?',
          'How does microtask starvation affect UI responsiveness?',
        ],
        production: [
          'Do not use setTimeout(..., 0) as precise synchronization; use explicit promises or API signals and verify ordering in every supported runtime.',
        ],
        furtherReading: [
          {
            label: 'MDN: Event loop',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop',
          },
          {
            label: 'MDN: queueMicrotask',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide',
          },
        ],
      },
    },
  },
  {
    id: '02',
    slug: 'implement-promise-all',
    category: 'javascript',
    difficulty: 'hard',
    estimatedMinutes: 45,
    tags: ['JavaScript', 'Promise', 'Thenables', 'Async'],
    runtime: 'universal',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Реализация Promise.all',
        description:
          'Реализуйте типобезопасный аналог Promise.all с сохранением порядка и fail-fast семантикой.',
        problem:
          'Напишите функцию promiseAll, которая принимает iterable значений, Promise и thenable-объектов, запускает их ожидание параллельно и возвращает результаты в исходном порядке. Пустой ввод должен разрешаться пустым массивом, а первое отклонение — немедленно отклонять общий Promise без попытки отменить остальные операции.',
        examples: [
          "await promiseAll([Promise.resolve(1), 2, Promise.resolve('x')]) возвращает [1, 2, 'x'].",
          'promiseAll([]) разрешается пустым массивом; отклонение любого элемента отклоняет итоговый Promise той же причиной.',
        ],
        requirements: [
          'Поддержите любой Iterable значений и ассимилируйте thenable через Promise.resolve.',
          'Сохраните порядок входа независимо от порядка завершения.',
          'Корректно обработайте пустой iterable, синхронную ошибку итератора и первое отклонение.',
        ],
        starterCode: {
          label: 'Сигнатура',
          language: 'ts',
          code: 'function promiseAll<T>(values: Iterable<T | PromiseLike<T>>): Promise<T[]> {\n  // TODO\n}',
        },
        hints: [
          'Сначала синхронно пройдите iterable и присвойте каждому элементу индекс; длина массива не обязана быть известна заранее.',
          'Оберните каждый элемент в Promise.resolve: это ассимилирует корректные thenable и превращает обычные значения в разрешённые Promise.',
          'Храните remaining и записывайте результат по исходному индексу; разрешите [] отдельно, а reject передавайте напрямую каждому элементу.',
        ],
        solution: {
          blocks: [
            {
              label: 'Реализация и проверки',
              language: 'ts',
              code: `export function promiseAll<T>(\n  values: Iterable<T | PromiseLike<T>>,\n): Promise<T[]> {\n  return new Promise<T[]>((resolve, reject) => {\n    const results: T[] = [];\n    let remaining = 0;\n    let index = 0;\n\n    try {\n      for (const value of values) {\n        const current = index++;\n        remaining += 1;\n        Promise.resolve(value).then((result) => {\n          results[current] = result;\n          remaining -= 1;\n          if (remaining === 0) resolve(results);\n        }, reject);\n      }\n    } catch (error: unknown) {\n      reject(error);\n      return;\n    }\n\n    if (index === 0) resolve([]);\n  });\n}\n\nconst delayed = new Promise<number>((resolve) => setTimeout(() => resolve(1), 5));\nconst result = await promiseAll([delayed, Promise.resolve(2), 3]);\nconsole.assert(result.join(',') === '1,2,3');\nconsole.assert((await promiseAll<number>([])).length === 0);`,
            },
          ],
          alternative: [
            'Можно сначала выполнить Array.from(values), а затем создать results нужной длины; это проще, но требует дополнительного массива входных значений.',
            'В прикладном коде предпочтителен встроенный Promise.all: он стандартизован, оптимизирован движком и сохраняет tuple-типы точнее простой generic-сигнатуры.',
          ],
        },
        explanation: [
          'Индекс фиксируется при обходе, поэтому результаты записываются в исходные позиции, даже если Promise завершаются в обратном порядке. remaining отделяет число завершений от длины разреженного массива.',
          'Promise.resolve безопасно принимает значения, Promise и thenable. reject делает итог fail-fast, но JavaScript Promise не предоставляет автоматической отмены уже начатой работы.',
        ],
        edgeCases: [
          'Пустой iterable должен разрешиться асинхронно уже выполненным Promise со значением [].',
          'Getter then у thenable или метод iterator может бросить синхронно; итоговый Promise должен быть отклонён.',
          'Повторные resolve/reject вредоносного thenable игнорируются благодаря механизму разрешения Promise.',
          'После первого reject остальные операции продолжаются и могут иметь побочные эффекты.',
        ],
        complexity: [
          'Время O(n) плюс время ожидания самой долгой операции.',
          'Память O(n) для результатов и обработчиков.',
        ],
        followUps: [
          'Как сохранить tuple-типы как у стандартного Promise.all?',
          'Как добавить AbortSignal и кооперативную отмену?',
          'Чем отличаются allSettled, race и any?',
        ],
        production: [
          'Предпочитайте встроенный Promise.all; для сетевых задач проектируйте явную отмену через AbortController и не считайте fail-fast физической остановкой остальных запросов.',
        ],
        furtherReading: [
          {
            label: 'MDN: Promise.all',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all',
          },
        ],
      },
      en: {
        title: 'Implement Promise.all',
        description:
          'Implement a type-safe Promise.all analogue with stable ordering and fail-fast behavior.',
        problem:
          'Write promiseAll so it accepts an iterable of values, promises, and thenables, starts observing them concurrently, and returns results in input order. Empty input must fulfill with an empty array, while the first rejection must immediately reject the aggregate promise without pretending to cancel operations already in progress.',
        examples: [
          "await promiseAll([Promise.resolve(1), 2, Promise.resolve('x')]) returns [1, 2, 'x'].",
          'promiseAll([]) fulfills with []; any rejected item rejects the aggregate with the same reason.',
        ],
        requirements: [
          'Accept any Iterable and assimilate thenables through Promise.resolve.',
          'Preserve input order regardless of settlement order.',
          'Handle empty input, synchronous iterator failures, and the first rejection correctly.',
        ],
        starterCode: {
          label: 'Signature',
          language: 'ts',
          code: 'function promiseAll<T>(values: Iterable<T | PromiseLike<T>>): Promise<T[]> {\n  // TODO\n}',
        },
        hints: [
          'Iterate synchronously and assign every value an index first; a generic iterable does not expose its length in advance.',
          'Wrap every item with Promise.resolve so ordinary values fulfill immediately and compliant thenables are assimilated safely.',
          'Track remaining items and write by original index; resolve empty input explicitly and pass reject as every item’s rejection handler.',
        ],
        solution: {
          blocks: [
            {
              label: 'Implementation and checks',
              language: 'ts',
              code: `export function promiseAll<T>(\n  values: Iterable<T | PromiseLike<T>>,\n): Promise<T[]> {\n  return new Promise<T[]>((resolve, reject) => {\n    const results: T[] = [];\n    let remaining = 0;\n    let index = 0;\n\n    try {\n      for (const value of values) {\n        const current = index++;\n        remaining += 1;\n        Promise.resolve(value).then((result) => {\n          results[current] = result;\n          remaining -= 1;\n          if (remaining === 0) resolve(results);\n        }, reject);\n      }\n    } catch (error: unknown) {\n      reject(error);\n      return;\n    }\n\n    if (index === 0) resolve([]);\n  });\n}\n\nconst delayed = new Promise<number>((resolve) => setTimeout(() => resolve(1), 5));\nconst result = await promiseAll([delayed, Promise.resolve(2), 3]);\nconsole.assert(result.join(',') === '1,2,3');\nconsole.assert((await promiseAll<number>([])).length === 0);`,
            },
          ],
          alternative: [
            'Convert with Array.from first and preallocate results; this is simpler but retains an extra input array.',
            'Prefer native Promise.all in application code because engines optimize it and its overloads preserve tuple types more precisely.',
          ],
        },
        explanation: [
          'The index is captured during iteration, so values occupy their input positions even when promises settle in reverse order. remaining tracks completion independently of sparse array length.',
          'Promise.resolve safely handles values, promises, and thenables. Rejecting is fail-fast at the aggregate level, but JavaScript promises do not automatically cancel work already started.',
        ],
        edgeCases: [
          'An empty iterable must produce a fulfilled promise containing [].',
          'A throwing iterator or then getter must reject the aggregate promise.',
          'Multiple settlements from a hostile thenable are ignored by promise resolution.',
          'Other operations and their side effects continue after the aggregate rejects.',
        ],
        complexity: [
          'O(n) setup plus the duration of the slowest operation.',
          'O(n) space for results and handlers.',
        ],
        followUps: [
          'How would you preserve tuple types like native Promise.all?',
          'How would you add AbortSignal-based cooperative cancellation?',
          'How do allSettled, race, and any differ?',
        ],
        production: [
          'Use native Promise.all; for network operations, design cancellation explicitly with AbortController and never equate fail-fast rejection with physical cancellation.',
        ],
        furtherReading: [
          {
            label: 'MDN: Promise.all',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all',
          },
        ],
      },
    },
  },
  {
    id: '03',
    slug: 'concurrency-limiter',
    category: 'javascript',
    difficulty: 'hard',
    estimatedMinutes: 50,
    tags: ['JavaScript', 'Concurrency', 'Promises', 'Scheduling'],
    runtime: 'universal',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Ограничитель конкурентности',
        description:
          'Запускайте асинхронные фабрики с заданным пределом параллелизма и стабильным порядком результатов.',
        problem:
          'Реализуйте runWithLimit для массива ленивых фабрик Promise и положительного целого limit. Одновременно должно выполняться не больше limit задач; результаты сохраняют исходный порядок. Ошибка одной задачи отклоняет итоговый Promise, новые задачи после наблюдаемой ошибки не запускаются, а уже начатые безопасно завершаются без необработанных отклонений.',
        examples: [
          'При limit = 2 первые две фабрики запускаются сразу, третья — только после завершения одной из них.',
          'Для задержек [30, 5, 10] результат всё равно соответствует индексам входа, а не порядку завершения.',
        ],
        requirements: [
          'Проверяйте, что limit — положительное целое число.',
          'Не запускайте фабрики заранее и никогда не превышайте установленный предел.',
          'Обработайте синхронный throw фабрики и асинхронный reject без unhandled rejection.',
        ],
        starterCode: {
          label: 'Сигнатура',
          language: 'ts',
          code: 'type Task<T> = () => PromiseLike<T> | T;\n\nfunction runWithLimit<T>(tasks: readonly Task<T>[], limit: number): Promise<T[]> {\n  // TODO\n}',
        },
        hints: [
          'Храните nextIndex и active; единый pump запускает задачи, пока есть свободные слоты и работа не остановлена.',
          'Вызывайте фабрику внутри Promise.resolve().then(task): так синхронный throw становится отклонением в той же цепочке.',
          'В finally освобождайте слот; при успехе запускайте pump снова, а при первой ошибке выставляйте stopped до reject.',
        ],
        solution: {
          blocks: [
            {
              label: 'Fail-fast планировщик',
              language: 'ts',
              code: `type Task<T> = () => PromiseLike<T> | T;\n\nexport function runWithLimit<T>(\n  tasks: readonly Task<T>[],\n  limit: number,\n): Promise<T[]> {\n  if (!Number.isInteger(limit) || limit < 1) {\n    return Promise.reject(new RangeError('limit must be a positive integer'));\n  }\n  if (tasks.length === 0) return Promise.resolve([]);\n\n  return new Promise<T[]>((resolve, reject) => {\n    const results: T[] = new Array<T>(tasks.length);\n    let nextIndex = 0;\n    let active = 0;\n    let completed = 0;\n    let stopped = false;\n\n    const pump = (): void => {\n      while (!stopped && active < limit && nextIndex < tasks.length) {\n        const index = nextIndex++;\n        const task = tasks[index];\n        active += 1;\n        Promise.resolve().then(task).then((value) => {\n          results[index] = value;\n          completed += 1;\n          if (completed === tasks.length) resolve(results);\n        }, (error: unknown) => {\n          if (!stopped) { stopped = true; reject(error); }\n        }).finally(() => {\n          active -= 1;\n          if (!stopped) pump();\n        });\n      }\n    };\n\n    pump();\n  });\n}\n\nlet active = 0;\nlet peak = 0;\nconst makeTask = (value: number): Task<number> => async () => {\n  active += 1; peak = Math.max(peak, active);\n  await Promise.resolve();\n  active -= 1; return value;\n};\nconst values = await runWithLimit([makeTask(1), makeTask(2), makeTask(3)], 2);\nconsole.assert(values.join(',') === '1,2,3' && peak === 2);`,
            },
          ],
          alternative: [
            'Пул из limit worker-функций, забирающих следующий индекс, короче и естественно ограничивает параллелизм.',
            'Для потокового или бесконечного источника нужен async iterable и backpressure вместо массива всех задач.',
          ],
        },
        explanation: [
          'Фабрики ленивые: планировщик вызывает их только при свободном слоте. Индекс назначается до запуска, поэтому порядок результата стабилен.',
          'Promise.resolve().then(task) нормализует обычное значение, Promise и синхронное исключение. stopped предотвращает старт новой работы после первой ошибки; у начатых цепочек уже установлены reject-обработчики.',
        ],
        edgeCases: [
          'limit больше числа задач эквивалентен запуску всех задач.',
          'Пустой массив разрешается немедленно пустым массивом.',
          'NaN, Infinity, дробное число, ноль и отрицательное значение отклоняются.',
          'Зависшая задача навсегда занимает слот; для production нужен timeout или AbortSignal.',
        ],
        complexity: [
          'Планирование занимает O(n), полное время зависит от длительности задач и limit.',
          'Память O(n + limit) для результатов и активных цепочек.',
        ],
        followUps: [
          'Как добавить индивидуальные timeout и AbortSignal?',
          'Как обеспечить fairness для задач разных приоритетов?',
          'Как вернуть allSettled-результаты вместо fail-fast?',
          'Как поддержать async iterable с backpressure?',
        ],
        production: [
          'Добавьте наблюдаемость очереди, таймауты, кооперативную отмену и политику повторов с jitter; ограничивайте также внешние ресурсы, например соединения и rate limits.',
        ],
        furtherReading: [
          {
            label: 'MDN: Promise concurrency',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
          },
        ],
      },
      en: {
        title: 'Concurrency Limiter',
        description:
          'Run asynchronous factories under a concurrency cap while preserving result order.',
        problem:
          'Implement runWithLimit for an array of lazy promise factories and a positive integer limit. No more than limit tasks may run simultaneously, and results must preserve input order. One failure rejects the aggregate, prevents not-yet-started tasks from launching, and still observes already-running tasks so they cannot cause unhandled rejections.',
        examples: [
          'With limit = 2, the first two factories start immediately and the third starts only after a slot is released.',
          'For delays [30, 5, 10], output still follows input indices rather than completion order.',
        ],
        requirements: [
          'Validate that limit is a positive integer.',
          'Keep factories lazy and never exceed the configured cap.',
          'Handle synchronous factory throws and asynchronous rejection without unhandled rejections.',
        ],
        starterCode: {
          label: 'Signature',
          language: 'ts',
          code: 'type Task<T> = () => PromiseLike<T> | T;\n\nfunction runWithLimit<T>(tasks: readonly Task<T>[], limit: number): Promise<T[]> {\n  // TODO\n}',
        },
        hints: [
          'Track nextIndex and active; one pump function starts work while slots remain and the scheduler has not stopped.',
          'Invoke each factory through Promise.resolve().then(task), turning a synchronous throw into rejection of the same observed chain.',
          'Release the slot in finally; pump again on success, but set stopped before rejecting on the first failure.',
        ],
        solution: {
          blocks: [
            {
              label: 'Fail-fast scheduler',
              language: 'ts',
              code: `type Task<T> = () => PromiseLike<T> | T;\n\nexport function runWithLimit<T>(\n  tasks: readonly Task<T>[],\n  limit: number,\n): Promise<T[]> {\n  if (!Number.isInteger(limit) || limit < 1) {\n    return Promise.reject(new RangeError('limit must be a positive integer'));\n  }\n  if (tasks.length === 0) return Promise.resolve([]);\n\n  return new Promise<T[]>((resolve, reject) => {\n    const results: T[] = new Array<T>(tasks.length);\n    let nextIndex = 0;\n    let active = 0;\n    let completed = 0;\n    let stopped = false;\n\n    const pump = (): void => {\n      while (!stopped && active < limit && nextIndex < tasks.length) {\n        const index = nextIndex++;\n        const task = tasks[index];\n        active += 1;\n        Promise.resolve().then(task).then((value) => {\n          results[index] = value;\n          completed += 1;\n          if (completed === tasks.length) resolve(results);\n        }, (error: unknown) => {\n          if (!stopped) { stopped = true; reject(error); }\n        }).finally(() => {\n          active -= 1;\n          if (!stopped) pump();\n        });\n      }\n    };\n\n    pump();\n  });\n}\n\nlet active = 0;\nlet peak = 0;\nconst makeTask = (value: number): Task<number> => async () => {\n  active += 1; peak = Math.max(peak, active);\n  await Promise.resolve();\n  active -= 1; return value;\n};\nconst values = await runWithLimit([makeTask(1), makeTask(2), makeTask(3)], 2);\nconsole.assert(values.join(',') === '1,2,3' && peak === 2);`,
            },
          ],
          alternative: [
            'A pool of limit worker functions consuming the next index is shorter and naturally caps concurrency.',
            'A streaming or infinite source needs an async iterable with backpressure instead of retaining every task.',
          ],
        },
        explanation: [
          'Factories remain lazy and are called only when a slot exists. Capturing the index before launch keeps result ordering stable.',
          'Promise.resolve().then(task) normalizes values, promises, and synchronous exceptions. stopped blocks new launches after the first failure, while every running chain already has a rejection handler.',
        ],
        edgeCases: [
          'A limit larger than task count effectively starts all tasks.',
          'An empty task list fulfills with an empty array.',
          'NaN, Infinity, fractions, zero, and negative limits are rejected.',
          'A never-settling task holds a slot forever; production code needs a timeout or AbortSignal.',
        ],
        complexity: [
          'Scheduling is O(n); elapsed time depends on task durations and limit.',
          'Space is O(n + limit) for results and active chains.',
        ],
        followUps: [
          'How would you add per-task timeout and AbortSignal support?',
          'How would you provide fairness among priorities?',
          'How would you return allSettled-style results?',
          'How would you consume an async iterable with backpressure?',
        ],
        production: [
          'Add queue telemetry, timeouts, cooperative cancellation, and a retry policy with jitter; account for external constraints such as connection pools and rate limits.',
        ],
        furtherReading: [
          {
            label: 'MDN: Promise',
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
          },
        ],
      },
    },
  },
  {
    id: '04',
    slug: 'production-ready-debounce',
    category: 'javascript',
    difficulty: 'senior',
    estimatedMinutes: 60,
    tags: ['JavaScript', 'Debounce', 'Timers', 'API Design'],
    runtime: 'universal',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Production-ready Debounce',
        description:
          'Спроектируйте debounce с trailing-вызовом, cancel, flush и сохранением this и аргументов.',
        problem:
          'Реализуйте debounce для синхронной функции: по умолчанию функция вызывается по trailing edge после wait миллисекунд тишины, с последними аргументами и контекстом this. Обёртка должна предоставлять cancel и flush, возвращать последний вычисленный результат и корректно очищать ссылки после вызова, не используя any, eval или new Function.',
        examples: [
          'Три вызова за интервал wait приводят к одному вызову с аргументами третьего.',
          'flush немедленно выполняет ожидающий trailing-вызов; cancel удаляет его без вызова функции.',
        ],
        requirements: [
          'Сохраните типы параметров, результата и this исходной функции без any.',
          'Реализуйте trailing-вызов, cancel и flush с идемпотентной очисткой таймера.',
          'После выполнения освобождайте сохранённые аргументы и контекст, чтобы не удерживать объекты.',
        ],
        starterCode: {
          label: 'Контракт',
          language: 'ts',
          code: `type Debounced<F extends (this: unknown, ...args: never[]) => unknown> = {\n  (this: ThisParameterType<F>, ...args: Parameters<F>): ReturnType<F> | undefined;\n  cancel(): void;\n  flush(): ReturnType<F> | undefined;\n};`,
        },
        hints: [
          'На каждом вызове сохраняйте последние args и this, отменяйте предыдущий таймер и создавайте новый; result хранит последнее возвращённое значение.',
          'Вынесите invoke и clear в отдельные функции: invoke копирует ссылки локально, очищает состояние и вызывает fn.apply с сохранённым контекстом.',
          'flush должен сначала отменить активный таймер и вызвать invoke только при наличии ожидающих аргументов; cancel очищает всё без invoke.',
        ],
        solution: {
          blocks: [
            {
              label: 'Типобезопасная реализация',
              language: 'ts',
              code: `type Callable = (this: unknown, ...args: never[]) => unknown;\ntype Debounced<F extends Callable> = {\n  (this: ThisParameterType<F>, ...args: Parameters<F>): ReturnType<F> | undefined;\n  cancel(): void;\n  flush(): ReturnType<F> | undefined;\n};\n\nexport function debounce<F extends Callable>(fn: F, wait: number): Debounced<F> {\n  if (!Number.isFinite(wait) || wait < 0) throw new RangeError('wait must be finite and non-negative');\n\n  let timer: ReturnType<typeof setTimeout> | undefined;\n  let args: Parameters<F> | undefined;\n  let receiver: ThisParameterType<F> | undefined;\n  let result: ReturnType<F> | undefined;\n\n  const invoke = (): ReturnType<F> | undefined => {\n    if (!args) return result;\n    const callArgs = args;\n    const callReceiver = receiver;\n    args = undefined;\n    receiver = undefined;\n    result = fn.apply(callReceiver, callArgs) as ReturnType<F>;\n    return result;\n  };\n\n  const debounced = function (this: ThisParameterType<F>, ...nextArgs: Parameters<F>) {\n    args = nextArgs;\n    receiver = this;\n    if (timer !== undefined) clearTimeout(timer);\n    timer = setTimeout(() => { timer = undefined; invoke(); }, wait);\n    return result;\n  } as Debounced<F>;\n\n  debounced.cancel = (): void => {\n    if (timer !== undefined) clearTimeout(timer);\n    timer = undefined; args = undefined; receiver = undefined;\n  };\n  debounced.flush = (): ReturnType<F> | undefined => {\n    if (timer === undefined) return result;\n    clearTimeout(timer); timer = undefined;\n    return invoke();\n  };\n  return debounced;\n}\n\nconst calls: string[] = [];\nconst save = debounce((value: string) => { calls.push(value); return value.length; }, 20);\nsave('old'); save('new');\nconsole.assert(save.flush() === 3 && calls.join(',') === 'new');\nsave('cancelled'); save.cancel();`,
            },
          ],
          alternative: [
            'В UI можно использовать специализированный hook, который отменяет таймер при unmount и не пересоздаёт wrapper на каждом render.',
            'Для maxWait храните время первого вызова в серии и назначайте задержку как минимум из wait и оставшегося maxWait.',
          ],
        },
        explanation: [
          'Каждый вызов заменяет ожидающие данные последними и перезапускает таймер. fn.apply сохраняет динамический this, а Parameters/ReturnType обеспечивают связь типов с исходной функцией.',
          'Очистка ссылок важна не только для корректности cancel: замыкание иначе удерживает последний DOM-узел или крупный объект до следующего вызова либо уничтожения wrapper.',
        ],
        edgeCases: [
          'wait = 0 всё равно откладывает вызов в задачу таймера.',
          'flush без ожидающего вызова возвращает последний результат и ничего не вызывает.',
          'Исключение fn синхронно выходит из flush или timer callback; внутреннее состояние уже очищено.',
          'Debounce асинхронной функции возвращает последний Promise, а не Promise текущего отложенного вызова — такой API лучше проектировать отдельно.',
        ],
        complexity: [
          'Каждый вызов, cancel и flush работают за O(1).',
          'Дополнительная память O(1), не считая последних аргументов.',
        ],
        followUps: [
          'Как добавить leading и maxWait без двойного вызова?',
          'Как тестировать реализацию fake timers?',
          'Как должен выглядеть debounce для Promise с отдельным результатом каждого caller?',
          'Как интегрировать AbortSignal?',
        ],
        production: [
          'Отменяйте debounce при размонтировании компонента, используйте monotonic clock для maxWait и документируйте семантику результата, ошибок, leading/trailing и повторного входа.',
        ],
        furtherReading: [
          {
            label: 'MDN: setTimeout',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout',
          },
        ],
      },
      en: {
        title: 'Production-ready Debounce',
        description:
          'Design trailing debounce with cancel, flush, and correct preservation of this and arguments.',
        problem:
          'Implement debounce for a synchronous function. By default it invokes on the trailing edge after wait milliseconds of silence, using the latest arguments and dynamic this value. The wrapper must expose cancel and flush, return the most recently computed result, and release captured references after invocation without any, eval, or new Function.',
        examples: [
          'Three calls within wait produce one invocation with the third call’s arguments.',
          'flush immediately performs a pending trailing invocation; cancel removes it without invoking the function.',
        ],
        requirements: [
          'Preserve parameter, result, and this types without any.',
          'Implement trailing invocation, cancel, and flush with idempotent timer cleanup.',
          'Release retained arguments and receiver after execution to avoid retaining objects.',
        ],
        starterCode: {
          label: 'Contract',
          language: 'ts',
          code: `type Debounced<F extends (this: unknown, ...args: never[]) => unknown> = {\n  (this: ThisParameterType<F>, ...args: Parameters<F>): ReturnType<F> | undefined;\n  cancel(): void;\n  flush(): ReturnType<F> | undefined;\n};`,
        },
        hints: [
          'On every call, store the latest arguments and receiver, clear the previous timer, and schedule another one; result stores the latest computed return value.',
          'Extract invoke and cleanup behavior: invoke copies retained references locally, clears state, and calls fn.apply with the captured receiver.',
          'flush first clears an active timer and invokes only when arguments are pending; cancel clears every retained value without invoking.',
        ],
        solution: {
          blocks: [
            {
              label: 'Type-safe implementation',
              language: 'ts',
              code: `type Callable = (this: unknown, ...args: never[]) => unknown;\ntype Debounced<F extends Callable> = {\n  (this: ThisParameterType<F>, ...args: Parameters<F>): ReturnType<F> | undefined;\n  cancel(): void;\n  flush(): ReturnType<F> | undefined;\n};\n\nexport function debounce<F extends Callable>(fn: F, wait: number): Debounced<F> {\n  if (!Number.isFinite(wait) || wait < 0) throw new RangeError('wait must be finite and non-negative');\n\n  let timer: ReturnType<typeof setTimeout> | undefined;\n  let args: Parameters<F> | undefined;\n  let receiver: ThisParameterType<F> | undefined;\n  let result: ReturnType<F> | undefined;\n\n  const invoke = (): ReturnType<F> | undefined => {\n    if (!args) return result;\n    const callArgs = args;\n    const callReceiver = receiver;\n    args = undefined;\n    receiver = undefined;\n    result = fn.apply(callReceiver, callArgs) as ReturnType<F>;\n    return result;\n  };\n\n  const debounced = function (this: ThisParameterType<F>, ...nextArgs: Parameters<F>) {\n    args = nextArgs;\n    receiver = this;\n    if (timer !== undefined) clearTimeout(timer);\n    timer = setTimeout(() => { timer = undefined; invoke(); }, wait);\n    return result;\n  } as Debounced<F>;\n\n  debounced.cancel = (): void => {\n    if (timer !== undefined) clearTimeout(timer);\n    timer = undefined; args = undefined; receiver = undefined;\n  };\n  debounced.flush = (): ReturnType<F> | undefined => {\n    if (timer === undefined) return result;\n    clearTimeout(timer); timer = undefined;\n    return invoke();\n  };\n  return debounced;\n}\n\nconst calls: string[] = [];\nconst save = debounce((value: string) => { calls.push(value); return value.length; }, 20);\nsave('old'); save('new');\nconsole.assert(save.flush() === 3 && calls.join(',') === 'new');\nsave('cancelled'); save.cancel();`,
            },
          ],
          alternative: [
            'In a UI, use a dedicated hook that cancels on unmount and does not recreate the wrapper on every render.',
            'For maxWait, retain the first call time in a burst and schedule the smaller of wait and the remaining maxWait.',
          ],
        },
        explanation: [
          'Every call replaces pending data and restarts the timer. fn.apply preserves dynamic this, while Parameters and ReturnType connect wrapper types to the source function.',
          'Releasing references is not merely cancel correctness: otherwise the closure can retain a DOM node or large object until another call or wrapper disposal.',
        ],
        edgeCases: [
          'wait = 0 still defers invocation to a timer task.',
          'flush with no pending call returns the latest result without invoking.',
          'A synchronous fn exception escapes flush or the timer callback after internal state is cleaned.',
          'Debouncing an async function returns the latest Promise, not a per-caller promise for the pending invocation; that API should be designed separately.',
        ],
        complexity: [
          'Each call, cancel, and flush is O(1).',
          'Additional space is O(1), excluding the latest arguments.',
        ],
        followUps: [
          'How would you add leading and maxWait without double invocation?',
          'How would you test this with fake timers?',
          'What should per-caller promise debounce semantics be?',
          'How would AbortSignal integrate?',
        ],
        production: [
          'Cancel on component unmount, use a monotonic clock for maxWait, and document result, error, leading/trailing, and reentrancy semantics explicitly.',
        ],
        furtherReading: [
          {
            label: 'MDN: setTimeout',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout',
          },
        ],
      },
    },
  },
  {
    id: '05',
    slug: 'autocomplete-race-conditions',
    category: 'javascript',
    difficulty: 'senior',
    estimatedMinutes: 55,
    tags: ['React', 'Race Conditions', 'AbortController', 'Autocomplete'],
    runtime: 'react',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Гонки запросов в autocomplete',
        description:
          'Защитите React autocomplete от устаревших ответов, лишних запросов и обновлений после unmount.',
        problem:
          'Исправьте autocomplete: пользователь быстро вводит запросы, а ответы сети приходят в произвольном порядке, поэтому старый ответ может перезаписать новый. Решение должно отменять предыдущий fetch, игнорировать устаревший результат даже если транспорт не успел отмениться, очищать состояние для пустого ввода и не показывать AbortError как пользовательскую ошибку.',
        examples: [
          'Запрос cat стартует после ca; если ca завершится последним, список всё равно содержит результаты cat.',
          'При очистке поля текущий запрос отменяется, список становится пустым, loading сбрасывается.',
        ],
        requirements: [
          'Используйте AbortController и отменяйте запрос в cleanup эффекта.',
          'Добавьте монотонный request id как логическую защиту от поздних ответов.',
          'Различайте abort и реальную ошибку; обновляйте loading только для актуального запроса.',
          'Не выполняйте запрос для строки, пустой после trim.',
        ],
        starterCode: {
          label: 'Компонент с гонкой',
          language: 'tsx',
          code: `function Search() {\n  const [query, setQuery] = useState('');\n  const [items, setItems] = useState<string[]>([]);\n  useEffect(() => {\n    fetch('/api/search?q=' + encodeURIComponent(query))\n      .then((response) => response.json())\n      .then(setItems);\n  }, [query]);\n  return null;\n}`,
        },
        hints: [
          'Effect должен создавать собственный AbortController и возвращать cleanup, который вызывает abort; пустой query обрабатывайте до fetch.',
          'Счётчик в useRef переживает рендеры: увеличивайте его для каждого эффекта и сравнивайте локальный id перед каждым setState.',
          'В catch проверьте signal.aborted вместо ненадёжной зависимости от текста ошибки; в finally сбрасывайте loading только у последнего запроса.',
        ],
        solution: {
          blocks: [
            {
              label: 'React hook с двойной защитой',
              language: 'tsx',
              code: `import { useEffect, useRef, useState } from 'react';\n\ntype SearchState = {\n  items: string[];\n  loading: boolean;\n  error: string | null;\n};\n\nexport function useAutocomplete(query: string): SearchState {\n  const [state, setState] = useState<SearchState>({ items: [], loading: false, error: null });\n  const latestRequest = useRef(0);\n\n  useEffect(() => {\n    const requestId = ++latestRequest.current;\n    const controller = new AbortController();\n    const normalized = query.trim();\n\n    if (!normalized) {\n      setState({ items: [], loading: false, error: null });\n      return () => controller.abort();\n    }\n\n    setState((previous) => ({ ...previous, loading: true, error: null }));\n\n    const load = async (): Promise<void> => {\n      try {\n        const response = await fetch('/api/search?q=' + encodeURIComponent(normalized), { signal: controller.signal });\n        if (!response.ok) throw new Error('Search failed: ' + response.status);\n        const payload: unknown = await response.json();\n        if (!Array.isArray(payload) || !payload.every((item) => typeof item === 'string')) {\n          throw new TypeError('Invalid search response');\n        }\n        if (requestId === latestRequest.current && !controller.signal.aborted) {\n          setState({ items: payload, loading: false, error: null });\n        }\n      } catch (error: unknown) {\n        if (controller.signal.aborted || requestId !== latestRequest.current) return;\n        setState({ items: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' });\n      } finally {\n        if (requestId === latestRequest.current && !controller.signal.aborted) {\n          setState((previous) => ({ ...previous, loading: false }));\n        }\n      }\n    };\n\n    void load();\n    return () => controller.abort();\n  }, [query]);\n\n  return state;\n}`,
            },
            {
              label: 'Проверяемый сценарий',
              language: 'tsx',
              code: `// Интеграционный тест должен управлять двумя deferred fetch:\n// 1. renderHook с query='ca'; затем rerender с query='cat'.\n// 2. Проверить, что signal первого вызова aborted === true.\n// 3. Разрешить 'cat' как ['cat'], затем поздно разрешить 'ca' как ['car'].\n// 4. Ожидать итоговые items === ['cat'] и отсутствие ошибки.`,
            },
          ],
          alternative: [
            'Библиотеки запросов вроде TanStack Query помогают с cache, deduplication и отменой, но ключ запроса и защита UI от устаревших данных всё равно должны быть корректны.',
            'На уровне reducer можно хранить requestId в событиях started/succeeded/failed и игнорировать события неактуальной операции.',
          ],
        },
        explanation: [
          'AbortController экономит сеть и работу сервера, когда отмена поддерживается, но abort — оптимизация, а не единственная гарантия: ответ мог уже перейти к следующему шагу цепочки. requestId обеспечивает корректность состояния.',
          'Cleanup React эффекта вызывается перед следующим эффектом и при unmount. Проверка id перед каждым обновлением предотвращает stale writes; в development Strict Mode решение остаётся корректным при дополнительном цикле setup/cleanup.',
        ],
        edgeCases: [
          'Пустая или состоящая из пробелов строка должна отменить прошлый запрос и очистить результаты.',
          'Сервер может вернуть не-2xx или JSON неверной формы — оба случая требуют контролируемой ошибки.',
          'Abort может произойти после response, но до json; signal и requestId проверяются после await.',
          'IME/composition и очень быстрый ввод лучше сочетать с debounce, не заменяя им защиту от гонки.',
          'Одинаковые запросы могут требовать cache/deduplication, но не должны нарушать актуальность UI.',
        ],
        complexity: [
          'На изменение query создаётся O(1) управляющего состояния; разбор ответа O(n) по числу элементов.',
          'Память состояния O(n) для текущего списка; старые ответы не сохраняются.',
        ],
        followUps: [
          'Как добавить debounce без stale closure?',
          'Как кэшировать одинаковые запросы и задавать TTL?',
          'Как протестировать гонку через deferred promises и React Testing Library?',
          'Когда применять useDeferredValue или transition?',
          'Как обеспечить доступность combobox по WAI-ARIA?',
        ],
        production: [
          'Добавьте debounce, минимальную длину запроса, cache/deduplication, timeout, лимит результатов, метрики ошибок и доступный combobox; не логируйте чувствительный текст запросов без политики приватности.',
        ],
        furtherReading: [
          {
            label: 'React: Synchronizing with Effects',
            url: 'https://react.dev/learn/synchronizing-with-effects',
          },
          {
            label: 'MDN: AbortController',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
          },
          {
            label: 'WAI-ARIA Combobox Pattern',
            url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
          },
        ],
      },
      en: {
        title: 'Race Conditions in Autocomplete',
        description:
          'Protect React autocomplete from stale responses, unnecessary requests, and post-unmount updates.',
        problem:
          'Fix an autocomplete where users type quickly and network responses arrive out of order, allowing an older response to overwrite a newer one. The solution must abort the previous fetch, ignore stale results even if transport cancellation loses the race, clear state for empty input, and avoid presenting AbortError as a user-facing failure.',
        examples: [
          'A cat request starts after ca; even if ca settles last, the list still contains results for cat.',
          'Clearing the input aborts the active request, empties items, and resets loading.',
        ],
        requirements: [
          'Use AbortController and abort the request from effect cleanup.',
          'Add a monotonic request id as a logical guard against late responses.',
          'Distinguish cancellation from real failure and update loading only for the current request.',
          'Do not request a query that is empty after trimming.',
        ],
        starterCode: {
          label: 'Racy component',
          language: 'tsx',
          code: `function Search() {\n  const [query, setQuery] = useState('');\n  const [items, setItems] = useState<string[]>([]);\n  useEffect(() => {\n    fetch('/api/search?q=' + encodeURIComponent(query))\n      .then((response) => response.json())\n      .then(setItems);\n  }, [query]);\n  return null;\n}`,
        },
        hints: [
          'Each effect creates its own AbortController and returns cleanup that aborts it; handle an empty normalized query before calling fetch.',
          'A useRef counter survives renders: increment it for each effect and compare the captured id before every state update.',
          'In catch, inspect signal.aborted rather than relying on an error message; in finally, clear loading only when this is still the latest request.',
        ],
        solution: {
          blocks: [
            {
              label: 'React hook with both safeguards',
              language: 'tsx',
              code: `import { useEffect, useRef, useState } from 'react';\n\ntype SearchState = {\n  items: string[];\n  loading: boolean;\n  error: string | null;\n};\n\nexport function useAutocomplete(query: string): SearchState {\n  const [state, setState] = useState<SearchState>({ items: [], loading: false, error: null });\n  const latestRequest = useRef(0);\n\n  useEffect(() => {\n    const requestId = ++latestRequest.current;\n    const controller = new AbortController();\n    const normalized = query.trim();\n\n    if (!normalized) {\n      setState({ items: [], loading: false, error: null });\n      return () => controller.abort();\n    }\n\n    setState((previous) => ({ ...previous, loading: true, error: null }));\n\n    const load = async (): Promise<void> => {\n      try {\n        const response = await fetch('/api/search?q=' + encodeURIComponent(normalized), { signal: controller.signal });\n        if (!response.ok) throw new Error('Search failed: ' + response.status);\n        const payload: unknown = await response.json();\n        if (!Array.isArray(payload) || !payload.every((item) => typeof item === 'string')) {\n          throw new TypeError('Invalid search response');\n        }\n        if (requestId === latestRequest.current && !controller.signal.aborted) {\n          setState({ items: payload, loading: false, error: null });\n        }\n      } catch (error: unknown) {\n        if (controller.signal.aborted || requestId !== latestRequest.current) return;\n        setState({ items: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' });\n      } finally {\n        if (requestId === latestRequest.current && !controller.signal.aborted) {\n          setState((previous) => ({ ...previous, loading: false }));\n        }\n      }\n    };\n\n    void load();\n    return () => controller.abort();\n  }, [query]);\n\n  return state;\n}`,
            },
            {
              label: 'Verifiable scenario',
              language: 'tsx',
              code: `// An integration test controls two deferred fetch calls:\n// 1. renderHook with query='ca', then rerender with query='cat'.\n// 2. Assert that the first call's signal has aborted === true.\n// 3. Resolve 'cat' as ['cat'], then resolve stale 'ca' as ['car'].\n// 4. Expect final items to equal ['cat'] and error to remain null.`,
            },
          ],
          alternative: [
            'A query library such as TanStack Query helps with caching, deduplication, and cancellation, but query keys and stale UI protection must still be correct.',
            'A reducer can attach requestId to started/succeeded/failed events and ignore events from obsolete operations.',
          ],
        },
        explanation: [
          'AbortController can save network and server work when cancellation is supported, but abort is an optimization rather than the sole correctness guarantee: the response may already have advanced in the chain. The request id protects state.',
          'React runs effect cleanup before the next effect and on unmount. Checking the id before every write prevents stale updates; the design also remains correct through the additional setup/cleanup cycle in development Strict Mode.',
        ],
        edgeCases: [
          'Empty or whitespace-only input must abort prior work and clear results.',
          'Non-2xx responses and malformed JSON shapes both need controlled error handling.',
          'Abort can occur after response but before json completes, so guards follow awaited boundaries.',
          'IME composition and rapid input benefit from debounce, which does not replace race protection.',
          'Repeated identical queries may use caching and deduplication without compromising UI freshness.',
        ],
        complexity: [
          'Each query change creates O(1) control state; response validation is O(n) in item count.',
          'State uses O(n) memory for the current list and does not retain stale payloads.',
        ],
        followUps: [
          'How would you add debounce without a stale closure?',
          'How would you cache identical queries with a TTL?',
          'How would you test the race with deferred promises and React Testing Library?',
          'When would useDeferredValue or a transition help?',
          'How would you implement an accessible WAI-ARIA combobox?',
        ],
        production: [
          'Add debounce, minimum query length, cache/deduplication, timeout, result limits, error telemetry, and an accessible combobox; do not log sensitive query text without a privacy policy.',
        ],
        furtherReading: [
          {
            label: 'React: Synchronizing with Effects',
            url: 'https://react.dev/learn/synchronizing-with-effects',
          },
          {
            label: 'MDN: AbortController',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
          },
          {
            label: 'WAI-ARIA Combobox Pattern',
            url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
          },
        ],
      },
    },
  },
] as const;
