export const rawNotes = [
  {
    id: 'url-navigation',
    slug: 'what-happens-after-entering-a-url',
    category: 'browser-js',
    tags: ['Browser', 'DNS', 'HTTP', 'Rendering'],
    keywords: {
      ru: [
        'адресная строка',
        'навигация',
        'DNS',
        'TCP',
        'TLS',
        'QUIC',
        'HTTP',
        'DOM',
        'CSSOM',
        'рендеринг',
      ],
      en: [
        'address bar',
        'navigation',
        'DNS',
        'TCP',
        'TLS',
        'QUIC',
        'HTTP',
        'DOM',
        'CSSOM',
        'rendering',
      ],
    },
    reviewedAt: '2026-10-23',
    sources: [
      {
        title: 'MDN: How browsers load websites',
        url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_browsers_load_websites',
      },
      {
        title: 'MDN: Populating the page — how browsers work',
        url: 'https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work',
      },
      {
        title: 'WHATWG HTML: Navigating across documents',
        url: 'https://html.spec.whatwg.org/multipage/browsing-the-web.html#navigating-across-documents',
      },
    ],
    ru: {
      question: 'Что происходит после ввода URL в адресную строку браузера?',
      shortAnswer:
        'Сначала браузер интерпретирует ввод: это может быть URL, поисковый запрос или ключевое слово. Для навигации он проверяет политики и кэши, определяет адрес сервера через DNS, получает или переиспользует соединение (обычно TCP+TLS для HTTP/1.1–2 либо QUIC для HTTP/3) и отправляет HTTP-запрос. После ответа браузер потоково разбирает HTML, строит DOM и CSSOM, исполняет скрипты с учетом их атрибутов, формирует дерево рендеринга, выполняет layout, paint и compositing. Кэш, service worker, редиректы и уже открытые соединения могут пропустить или изменить многие шаги.',
      deepDive: [
        'Омнибокс не обязан считать строку URL: браузер применяет эвристики и настройки поисковой системы. Только после выбора навигации нормализуется адрес, проверяются HSTS/CSP и другие применимые политики, а также возможные обработчики протокола.',
        'Разрешение имени может использовать кэши браузера, ОС, локального резолвера и рекурсивного DNS. Полученный IP не гарантирует один физический сервер: дальше могут находиться CDN, балансировщик или anycast-маршрут.',
        'Новое HTTPS-соединение обычно требует транспортного и криптографического рукопожатия. HTTP/1.1 и HTTP/2 обычно работают поверх TCP+TLS, HTTP/3 — поверх QUIC. Но браузер может переиспользовать существующее соединение, а TLS-сессию — возобновить.',
        'Ответ может прийти из HTTP-кэша или через service worker; сервер также может вернуть редирект. При сетевом ответе браузер проверяет статус, заголовки, MIME-тип, кодирование, политики безопасности и постепенно передает байты парсеру.',
        'HTML-парсер строит DOM потоково и запускает предварительный сканер ресурсов. CSS создает CSSOM; обычный синхронный script способен остановить разбор HTML, defer выполняется после разбора в порядке документа, async — когда загрузится, без гарантии порядка между такими скриптами.',
        'Для отображения браузер сопоставляет DOM со стилями, вычисляет геометрию (layout), записывает команды рисования (paint), растрирует слои и композитит их. Это не строго одноразовый конвейер: изменения стилей, DOM, шрифтов или размеров могут повторно запустить части работы.',
      ],
      example: {
        label: 'Гипотетическая подсказка браузеру о критическом ресурсе',
        code: '<link rel="preload" href="/fonts/body.woff2" as="font" type="font/woff2" crossorigin>\n<script src="/app.js" defer></script>',
        language: 'html',
        explanation:
          'preload повышает приоритет заранее известного ресурса, но не применяет его сам; неверные или избыточные preload тратят полосу. defer позволяет продолжать разбор HTML и сохраняет порядок выполнения defer-скриптов.',
      },
      pitfalls: [
        'Описывать ввод в адресной строке как безусловный URL: браузер может запустить поиск.',
        'Предполагать, что DNS, TCP и TLS всегда выполняются заново: кэши и повторное использование соединений меняют путь.',
        'Считать DOMContentLoaded моментом полной отрисовки или загрузки всех ресурсов.',
        'Представлять layout, paint и compositing как одинаковый фиксированный процесс во всех браузерах.',
      ],
      followUps: [
        'Чем транспорт HTTP/2 отличается от HTTP/3?',
        'Когда preload помогает, а когда конкурирует с более важными ресурсами?',
        'Как async, defer и type="module" влияют на загрузку скриптов?',
        'Как Cache-Control, ETag и service worker меняют навигацию?',
      ],
    },
    en: {
      question: 'What happens after entering a URL in the browser address bar?',
      shortAnswer:
        'The browser first interprets the input: it may be a URL, a search query, or a keyword. For a navigation, it checks policies and caches, resolves the server through DNS, opens or reuses a connection—typically TCP plus TLS for HTTP/1.1–2 or QUIC for HTTP/3—and sends an HTTP request. It then incrementally parses HTML, builds the DOM and CSSOM, executes scripts according to their attributes, constructs rendering data, and performs layout, paint, and compositing. Caches, service workers, redirects, and existing connections can skip or alter many of these steps.',
      deepDive: [
        'The omnibox does not have to treat the input as a URL: browser heuristics and search settings decide. Once navigation is selected, the address is normalized and applicable policies such as HSTS and CSP, plus protocol handlers, may affect the path.',
        'Name resolution can consult browser, operating-system, local-resolver, and recursive-DNS caches. The resulting IP does not necessarily identify one physical server; a CDN, load balancer, or anycast route may sit behind it.',
        'A fresh HTTPS connection generally needs transport and cryptographic handshakes. HTTP/1.1 and HTTP/2 commonly use TCP plus TLS, while HTTP/3 uses QUIC. A browser may instead reuse a connection and resume a TLS session.',
        'A response may come from the HTTP cache or a service worker, and a server may redirect. For a network response, the browser processes status, headers, MIME type, content encoding, and security policies before progressively feeding bytes to parsers.',
        'The HTML parser incrementally creates the DOM while a preload scanner discovers resources. CSS produces the CSSOM; a classic synchronous script can pause parsing, defer scripts run after parsing in document order, and async scripts run when available without ordering among themselves.',
        'Rendering combines DOM and styles, calculates geometry in layout, records drawing operations in paint, rasterizes layers, and composites them. This is not a single immutable pipeline: DOM, style, font, or viewport changes can repeat selected stages.',
      ],
      example: {
        label: 'Hypothetical hints for critical resources',
        code: '<link rel="preload" href="/fonts/body.woff2" as="font" type="font/woff2" crossorigin>\n<script src="/app.js" defer></script>',
        language: 'html',
        explanation:
          'preload raises the priority of a known resource but does not apply it by itself; incorrect or excessive preloads waste bandwidth. defer lets HTML parsing continue and preserves execution order among deferred scripts.',
      },
      pitfalls: [
        'Describing address-bar input as unconditionally being a URL; it may initiate a search.',
        'Assuming DNS, TCP, and TLS always run from scratch; caches and connection reuse change the path.',
        'Treating DOMContentLoaded as the moment every resource is loaded or the page is fully painted.',
        'Presenting layout, paint, and compositing as an identical fixed pipeline in every browser.',
      ],
      followUps: [
        'How do the transports used by HTTP/2 and HTTP/3 differ?',
        'When does preload help, and when does it compete with more important resources?',
        'How do async, defer, and type="module" affect script loading?',
        'How do Cache-Control, ETag, and service workers alter navigation?',
      ],
    },
  },
  {
    id: 'mv-patterns',
    slug: 'mvc-mvp-mvvm',
    category: 'architecture',
    tags: ['Architecture', 'MVC', 'MVP', 'MVVM'],
    keywords: {
      ru: [
        'разделение ответственности',
        'модель',
        'представление',
        'контроллер',
        'презентер',
        'view model',
      ],
      en: ['separation of concerns', 'model', 'view', 'controller', 'presenter', 'view model'],
    },
    reviewedAt: '2026-10-23',
    sources: [
      {
        title: 'Martin Fowler: GUI Architectures',
        url: 'https://martinfowler.com/eaaDev/uiArchs.html',
      },
      {
        title: 'Microsoft: The Model-View-ViewModel Pattern',
        url: 'https://learn.microsoft.com/en-us/dotnet/architecture/maui/mvvm',
      },
      { title: 'Redux: Style Guide', url: 'https://redux.js.org/style-guide/' },
    ],
    ru: {
      question: 'Чем отличаются MVC, MVP, MVVM и семейство MV*?',
      shortAnswer:
        'Это семейство паттернов разделения UI, состояния и координации, а не взаимозаменяемые названия и не обязательные архитектуры для любого приложения. В MVC контроллер трактует ввод и инициирует изменения модели, а представление отображает ее; конкретные зависимости различаются по реализации. В MVP пассивное представление обычно делегирует поведение презентеру. В MVVM представление связывается с ориентированной на UI ViewModel через binding или реактивные механизмы. Выбор определяется платформой, тестируемостью, сложностью состояния и понятностью потока данных.',
      deepDive: [
        'Model хранит предметное состояние и правила; View отвечает за представление; третий участник координирует взаимодействие. Граница важнее названия: бизнес-правила не должны случайно растворяться в обработчиках UI.',
        'Классический MVC допускает, что View наблюдает Model, а Controller обрабатывает пользовательский ввод. В веб-фреймворках термин MVC часто означает серверное разделение request/controller/model/template и отличается от desktop MVC.',
        'В MVP View обычно реализует интерфейс и передает события Presenter. Presenter вызывает модель и явно обновляет View, поэтому его удобно тестировать через заглушку представления, но он может превратиться в крупный посредник.',
        'MVVM предоставляет ViewModel с состоянием и командами в форме, удобной View. Data binding снижает ручную синхронизацию, но двусторонние связи и неявные зависимости могут затруднить трассировку изменений.',
        'React-компоненты с MobX или Redux автоматически не становятся MVC. React описывает представление; store, hooks, сервисы и маршрутизация могут быть организованы разными способами. Redux чаще задает однонаправленный поток событий и явные переходы состояния, а не классическую роль Controller.',
        'Практичный выбор начинается с границ домена и владения состоянием. Небольшому экрану часто достаточно компонентов и извлеченных функций; введение полного паттерна оправдано, когда оно уменьшает связанность и делает изменения проверяемыми.',
      ],
      example: {
        label: 'Гипотетический пассивный View и Presenter',
        code: 'interface LoginView {\n  showError(message: string): void;\n  showWelcome(name: string): void;\n}\n\nclass LoginPresenter {\n  constructor(private view: LoginView, private authenticate: (name: string) => Promise<boolean>) {}\n\n  async submit(name: string) {\n    const ok = await this.authenticate(name);\n    if (ok) this.view.showWelcome(name);\n    else this.view.showError("Invalid credentials");\n  }\n}',
        language: 'typescript',
        explanation:
          'Presenter не знает DOM и тестируется через поддельный LoginView. В реальном коде обработка ошибок, отмена и безопасность аутентификации остаются отдельными задачами.',
      },
      pitfalls: [
        'Выбирать паттерн по знакомому названию, не фиксируя направления зависимостей.',
        'Называть любой store моделью, а любой обработчик контроллером.',
        'Создавать Presenter/ViewModel для тривиального локального состояния.',
        'Смешивать серверный MVC с клиентским UI-MVC без уточнения контекста.',
      ],
      followUps: [
        'По каким признакам выбирать MVP или MVVM?',
        'Как паттерн влияет на модульное тестирование?',
        'Где должно жить состояние формы и доменное состояние?',
        'Когда однонаправленный поток данных проще data binding?',
      ],
    },
    en: {
      question: 'How do MVC, MVP, MVVM, and the MV* family differ?',
      shortAnswer:
        'They are a family of patterns for separating UI, state, and coordination—not interchangeable labels or mandatory architectures for every application. In MVC, a controller interprets input and initiates model changes while a view renders it, although concrete dependencies vary. In MVP, a usually passive view delegates behavior to a presenter. In MVVM, the view binds to a UI-oriented ViewModel through binding or reactive mechanisms. The right choice depends on the platform, testability needs, state complexity, and clarity of data flow.',
      deepDive: [
        'The Model contains domain state and rules, the View presents information, and a third participant coordinates interaction. The boundary matters more than the label: business rules should not accidentally dissolve into UI event handlers.',
        'Classic MVC may let the View observe the Model while the Controller handles user input. Web frameworks often use MVC for server-side request/controller/model/template separation, which differs from desktop MVC.',
        'In MVP, the View commonly implements an interface and forwards events to the Presenter. The Presenter calls the model and explicitly updates the View, making it testable with a view stub but at risk of becoming an oversized mediator.',
        'MVVM exposes ViewModel state and commands shaped for the View. Data binding reduces manual synchronization, but two-way binding and implicit dependencies can make changes harder to trace.',
        'React components with MobX or Redux do not automatically form MVC. React describes views; stores, hooks, services, and routing can be arranged in several architectures. Redux more directly establishes unidirectional events and explicit state transitions than a classic Controller role.',
        'A pragmatic choice starts with domain boundaries and state ownership. A small screen may need only components and extracted functions; a full pattern pays off only when it reduces coupling and makes changes easier to verify.',
      ],
      example: {
        label: 'Hypothetical passive View and Presenter',
        code: 'interface LoginView {\n  showError(message: string): void;\n  showWelcome(name: string): void;\n}\n\nclass LoginPresenter {\n  constructor(private view: LoginView, private authenticate: (name: string) => Promise<boolean>) {}\n\n  async submit(name: string) {\n    const ok = await this.authenticate(name);\n    if (ok) this.view.showWelcome(name);\n    else this.view.showError("Invalid credentials");\n  }\n}',
        language: 'typescript',
        explanation:
          'The Presenter has no DOM dependency and can be tested with a fake LoginView. Error handling, cancellation, and authentication security remain separate concerns in production code.',
      },
      pitfalls: [
        'Selecting a pattern by a familiar name without defining dependency directions.',
        'Calling every store a Model and every handler a Controller.',
        'Creating a Presenter or ViewModel for trivial local state.',
        'Conflating server-side MVC with client-side UI MVC without naming the context.',
      ],
      followUps: [
        'What signals favor MVP or MVVM?',
        'How does the pattern affect unit testing?',
        'Who should own form state versus domain state?',
        'When is unidirectional data flow simpler than data binding?',
      ],
    },
  },
  {
    id: 'virtual-dom',
    slug: 'virtual-dom-relevant-today',
    category: 'react-state',
    tags: ['React', 'Virtual DOM', 'Reconciliation', 'Fiber'],
    keywords: {
      ru: ['виртуальный DOM', 'согласование', 'ключи', 'Fiber', 'компилятор'],
      en: ['virtual DOM', 'reconciliation', 'keys', 'Fiber', 'compiler'],
    },
    reviewedAt: '2026-10-23',
    sources: [
      { title: 'React: Render and Commit', url: 'https://react.dev/learn/render-and-commit' },
      {
        title: 'React: Preserving and Resetting State',
        url: 'https://react.dev/learn/preserving-and-resetting-state',
      },
      { title: 'React: React Compiler', url: 'https://react.dev/learn/react-compiler' },
    ],
    ru: {
      question: 'Актуален ли Virtual DOM сегодня?',
      shortAnswer:
        'Да, как один из способов декларативно описывать UI и вычислять минимально необходимые изменения платформы, но не как универсальная гарантия скорости. В React элементы — легковесные описания желаемого дерева; reconciliation сопоставляет предыдущий и новый результат по типу, позиции и key. Fiber организует эту работу и позволяет планировать render-фазу, после чего commit применяет изменения к DOM. Fine-grained реактивность и компилируемые подходы обновляют зависимости иначе; их преимущество зависит от нагрузки, модели программирования и качества реализации.',
      deepDive: [
        'Virtual DOM — разговорное название представления UI в памяти. Создание и сравнение объектов тоже стоит CPU и память; выгода состоит прежде всего в переносимой декларативной модели и пакетировании решений об обновлении.',
        'Reconciliation использует эвристики. Совпадающие типы компонентов и стабильные key помогают сохранить identity и локальное состояние; смена типа или key может намеренно сбросить поддерево.',
        'Render вычисляет следующий результат и должен оставаться чистым. Commit изменяет DOM и запускает связанные жизненные циклы и эффекты в определенных стадиях. Не каждое вычисление render приводит к commit.',
        'Virtual DOM не обязан быть быстрее точечных ручных DOM-операций. Ручной код может быть быстрее в узком случае, но сложнее поддерживает согласованность большого интерфейса и корректное пакетирование изменений.',
        'Fine-grained системы отслеживают конкретные читаемые реактивные значения и обновляют зависимые узлы. Компиляторы могут заранее выводить зависимости или мемоизацию. Это другие компромиссы: больше ограничений и анализа в обмен на меньшую работу во время выполнения.',
        'React Compiler оптимизирует мемоизацию совместимого кода, но не отменяет reconciliation, identity, keys или необходимость измерять реальные узкие места.',
      ],
      example: {
        label: 'Стабильный key сохраняет identity строки',
        code: 'function TodoList({ todos }: { todos: Array<{ id: string; title: string }> }) {\n  return <ul>{todos.map((todo) => <TodoRow key={todo.id} todo={todo} />)}</ul>;\n}',
        language: 'tsx',
        explanation:
          'Идентификатор данных остается связан с той же строкой при сортировке. Индекс массива как key мог бы привязать локальное состояние компонента к неверному элементу.',
      },
      pitfalls: [
        'Утверждать, что Virtual DOM всегда быстрее DOM.',
        'Считать key способом убрать предупреждение, а не частью identity.',
        'Путать построение React-дерева с немедленной записью в DOM.',
        'Объявлять Virtual DOM устаревшим только из-за появления компиляторов или signals.',
      ],
      followUps: [
        'Почему индекс массива часто плохой key?',
        'Как React сопоставляет элементы разных типов?',
        'Что именно оптимизирует React Compiler?',
        'Когда fine-grained реактивность уменьшает объем работы?',
      ],
    },
    en: {
      question: 'Is the Virtual DOM still relevant today?',
      shortAnswer:
        'Yes—as one way to describe UI declaratively and derive the necessary platform mutations, but not as a universal performance guarantee. In React, elements are lightweight descriptions of the desired tree; reconciliation matches previous and next output using type, position, and key. Fiber organizes and schedules render work, after which commit applies changes to the DOM. Fine-grained reactive and compiled approaches update dependencies differently; their benefits depend on workload, programming model, and implementation quality.',
      deepDive: [
        'Virtual DOM is an informal term for an in-memory UI representation. Allocating and comparing objects also costs CPU and memory; its main benefit is a portable declarative model and coordinated update decisions.',
        'Reconciliation relies on heuristics. Matching component types and stable keys help preserve identity and local state; changing a type or key can deliberately reset a subtree.',
        'Render calculates the next result and should stay pure. Commit mutates the DOM and runs relevant lifecycle work and effects in defined stages. A render calculation does not always lead to a commit.',
        'A Virtual DOM is not intrinsically faster than targeted manual DOM operations. Handwritten updates may win a narrow benchmark but make consistency and batching across a large UI harder to maintain.',
        'Fine-grained systems track individual reactive reads and update dependent nodes. Compilers can infer dependencies or memoization ahead of time. These are different tradeoffs: more constraints and analysis in exchange for less runtime work.',
        'React Compiler can optimize memoization of compatible code, but it does not remove reconciliation, identity, keys, or the need to measure actual bottlenecks.',
      ],
      example: {
        label: 'A stable key preserves row identity',
        code: 'function TodoList({ todos }: { todos: Array<{ id: string; title: string }> }) {\n  return <ul>{todos.map((todo) => <TodoRow key={todo.id} todo={todo} />)}</ul>;\n}',
        language: 'tsx',
        explanation:
          'The data identifier remains associated with the same row during sorting. An array index key could attach component-local state to the wrong item.',
      },
      pitfalls: [
        'Claiming the Virtual DOM is always faster than the DOM.',
        'Treating key as a warning suppressor rather than part of identity.',
        'Confusing construction of a React tree with immediate DOM writes.',
        'Calling the Virtual DOM obsolete merely because compilers or signals exist.',
      ],
      followUps: [
        'Why is an array index often a poor key?',
        'How does React match elements of different types?',
        'What does React Compiler optimize?',
        'When does fine-grained reactivity reduce work?',
      ],
    },
  },
  {
    id: 'browser-event-loop',
    slug: 'javascript-event-loop',
    category: 'browser-js',
    tags: ['JavaScript', 'Event Loop', 'Promises', 'Rendering'],
    keywords: {
      ru: ['цикл событий', 'задача', 'микрозадача', 'promise', 'таймер', 'отрисовка'],
      en: ['event loop', 'task', 'microtask', 'promise', 'timer', 'rendering'],
    },
    reviewedAt: '2026-10-23',
    sources: [
      {
        title: 'MDN: In depth — Microtasks and the JavaScript runtime environment',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth',
      },
      {
        title: 'WHATWG HTML: Event loops',
        url: 'https://html.spec.whatwg.org/multipage/webappapis.html#event-loops',
      },
      {
        title: 'MDN: Using microtasks in JavaScript with queueMicrotask()',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide',
      },
    ],
    ru: {
      question: 'Как работает JavaScript Event Loop в браузере?',
      shortAnswer:
        'Event loop координирует выполнение задач, микрозадач и обновление рендеринга в агенте браузера. Скрипт, событие или сработавший таймер выполняются как task до завершения стека. Затем браузер делает checkpoint микрозадач: Promise-обработчики и queueMicrotask выполняются до опустошения очереди, включая добавленные ими микрозадачи. После этого браузер может обновить rendering, если пришло подходящее время, и выбрать следующую задачу. Таймер задает минимальную задержку, а не точный момент запуска.',
      deepDive: [
        'JavaScript в одном event loop выполняет один фрагмент кода за раз, но Web APIs могут параллельно ждать сеть, таймер или ввод и позже поставить продолжение в очередь.',
        'Tasks поступают из источников задач: начальный script, пользовательские события, таймеры и другие алгоритмы платформы. Спецификация задает очереди и выбор runnable task; это не обязательно одна физическая FIFO-очередь для всего.',
        'После завершения task и очистки стека выполняется microtask checkpoint. Promise reactions, queueMicrotask и MutationObserver связаны с микрозадачами. Новая микрозадача может добавить следующую, поэтому очередь опустошается до возврата к задачам.',
        'Rendering не гарантирован после каждой задачи: браузер учитывает частоту кадров, видимость документа и собственное планирование. requestAnimationFrame вызывается в рамках шага обновления рендеринга перед рисованием, а не как обычный setTimeout.',
        'Длинная задача блокирует обработку ввода и возможность отрисовать кадр. Бесконечная или очень длинная цепочка микрозадач также вызывает starvation, потому что браузер не перейдет к следующей задаче или обновлению UI.',
        'Event loop Node.js имеет другие фазы и API. Браузерную модель tasks/microtasks/rendering нельзя механически переносить на порядок setImmediate, I/O и таймеров Node.js.',
      ],
      example: {
        label: 'Порядок task и microtask',
        code: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nqueueMicrotask(() => console.log("D"));\nconsole.log("E");\n// A, E, C, D, затем B',
        language: 'javascript',
        explanation:
          'Текущий script — задача: синхронные A и E идут первыми. Реакция Promise и queueMicrotask выполняются на checkpoint в порядке постановки. Таймер становится отдельной задачей и не может вклиниться раньше.',
      },
      pitfalls: [
        'Говорить, что setTimeout(fn, 0) запускает fn немедленно.',
        'Считать microtask отдельным потоком.',
        'Обещать paint после каждой task.',
        'Переносить детали фаз Node.js event loop на браузер.',
      ],
      followUps: [
        'Почему цепочка Promise может заблокировать UI?',
        'Чем requestAnimationFrame отличается от setTimeout?',
        'Когда использовать queueMicrotask?',
        'Как разбивать долгую CPU-работу без потери отзывчивости?',
      ],
    },
    en: {
      question: 'How does the JavaScript Event Loop work in a browser?',
      shortAnswer:
        'An event loop coordinates tasks, microtasks, and rendering updates within a browser agent. A script, event, or fired timer runs as a task until its stack completes. The browser then performs a microtask checkpoint: Promise handlers and queueMicrotask callbacks run until the queue is empty, including microtasks they add. The browser may then update rendering when appropriate and select another task. A timer specifies a minimum delay, not an exact execution time.',
      deepDive: [
        'JavaScript on one event loop executes one piece of code at a time, while Web APIs may wait for network, timers, or input concurrently and enqueue later continuation work.',
        'Tasks come from task sources such as the initial script, user events, timers, and other platform algorithms. The specification defines queues and runnable-task selection; it is not necessarily one physical FIFO queue for everything.',
        'After a task finishes and its stack clears, a microtask checkpoint runs. Promise reactions, queueMicrotask, and MutationObserver involve microtasks. A microtask can enqueue another one, so the queue drains before tasks resume.',
        'Rendering is not guaranteed after every task: the browser considers frame timing, document visibility, and its scheduling policy. requestAnimationFrame runs in the rendering-update steps before painting rather than as a normal timeout.',
        'A long task blocks input processing and opportunities to render a frame. An endless or very long microtask chain also causes starvation because the browser cannot proceed to another task or UI update.',
        'Node.js has different event-loop phases and APIs. Browser tasks, microtasks, and rendering should not be mechanically mapped to Node.js ordering for setImmediate, I/O, and timers.',
      ],
      example: {
        label: 'Task and microtask ordering',
        code: 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nqueueMicrotask(() => console.log("D"));\nconsole.log("E");\n// A, E, C, D, then B',
        language: 'javascript',
        explanation:
          'The current script is a task, so synchronous A and E come first. The Promise reaction and queueMicrotask run at the checkpoint in enqueue order. The timer is a separate task and cannot interleave earlier.',
      },
      pitfalls: [
        'Saying setTimeout(fn, 0) runs fn immediately.',
        'Treating a microtask as a separate thread.',
        'Promising a paint after every task.',
        'Applying Node.js event-loop phases to browsers.',
      ],
      followUps: [
        'Why can a Promise chain block the UI?',
        'How does requestAnimationFrame differ from setTimeout?',
        'When is queueMicrotask appropriate?',
        'How can CPU-heavy work be split without losing responsiveness?',
      ],
    },
  },
  {
    id: 'react-fiber',
    slug: 'react-fiber-render-and-commit',
    category: 'react-state',
    tags: ['React', 'Fiber', 'Scheduling', 'Effects'],
    keywords: {
      ru: ['Fiber', 'render', 'commit', 'планирование', 'эффекты', 'identity'],
      en: ['Fiber', 'render', 'commit', 'scheduling', 'effects', 'identity'],
    },
    reviewedAt: '2026-10-23',
    sources: [
      { title: 'React: Render and Commit', url: 'https://react.dev/learn/render-and-commit' },
      {
        title: 'React: Keeping Components Pure',
        url: 'https://react.dev/learn/keeping-components-pure',
      },
      { title: 'React: useTransition', url: 'https://react.dev/reference/react/useTransition' },
    ],
    ru: {
      question: 'Как React Fiber разделяет render и commit?',
      shortAnswer:
        'Fiber — внутренняя структура и модель работы React, позволяющая разбить вычисление следующего дерева на единицы, назначать обновлениям приоритет и, в concurrent-возможностях, приостанавливать или отбрасывать render-работу. Render-фаза вызывает компоненты и вычисляет изменения без побочных эффектов. Commit-фаза синхронно применяет выбранный результат к host-среде, например DOM, обновляет refs и запускает соответствующие эффекты. Concurrent rendering означает планирование и прерываемость, а не параллельное выполнение всех компонентов.',
      deepDive: [
        'Каждый Fiber представляет экземпляр работы для элемента дерева и хранит связи с родителем, соседями и детьми, состояние и информацию об обновлениях. Это реализационная деталь, на которую прикладной код не должен напрямую опираться.',
        'При render React обходит дерево, вызывает компоненты и сравнивает результат. Эта работа может повториться, быть прервана или не попасть в commit, поэтому render обязан быть чистым и не выполнять внешние побочные эффекты.',
        'Планировщик различает срочность обновлений. Transition позволяет пометить несрочное обновление, чтобы ввод оставался приоритетным; это не делает вычисление бесплатным и не создает отдельный поток JavaScript.',
        'Commit применяет DOM-мутации для завершенного дерева. Layout effects выполняются вокруг commit так, чтобы измерять уже обновленный layout до paint; passive effects обычно выполняются отдельно после commit. Точные детали планирования не следует превращать в предположение о гарантированном кадре.',
        'Identity определяется типом, положением и key. При сохранении identity React сохраняет state; новый key или другой тип сбрасывает поддерево. Fiber не отменяет правила reconciliation, а реализует их.',
        'В Strict Mode среда разработки может повторно вызывать render или цикл effect setup/cleanup, чтобы выявить нечистый код. Это диагностическое поведение, а не свидетельство двух commit каждого production-обновления.',
      ],
      example: {
        label: 'Несрочное обновление списка',
        code: 'const [isPending, startTransition] = useTransition();\n\nfunction handleChange(value: string) {\n  setInput(value);\n  startTransition(() => {\n    setFilter(value);\n  });\n}',
        language: 'tsx',
        explanation:
          'Обновление input остается срочным, а пересчет результата по filter можно прервать более срочной работой. Код фильтрации все равно выполняется на JavaScript-потоке и должен быть достаточно эффективным.',
      },
      pitfalls: [
        'Выполнять запросы или изменять внешнее состояние прямо во время render.',
        'Считать concurrent rendering многопоточностью.',
        'Путать завершенный render с уже измененным DOM.',
        'Игнорировать key при объяснении сохранения state.',
      ],
      followUps: [
        'Почему render должен быть чистым?',
        'Чем layout effect отличается от passive effect?',
        'Когда transition улучшает отзывчивость?',
        'Как key намеренно сбрасывает состояние?',
      ],
    },
    en: {
      question: 'How does React Fiber separate render and commit?',
      shortAnswer:
        'Fiber is React’s internal data structure and work model. It lets React split calculation of the next tree into units, assign update priorities, and—under concurrent capabilities—pause or discard render work. The render phase calls components and calculates changes without side effects. The commit phase synchronously applies the selected result to the host environment, such as the DOM, updates refs, and runs relevant effects. Concurrent rendering means scheduling and interruptibility, not parallel execution of every component.',
      deepDive: [
        'Each Fiber represents work for an element in the tree and stores parent, sibling, and child relationships, state, and update information. It is an implementation detail that application code should not directly depend on.',
        'During render, React traverses the tree, calls components, and compares output. This work may repeat, be interrupted, or never commit, so render must be pure and avoid external side effects.',
        'The scheduler distinguishes update urgency. A Transition marks non-urgent work so input can retain priority; it neither makes computation free nor creates another JavaScript thread.',
        'Commit applies DOM mutations for a completed tree. Layout effects run around commit so they can inspect updated layout before paint; passive effects generally run separately after commit. Scheduling details should not be turned into a promise about an exact frame.',
        'Identity follows type, position, and key. React preserves state while identity is preserved; a new key or type resets the subtree. Fiber implements rather than replaces reconciliation rules.',
        'In development, Strict Mode may repeat render or an effect setup/cleanup cycle to expose impure code. This diagnostic behavior does not mean every production update commits twice.',
      ],
      example: {
        label: 'A non-urgent list update',
        code: 'const [isPending, startTransition] = useTransition();\n\nfunction handleChange(value: string) {\n  setInput(value);\n  startTransition(() => {\n    setFilter(value);\n  });\n}',
        language: 'tsx',
        explanation:
          'The input update remains urgent while result calculation based on filter can be interrupted by more urgent work. Filtering still runs on the JavaScript thread and must remain reasonably efficient.',
      },
      pitfalls: [
        'Starting requests or mutating external state during render.',
        'Equating concurrent rendering with multithreading.',
        'Confusing completed render work with an already mutated DOM.',
        'Ignoring keys when explaining state preservation.',
      ],
      followUps: [
        'Why must render stay pure?',
        'How does a layout effect differ from a passive effect?',
        'When does a Transition improve responsiveness?',
        'How can a key deliberately reset state?',
      ],
    },
  },
  {
    id: 'mobx-redux',
    slug: 'mobx-vs-redux',
    category: 'react-state',
    tags: ['MobX', 'Redux', 'State Management', 'React'],
    keywords: {
      ru: ['наблюдаемое состояние', 'actions', 'reducers', 'selectors', 'реактивность'],
      en: ['observable state', 'actions', 'reducers', 'selectors', 'reactivity'],
    },
    reviewedAt: '2026-10-23',
    sources: [
      { title: 'MobX: The gist of MobX', url: 'https://mobx.js.org/the-gist-of-mobx.html' },
      {
        title: 'Redux: Redux Toolkit — Getting Started',
        url: 'https://redux-toolkit.js.org/introduction/getting-started',
      },
      {
        title: 'Redux: Essentials — Async Logic and Data Fetching',
        url: 'https://redux.js.org/tutorials/essentials/part-5-async-logic',
      },
    ],
    ru: {
      question: 'Как выбирать между MobX и Redux?',
      shortAnswer:
        'MobX строит реактивный граф: observable-состояние отслеживает чтения, computed выводит значения, actions изменяют данные, а observer перерисовывает только потребителей затронутых зависимостей. Redux хранит состояние через явные dispatch событий и reducer-переходы; современный стандарт — Redux Toolkit, уменьшающий шаблонный код. MobX часто дает локальную выразительность и объектную модель, Redux — строгий поток, журналируемые события и единообразные инструменты. Выбор зависит от требований к прозрачности, масштаба команды, доменной модели и правил асинхронности, а не от рейтинга библиотек.',
      deepDive: [
        'MobX автоматически подписывает реакцию на observable-значения, прочитанные во время ее выполнения. Это дает точечные обновления, но границы чтения и потеря наблюдаемости при неверной передаче данных требуют понимания модели.',
        'Redux обновляет единое логическое дерево состояния путем dispatch action. Reducers вычисляют следующий state; Redux Toolkit использует Immer, поэтому синтаксис может выглядеть мутирующим, оставаясь иммутабельным снаружи.',
        'Redux DevTools и сериализуемые actions упрощают просмотр истории и воспроизведение потока. MobX также имеет инструменты трассировки, но изменения могут быть распределены по методам нескольких store, если команда не задаст дисциплину actions.',
        'Асинхронность не выполняется reducer. В Redux ее организуют thunk, listener middleware, RTK Query или другой выбранный слой. В MobX Promise-результаты обычно возвращают изменения в action/flow; отмена и гонки остаются ответственностью приложения.',
        'Тесты Redux часто проверяют чистые reducers/selectors и поведение middleware. MobX-store можно тестировать как объект, проверяя actions и computed; UI-тестам не следует зависеть от внутренних деталей реактивного графа.',
        'Практический опыт с обеими моделями полезен, но не доказывает универсальное превосходство. Для небольшой команды важнее единые соглашения о владении состоянием, side effects, сериализации и границах store.',
      ],
      example: {
        label: 'Один доменный переход в двух стилях',
        code: '// Redux Toolkit\nconst counter = createSlice({\n  name: "counter", initialState: { value: 0 },\n  reducers: { increment: (state) => { state.value += 1; } },\n});\n\n// MobX\nclass Counter {\n  value = 0;\n  constructor() { makeAutoObservable(this); }\n  increment() { this.value += 1; }\n}',
        language: 'typescript',
        explanation:
          'Оба варианта выражают допустимый переход. Redux создает явный action/reducer-протокол; MobX вызывает метод observable-объекта и отслеживает зависимых читателей.',
      },
      pitfalls: [
        'Сравнивать современный MobX с устаревшим Redux без Redux Toolkit.',
        'Хранить все локальное UI-состояние в глобальном store по умолчанию.',
        'Выполнять побочные эффекты в reducers или computed.',
        'Выбирать библиотеку без соглашений об async, ошибках и отмене.',
      ],
      followUps: [
        'Когда сериализуемость Redux особенно важна?',
        'Как MobX определяет зависимости observer?',
        'Где должны жить серверные данные?',
        'Как тестировать асинхронные гонки и отмену?',
      ],
    },
    en: {
      question: 'How should a team choose between MobX and Redux?',
      shortAnswer:
        'MobX builds a reactive graph: observable state tracks reads, computed derives values, actions mutate data, and observer rerenders consumers of affected dependencies. Redux changes state through explicit dispatched events and reducer transitions; Redux Toolkit is the modern standard that removes much boilerplate. MobX often offers local expressiveness and an object model, while Redux offers a strict flow, loggable events, and uniform tooling. The choice depends on transparency requirements, team scale, domain modeling, and async conventions—not a library ranking.',
      deepDive: [
        'MobX automatically subscribes a reaction to observable values read while that reaction runs. This gives precise updates, but developers must understand read boundaries and how observability can be lost through incorrect data passing.',
        'Redux updates one logical state tree by dispatching actions. Reducers calculate the next state; Redux Toolkit uses Immer, so reducer syntax can look mutating while preserving immutable external semantics.',
        'Redux DevTools and serializable actions make event history and flow inspection straightforward. MobX also has tracing tools, but changes can spread across several store methods unless a team enforces action discipline.',
        'Reducers do not perform async work. Redux organizes it with thunks, listener middleware, RTK Query, or another selected layer. MobX typically brings Promise results back into an action or flow; cancellation and races still belong to the application.',
        'Redux tests often target pure reducers, selectors, and middleware behavior. A MobX store can be tested as an object through actions and computed values; UI tests should not depend on reactive-graph internals.',
        'Professional experience with both models is useful context but does not prove universal superiority. For a small team, shared rules for ownership, side effects, serialization, and store boundaries matter more.',
      ],
      example: {
        label: 'One domain transition in two styles',
        code: '// Redux Toolkit\nconst counter = createSlice({\n  name: "counter", initialState: { value: 0 },\n  reducers: { increment: (state) => { state.value += 1; } },\n});\n\n// MobX\nclass Counter {\n  value = 0;\n  constructor() { makeAutoObservable(this); }\n  increment() { this.value += 1; }\n}',
        language: 'typescript',
        explanation:
          'Both express a valid transition. Redux creates an explicit action/reducer protocol; MobX calls a method on an observable object and tracks dependent readers.',
      },
      pitfalls: [
        'Comparing current MobX with legacy Redux that omits Redux Toolkit.',
        'Putting all local UI state into a global store by default.',
        'Running side effects inside reducers or computed values.',
        'Choosing a library without conventions for async work, errors, and cancellation.',
      ],
      followUps: [
        'When is Redux serializability especially valuable?',
        'How does MobX discover observer dependencies?',
        'Where should server state live?',
        'How should async races and cancellation be tested?',
      ],
    },
  },
  {
    id: 'microfrontends-tradeoffs',
    slug: 'microfrontends-when-not-to-use-them',
    category: 'architecture',
    tags: ['Microfrontends', 'Architecture', 'Deployment', 'Modular Monolith'],
    keywords: {
      ru: ['микрофронтенды', 'модульный монолит', 'владение', 'интеграция', 'изоляция'],
      en: ['microfrontends', 'modular monolith', 'ownership', 'integration', 'isolation'],
    },
    reviewedAt: '2026-10-23',
    sources: [
      {
        title: 'Martin Fowler: Micro Frontends',
        url: 'https://martinfowler.com/articles/micro-frontends.html',
      },
      { title: 'web.dev: Web Vitals', url: 'https://web.dev/articles/vitals' },
      {
        title: 'webpack: Module Federation',
        url: 'https://webpack.js.org/concepts/module-federation/',
      },
    ],
    ru: {
      question: 'Когда не стоит использовать микрофронтенды?',
      shortAnswer:
        'Не стоит, если проблема не требует независимого владения и поставки несколькими автономными командами. Микрофронтенды добавляют контракты интеграции, маршрутизацию, согласование версий, дублирование зависимостей, наблюдаемость и эксплуатацию распределенной системы в браузере. Для одной или нескольких тесно связанных команд модульный монолит с явными границами пакетов часто дает ту же декомпозицию дешевле. Решение должно следовать организационным и релизным ограничениям, а не моде.',
      deepDive: [
        'Главный мотив — автономия вертикальных продуктовых команд: каждая владеет срезом от разработки до выпуска. Если релизы все равно координируются централизованно, runtime-разделение может добавить сложность без независимости.',
        'Интеграция бывает build-time, server-side, через iframe, web components или runtime module loading. Каждый вариант по-разному влияет на изоляцию, совместное состояние, SSR, ошибки загрузки и совместимость версий.',
        'Общие React, дизайн-система и инфраструктурные пакеты требуют стратегии: дублирование увеличивает загрузку, жесткие singleton-ограничения связывают релизы, а несовместимые версии могут сломаться только в конкретной комбинации.',
        'Shell и команды должны договориться о routing, authentication, telemetry, error boundaries, accessibility и CSS isolation. Сквозной пользовательский сценарий становится распределенным контрактом и требует интеграционных тестов.',
        'Runtime-границы создают новые состояния отказа: удаленный модуль недоступен, манифест устарел, CDN частично обновлен. Нужны fallback, совместимость, атомарная стратегия публикации и диагностика версии каждого фрагмента.',
        'Модульный монолит сохраняет один deployment, но вводит доменные пакеты, публичные API и запрет обхода границ. Это хороший исходный вариант; выделять микрофронтенд разумно при доказанной организационной или релизной боли.',
      ],
      example: {
        label: 'Гипотетический контракт границы модуля',
        code: 'export interface CheckoutModule {\n  mount(target: HTMLElement, context: { locale: string; token: string }): () => void;\n}\n\n// Возвращаемая функция обязана удалить listeners и DOM модуля.',
        language: 'typescript',
        explanation:
          'Даже маленький контракт требует правил версии, безопасности token, обработки ошибок, очистки и совместимости shell. Такие обязанности следует оценить до выбора runtime-микрофронтенда.',
      },
      pitfalls: [
        'Использовать микрофронтенды только ради разных фреймворков.',
        'Не назначить владельца общих контрактов и shell.',
        'Считать shared dependency бесплатной и всегда совместимой.',
        'Игнорировать частичные отказы и сквозную доступность интерфейса.',
      ],
      followUps: [
        'Какая организационная граница оправдывает отдельный deployment?',
        'Как версионировать контракт shell и remote?',
        'Когда iframe — разумная изоляция?',
        'Как мигрировать из модульного монолита постепенно?',
      ],
    },
    en: {
      question: 'When should you not use microfrontends?',
      shortAnswer:
        'Do not use them when the problem does not require independent ownership and delivery by autonomous teams. Microfrontends add integration contracts, routing, version coordination, dependency duplication, observability, and distributed-system operations in the browser. For one or a few tightly coupled teams, a modular monolith with explicit package boundaries often provides the same decomposition at lower cost. The decision should follow organizational and release constraints rather than fashion.',
      deepDive: [
        'The primary motivation is autonomy for vertical product teams that own a slice from development to release. If releases still require central coordination, runtime separation may add complexity without independence.',
        'Integration can happen at build time, server side, through iframes or web components, or with runtime module loading. Each option changes isolation, shared state, SSR, loading failures, and version compatibility.',
        'Shared React, design-system, and infrastructure packages need a strategy: duplication adds transfer and execution cost, strict singletons couple releases, and incompatible versions may fail only in a particular combination.',
        'The shell and teams must agree on routing, authentication, telemetry, error boundaries, accessibility, and CSS isolation. An end-to-end user journey becomes a distributed contract requiring integration tests.',
        'Runtime boundaries introduce failure states: a remote is unavailable, a manifest is stale, or a CDN is partially updated. Teams need fallbacks, compatibility policy, atomic publishing strategy, and diagnostics for each fragment version.',
        'A modular monolith retains one deployment while enforcing domain packages, public APIs, and no boundary bypasses. It is a strong default; extraction is justified when organizational or release pain is demonstrated.',
      ],
      example: {
        label: 'Hypothetical module-boundary contract',
        code: 'export interface CheckoutModule {\n  mount(target: HTMLElement, context: { locale: string; token: string }): () => void;\n}\n\n// The returned function must remove module listeners and DOM.',
        language: 'typescript',
        explanation:
          'Even a small contract needs versioning, token security, error handling, cleanup, and shell compatibility rules. Those obligations should be priced before choosing a runtime microfrontend.',
      },
      pitfalls: [
        'Adopting microfrontends merely to use different frameworks.',
        'Leaving shared contracts and the shell without clear ownership.',
        'Treating a shared dependency as free and always compatible.',
        'Ignoring partial failures and end-to-end accessibility.',
      ],
      followUps: [
        'What organizational boundary justifies a separate deployment?',
        'How should shell and remote contracts be versioned?',
        'When is an iframe a reasonable isolation mechanism?',
        'How can a modular monolith be extracted incrementally?',
      ],
    },
  },
  {
    id: 'frontend-performance',
    slug: 'frontend-performance-diagnosis',
    category: 'production-testing',
    tags: ['Performance', 'Web Vitals', 'DevTools', 'Observability'],
    keywords: {
      ru: ['LCP', 'INP', 'CLS', 'long task', 'профилирование', 'полевые данные'],
      en: ['LCP', 'INP', 'CLS', 'long task', 'profiling', 'field data'],
    },
    reviewedAt: '2026-10-23',
    sources: [
      { title: 'web.dev: Web Vitals', url: 'https://web.dev/articles/vitals' },
      {
        title: 'web.dev: Optimize Interaction to Next Paint',
        url: 'https://web.dev/articles/optimize-inp',
      },
      {
        title: 'Chrome DevTools: Performance features reference',
        url: 'https://developer.chrome.com/docs/devtools/performance/reference/',
      },
    ],
    ru: {
      question: 'Как диагностировать производительность фронтенда в production?',
      shortAnswer:
        'Начинать нужно с пользовательского симптома и измерения, а не с догадки. Полевые RUM-данные показывают распределение LCP, INP и CLS на реальных устройствах и сетях; лабораторная запись помогает воспроизвести и объяснить конкретный путь. Затем сегментируют данные по странице, устройству, соединению и версии, строят гипотезу и проверяют ее через Network и Performance: критический путь LCP, долгие tasks и обработчики для INP, источники layout shift для CLS. Исправление подтверждают тем же измерением и контролируют побочные эффекты.',
      deepDive: [
        'Field и lab отвечают на разные вопросы. Field показывает реальный масштаб и хвост распределения, но содержит вариативность; lab дает повторяемый профиль, но не представляет все устройства, кэши, ввод и географию.',
        'LCP зависит от обнаружения ресурса, сетевой очереди, времени ответа, декодирования и задержки рендеринга элемента. Нужно определить сам LCP-элемент и разложить задержку, а не автоматически сжимать все изображения.',
        'INP оценивает задержку взаимодействия через input delay, время обработчика и presentation delay. Performance trace помогает найти длинные main-thread tasks, синхронный layout, тяжелый JavaScript и поздний paint.',
        'CLS вызывают неожиданные сдвиги: изображения без размеров, вставка контента, смена шрифта или анимация layout-свойств. DevTools показывает кластеры сдвигов и затронутые узлы; не каждый визуальный переход считается неожиданным.',
        'Network-панель раскрывает cache status, priority, blocking, connection timing и размер передачи. Проверять надо холодный и теплый путь, но не путать отключенный DevTools cache с поведением пользователей.',
        'После изменения проводят сопоставимый lab-тест и наблюдают field-релиз. Один быстрый запуск не доказывает улучшение: важны одинаковые условия, распределения, версия и отсутствие регрессии функциональности.',
      ],
      example: {
        label: 'Минимальное наблюдение Web Vitals',
        code: 'import { onCLS, onINP, onLCP } from "web-vitals";\n\nconst report = (metric: { name: string; value: number; id: string }) => {\n  navigator.sendBeacon("/rum", JSON.stringify(metric));\n};\n\nonCLS(report);\nonINP(report);\nonLCP(report);',
        language: 'typescript',
        explanation:
          'Гипотетический RUM-клиент отправляет метрику при наличии согласованного endpoint. В production нужны правила приватности, sampling, версия релиза, контекст страницы и корректная агрегация нескольких событий.',
      },
      pitfalls: [
        'Оптимизировать по Lighthouse без проверки реального пользовательского симптома.',
        'Сравнивать трассы с разными throttling, кэшем и состоянием страницы.',
        'Считать любую длинную задачу единственной причиной плохого INP.',
        'Публиковать среднее без распределения и сегментации.',
      ],
      followUps: [
        'Как разложить время LCP по этапам?',
        'Почему хороший lab-результат может расходиться с field?',
        'Как найти причину presentation delay в INP?',
        'Какие изменения обычно предотвращают CLS?',
      ],
    },
    en: {
      question: 'How do you diagnose frontend performance in production?',
      shortAnswer:
        'Start with a user symptom and measurement rather than a guess. Field RUM data shows distributions of LCP, INP, and CLS on real devices and networks; a lab recording helps reproduce and explain a particular path. Segment by page, device, connection, and release, form a hypothesis, and use Network and Performance tools to inspect the LCP critical path, long tasks and handlers for INP, and layout-shift sources for CLS. Confirm a fix with the same measurement and watch for side effects.',
      deepDive: [
        'Field and lab answer different questions. Field data exposes real scale and distribution tails but includes variability; lab data provides a repeatable profile but cannot represent every device, cache state, interaction, and geography.',
        'LCP can depend on resource discovery, network queuing, response time, decoding, and element render delay. Identify the actual LCP element and decompose its delay instead of automatically compressing every image.',
        'INP reflects interaction latency across input delay, handler duration, and presentation delay. A Performance trace can reveal long main-thread tasks, forced synchronous layout, expensive JavaScript, and delayed painting.',
        'CLS comes from unexpected shifts such as unsized images, inserted content, font swaps, or animation of layout properties. DevTools exposes shift clusters and affected nodes; not every visual transition is unexpected.',
        'The Network panel exposes cache status, priority, blocking, connection timing, and transfer size. Test cold and warm paths, but do not mistake the DevTools “disable cache” mode for normal user behavior.',
        'After a change, run a comparable lab test and observe the field release. One fast run does not prove an improvement: equivalent conditions, distributions, release identity, and lack of functional regression matter.',
      ],
      example: {
        label: 'Minimal Web Vitals observation',
        code: 'import { onCLS, onINP, onLCP } from "web-vitals";\n\nconst report = (metric: { name: string; value: number; id: string }) => {\n  navigator.sendBeacon("/rum", JSON.stringify(metric));\n};\n\nonCLS(report);\nonINP(report);\nonLCP(report);',
        language: 'typescript',
        explanation:
          'This hypothetical RUM client sends a metric when an agreed endpoint exists. Production use needs privacy policy, sampling, release version, page context, and correct aggregation of repeated events.',
      },
      pitfalls: [
        'Optimizing a Lighthouse score without confirming a real user symptom.',
        'Comparing traces with different throttling, cache state, or page state.',
        'Treating any long task as the sole cause of poor INP.',
        'Publishing an average without distributions and segmentation.',
      ],
      followUps: [
        'How can LCP time be decomposed?',
        'Why can strong lab results disagree with field data?',
        'How do you locate the source of INP presentation delay?',
        'Which changes commonly prevent CLS?',
      ],
    },
  },
  {
    id: 'playwright-flakiness',
    slug: 'playwright-e2e-and-flaky-tests',
    category: 'production-testing',
    tags: ['Playwright', 'E2E', 'Testing', 'CI'],
    keywords: {
      ru: ['Playwright', 'нестабильные тесты', 'локаторы', 'fixtures', 'trace', 'изоляция'],
      en: ['Playwright', 'flaky tests', 'locators', 'fixtures', 'trace', 'isolation'],
    },
    reviewedAt: '2026-10-23',
    sources: [
      { title: 'Playwright: Best Practices', url: 'https://playwright.dev/docs/best-practices' },
      { title: 'Playwright: Auto-waiting', url: 'https://playwright.dev/docs/actionability' },
      { title: 'Playwright: Trace Viewer', url: 'https://playwright.dev/docs/trace-viewer' },
    ],
    ru: {
      question: 'Как строить Playwright E2E-тесты и устранять flaky tests?',
      shortAnswer:
        'E2E-тесты должны проверять небольшой набор критичных пользовательских контрактов через наблюдаемое поведение, а более дешевые ветвления — на уровне unit/component/integration. В Playwright надежность дают изоляция контекста, независимые данные, устойчивые role/label/test-id локаторы, web-first assertions и ожидание реального состояния вместо sleep. Сеть мокируют, когда нужна детерминированная проверка frontend-ветки, но сохраняют отдельные сквозные проверки реальной интеграции. Flake расследуют по trace, DOM, network и логам CI; retry собирает сигнал, а не лечит причину.',
      deepDive: [
        'Граница тестовой пирамиды определяется стоимостью и риском. E2E ценны для маршрутизации, аутентификации и ключевых цепочек через систему, но комбинаторную бизнес-логику быстрее и точнее проверять ниже.',
        'Локаторы по role, accessible name и label близки к пользовательскому восприятию и проверяют доступность. test-id уместен для стабильного контракта без хорошей семантики; CSS/XPath, завязанные на структуру, хрупки.',
        'Playwright автоматически ждет actionability перед действиями, а expect(locator) повторяет проверку до timeout. Фиксированный waitForTimeout маскирует гонку и зависит от скорости машины.',
        'Каждый тест должен получать чистый browser context и контролируемые данные. Fixtures оформляют создание пользователя, API-клиент или page object; shared mutable state и зависимость от порядка тестов вызывают непредсказуемость.',
        'Route mocking делает ошибки, пустые состояния и редкие ответы воспроизводимыми, но не проверяет настоящий backend-контракт. Нужен осознанный набор: контрактные/API-тесты плюс несколько реальных E2E на интеграционных границах.',
        'Trace on first retry сохраняет шаги, snapshots, сеть и таймлайн для CI-сбоя. Сначала классифицируют причину — selector, данные, сеть, animation, product race или инфраструктура — и исправляют корень. AI может предложить сценарий или локатор, но человек обязан проверить утверждения, безопасность данных и соответствие реальному контракту.',
      ],
      example: {
        label: 'Ожидание наблюдаемого результата без sleep',
        code: 'test("adds an item to the cart", async ({ page }) => {\n  await page.goto("/catalog");\n  await page.getByRole("button", { name: "Add to cart" }).first().click();\n  await expect(page.getByRole("status")).toHaveText("Added to cart");\n  await expect(page.getByRole("link", { name: /Cart/ })).toContainText("1");\n});',
        language: 'typescript',
        explanation:
          'Действие использует семантический локатор, а проверки ждут видимые пользователю результаты. Для независимости теста его fixture должен обеспечить известный каталог и пустую корзину.',
      },
      pitfalls: [
        'Заменять причину нестабильности большим timeout или множеством retries.',
        'Использовать waitForTimeout для синхронизации с приложением.',
        'Делить пользователя или состояние между параллельными тестами.',
        'Полностью мокировать сеть и называть тест сквозной проверкой интеграции.',
      ],
      followUps: [
        'Когда выбрать role, label или test-id?',
        'Что искать в Playwright trace?',
        'Как изолировать данные параллельных workers?',
        'Какие сценарии оставить настоящими end-to-end?',
      ],
    },
    en: {
      question: 'How should Playwright E2E tests be designed, and flaky tests eliminated?',
      shortAnswer:
        'E2E tests should cover a small set of critical user contracts through observable behavior, while cheaper branching belongs in unit, component, or integration tests. In Playwright, reliability comes from isolated contexts, independent data, durable role/label/test-id locators, web-first assertions, and waiting for observable state rather than sleeping. Mock the network for deterministic frontend branches, but retain separate checks of real integration. Investigate flakes through traces, DOM, network, and CI logs; a retry gathers evidence rather than curing the cause.',
      deepDive: [
        'Test-pyramid boundaries follow cost and risk. E2E tests are valuable for routing, authentication, and critical journeys through the system, while combinatorial business rules are faster and more precise at lower levels.',
        'Locators based on role, accessible name, and label align with user perception and exercise accessibility. A test id is appropriate for a stable contract without useful semantics; structure-dependent CSS or XPath is brittle.',
        'Playwright auto-waits for actionability before actions, and expect(locator) retries assertions until timeout. A fixed waitForTimeout hides a race and varies with machine speed.',
        'Every test should receive a clean browser context and controlled data. Fixtures can create users, API clients, or page objects; shared mutable state and order-dependent tests introduce nondeterminism.',
        'Route mocking makes errors, empty states, and rare responses reproducible but does not validate the real backend contract. Use a deliberate mix: contract/API coverage plus selected real E2E checks at integration boundaries.',
        'A trace on first retry captures steps, snapshots, network, and timeline for a CI failure. Classify the cause—selector, data, network, animation, product race, or infrastructure—and fix the root. AI may suggest a scenario or locator, but a human must review assertions, data safety, and alignment with the real contract.',
      ],
      example: {
        label: 'Waiting for observable results without a sleep',
        code: 'test("adds an item to the cart", async ({ page }) => {\n  await page.goto("/catalog");\n  await page.getByRole("button", { name: "Add to cart" }).first().click();\n  await expect(page.getByRole("status")).toHaveText("Added to cart");\n  await expect(page.getByRole("link", { name: /Cart/ })).toContainText("1");\n});',
        language: 'typescript',
        explanation:
          'The action uses a semantic locator and assertions wait for user-visible results. For independence, its fixture must provide a known catalog and an empty cart.',
      },
      pitfalls: [
        'Replacing the cause of flakiness with a larger timeout or many retries.',
        'Using waitForTimeout to synchronize with the application.',
        'Sharing a user or mutable state across parallel tests.',
        'Mocking every network call and calling the result a full integration E2E test.',
      ],
      followUps: [
        'When should role, label, or test-id be used?',
        'What evidence should be inspected in a Playwright trace?',
        'How can test data be isolated across parallel workers?',
        'Which scenarios should remain truly end-to-end?',
      ],
    },
  },
] as const;

export const notesBacklog = [
  { ru: 'Утечки памяти и сборка мусора', en: 'Memory leaks and garbage collection' },
  {
    ru: 'Структурная типизация и дженерики TypeScript',
    en: 'TypeScript structural typing and generics',
  },
  { ru: 'HTTP-кэширование, ETag и Service Workers', en: 'HTTP caching, ETag, and Service Workers' },
  { ru: 'Лишние рендеры React', en: 'Unnecessary React renders' },
  {
    ru: 'Расширяемые мастера кампаний и контракты каналов',
    en: 'Extensible campaign wizards and channel contracts',
  },
  { ru: 'Гонки запросов и AbortController', en: 'Race conditions and AbortController' },
  { ru: 'CSR, SSR, SSG и гидратация', en: 'CSR, SSR, SSG, and hydration' },
  { ru: 'Диагностика production-инцидентов', en: 'Production incident triage' },
  { ru: 'Порог архитектурного рефакторинга', en: 'Architecture refactoring thresholds' },
  { ru: 'Инженерные разногласия в команде', en: 'Engineering disagreements within a team' },
  { ru: 'Управление техническим долгом', en: 'Technical debt management' },
  { ru: 'Ответственная разработка с помощью AI', en: 'Responsible AI-assisted engineering' },
] as const;
