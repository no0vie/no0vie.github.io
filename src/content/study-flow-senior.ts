const l = (ru: string, en: string) => ({ ru, en });
const reviewPolicy = { againDays: 1, hardDays: 3, goodDays: 7, easyDays: 14 } as const;

interface Spec {
  id: string;
  title: [string, string];
  goal: [string, string];
  category:
    | 'web-fundamentals'
    | 'postgresql'
    | 'backend-architecture'
    | 'performance'
    | 'behavioral'
    | 'rails';
  priority: 'P0' | 'P1' | 'P2';
  prerequisites?: string[];
  related?: string[];
  concepts: string[];
  theory: [string, string];
  steps: [string[], string[]];
  practice: [string, string];
  hints: [string, string];
  solution: [string, string];
  pitfalls: [string, string];
  check: [string, string];
  criteria: [string, string][];
  source: [string, string];
}

const specs: Spec[] = [
  {
    id: 'web-request-lifecycle',
    title: ['URL → страница: полный путь', 'URL to page: the complete path'],
    goal: [
      'Объяснить DNS, transport, TLS, HTTP и rendering как один причинный путь.',
      'Explain DNS, transport, TLS, HTTP, and rendering as one causal path.',
    ],
    category: 'web-fundamentals',
    priority: 'P0',
    concepts: ['dns', 'tcp', 'tls', 'http-1', 'http-2', 'http-3', 'rendering'],
    theory: [
      'После разбора URL браузер проверяет кеши и policy, резолвит DNS, устанавливает TCP+TLS либо QUIC, отправляет HTTP-запрос, обрабатывает redirects/caching и параллельно строит DOM/CSSOM. HTTP/2 мультиплексирует streams в TCP-соединении; HTTP/3 использует QUIC поверх UDP и избегает межпоточного head-of-line blocking на transport-уровне.',
      'After parsing the URL, the browser checks caches and policy, resolves DNS, establishes TCP+TLS or QUIC, sends HTTP, handles redirects/caching, and builds DOM/CSSOM. HTTP/2 multiplexes streams over TCP; HTTP/3 uses QUIC over UDP and avoids transport-level cross-stream head-of-line blocking.',
    ],
    steps: [
      [
        'URL и cache/service worker',
        'DNS: имя → адрес',
        'TCP+TLS или QUIC',
        'HTTP request → CDN/proxy/backend',
        'HTML/CSS/JS → DOM/CSSOM → pixels',
      ],
      [
        'URL and cache/service worker',
        'DNS: name → address',
        'TCP+TLS or QUIC',
        'HTTP request → CDN/proxy/backend',
        'HTML/CSS/JS → DOM/CSSOM → pixels',
      ],
    ],
    practice: [
      'Объясните путь запроса и укажите, где измерять DNS, connect, TTFB, resource loading и main-thread work.',
      'Explain the request path and where to measure DNS, connect, TTFB, resource loading, and main-thread work.',
    ],
    hints: [
      '1) Разделите network и rendering. 2) Учтите cache/redirect. 3) Не называйте HTTP/3 «TCP поверх UDP».',
      '1) Separate network and rendering. 2) Include cache/redirect. 3) Do not call HTTP/3 “TCP over UDP”.',
    ],
    solution: [
      'Используйте Navigation Timing/Resource Timing и trace: DNS/connect/TLS до requestStart, TTFB до responseStart, download до responseEnd; затем Performance panel разделяет parsing, long tasks, style/layout/paint. Повторный визит может пропустить DNS/handshake или весь network благодаря cache.',
      'Use Navigation Timing/Resource Timing and a trace: DNS/connect/TLS before requestStart, TTFB until responseStart, download until responseEnd; then Performance separates parsing, long tasks, style/layout/paint. A repeat visit may skip DNS/handshake or all network work due to caching.',
    ],
    pitfalls: [
      'Ошибки: считать шаги строго последовательными; путать HTTP/2 multiplexing с отсутствием TCP HOL; обещать render сразу после HTML. Follow-up: 0-RTT risks, connection coalescing, preload priority.',
      'Mistakes: treating every step as sequential; confusing HTTP/2 multiplexing with removal of TCP HOL; promising render immediately after HTML. Follow-ups: 0-RTT risks, connection coalescing, preload priority.',
    ],
    check: [
      'Почему низкий TTFB не гарантирует быстрый LCP?',
      'Why does low TTFB not guarantee fast LCP?',
    ],
    criteria: [
      ['Ресурс LCP может загружаться поздно.', 'The LCP resource may be discovered late.'],
      ['Main thread может быть занят.', 'The main thread may be busy.'],
      [
        'CSS/fonts/layout/paint остаются частью пути.',
        'CSS/fonts/layout/paint remain in the path.',
      ],
    ],
    source: [
      'MDN — How browsers work',
      'https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work',
    ],
  },
  {
    id: 'web-http-api-design',
    title: ['HTTP и REST API', 'HTTP and REST API design'],
    goal: [
      'Проектировать предсказуемый HTTP API с корректной семантикой.',
      'Design a predictable HTTP API with correct semantics.',
    ],
    category: 'web-fundamentals',
    priority: 'P0',
    prerequisites: ['web-request-lifecycle'],
    related: ['web-auth-cookies-security'],
    concepts: ['methods', 'status-codes', 'headers', 'rest', 'pagination'],
    theory: [
      'GET/HEAD безопасны; PUT и DELETE идемпотентны по семантике, POST обычно нет. Status code описывает результат HTTP-операции, а не внутреннее исключение. Ресурсные URL, валидируемые payload, conditional requests и cursor pagination уменьшают неоднозначность API.',
      'GET/HEAD are safe; PUT and DELETE are idempotent by semantics, while POST usually is not. A status code describes the HTTP operation outcome, not an internal exception. Resource URLs, validated payloads, conditional requests, and cursor pagination reduce ambiguity.',
    ],
    steps: [
      [
        'Client intent',
        'Method + resource + representation',
        'Validation/authz/idempotency',
        'Domain transaction',
        'Status + headers + body',
      ],
      [
        'Client intent',
        'Method + resource + representation',
        'Validation/authz/idempotency',
        'Domain transaction',
        'Status + headers + body',
      ],
    ],
    practice: [
      'Спроектируйте API создания заказа: retry, validation errors, optimistic concurrency и cursor pagination списка.',
      'Design an order API with retries, validation errors, optimistic concurrency, and cursor pagination.',
    ],
    hints: [
      'POST + Idempotency-Key; 400/401/403/404/409/422 различают классы ошибок; If-Match/ETag защищает update.',
      'Use POST + Idempotency-Key; distinguish 400/401/403/404/409/422; protect updates with If-Match/ETag.',
    ],
    solution: [
      'POST /orders с ключом идемпотентности и 201+Location; повтор с тем же payload возвращает сохранённый результат, другой payload — conflict. PATCH /orders/:id требует If-Match. GET /orders?after=opaqueCursor&limit=… возвращает nextCursor, построенный по стабильному (created_at,id).',
      'POST /orders uses an idempotency key and returns 201+Location; replay with the same payload returns the stored result, while a different payload conflicts. PATCH requires If-Match. GET uses an opaque cursor over stable (created_at,id).',
    ],
    pitfalls: [
      'Ошибки: GET с side effect; 200 для всех ошибок; offset на изменяемом большом наборе; leaking internals. Follow-up: PATCH semantics, 202 jobs, versioning.',
      'Mistakes: side effects in GET; 200 for every error; offset on a large changing set; leaking internals. Follow-ups: PATCH semantics, 202 jobs, versioning.',
    ],
    check: ['Когда вернуть 409, а когда 422?', 'When should an API return 409 versus 422?'],
    criteria: [
      ['422 — невалидное содержимое запроса.', '422 is invalid request content.'],
      [
        '409 — конфликт с текущим состоянием ресурса.',
        '409 conflicts with current resource state.',
      ],
    ],
    source: ['RFC 9110 — HTTP Semantics', 'https://www.rfc-editor.org/rfc/rfc9110'],
  },
  {
    id: 'web-auth-cookies-security',
    title: ['Cookies, sessions и web security', 'Cookies, sessions, and web security'],
    goal: [
      'Спроектировать безопасную browser authentication и разобрать cross-origin cookies.',
      'Design secure browser authentication and diagnose cross-origin cookies.',
    ],
    category: 'web-fundamentals',
    priority: 'P0',
    prerequisites: ['web-http-api-design'],
    related: ['backend-idempotency-resilience'],
    concepts: ['cookies', 'sessions', 'authentication', 'authorization', 'csrf', 'xss', 'cors'],
    theory: [
      'Authentication устанавливает субъект, authorization проверяет действие над ресурсом. Server-side session хранит состояние на сервере, cookie несёт opaque ID; signed/encrypted cookie или token-based подход переносит больше состояния клиенту. HttpOnly снижает кражу через JS, Secure требует HTTPS, SameSite управляет cross-site отправкой, Domain/Path задают scope, но не являются security boundary для Path.',
      'Authentication establishes identity; authorization checks an action on a resource. A server-side session stores state on the server and an opaque ID in a cookie; signed/encrypted cookies or tokens move more state client-side. HttpOnly limits JS access, Secure requires HTTPS, SameSite controls cross-site sending, and Domain/Path scope cookies, though Path is not a security boundary.',
    ],
    steps: [
      [
        'Login over TLS',
        'Rotate session ID',
        'Set Secure HttpOnly SameSite cookie',
        'Browser sends credentials when policy allows',
        'Server authenticates then authorizes',
      ],
      [
        'Login over TLS',
        'Rotate session ID',
        'Set Secure HttpOnly SameSite cookie',
        'Browser sends credentials when policy allows',
        'Server authenticates then authorizes',
      ],
    ],
    practice: [
      'SPA на app.example вызывает api.example и получает CORS/cookie ошибки. Спроектируйте login, CSRF defense и logout.',
      'An SPA on app.example calls api.example and hits CORS/cookie failures. Design login, CSRF defense, and logout.',
    ],
    hints: [
      'Проверьте site vs origin; credentials: include; конкретный Allow-Origin; SameSite; CSRF token/Origin check.',
      'Check site vs origin; credentials: include; explicit Allow-Origin; SameSite; CSRF token/Origin checks.',
    ],
    solution: [
      'Для same-site subdomains можно использовать host-only cookie API с Secure+HttpOnly+SameSite=Lax/Strict по UX. Для genuinely cross-site cookie нужен SameSite=None; Secure, credentialed fetch и allowlisted origin с Access-Control-Allow-Credentials; wildcard запрещён. State-changing routes проверяют CSRF token и Origin/Fetch Metadata. XSS предотвращают output encoding, CSP и отказ от unsafe HTML; CORS не защищает от CSRF.',
      'For same-site subdomains, use a host-only API cookie with Secure+HttpOnly and a suitable SameSite mode. A genuinely cross-site cookie needs SameSite=None; Secure, credentialed fetch, an allowlisted origin, and Allow-Credentials; wildcard is invalid. Mutations verify CSRF tokens and Origin/Fetch Metadata. Prevent XSS with output encoding, CSP, and no unsafe HTML; CORS is not CSRF protection.',
    ],
    pitfalls: [
      'Ошибки: хранить long-lived token в localStorage без threat model; считать JWT authorization; использовать Domain=.example.com без нужды. Follow-up: refresh rotation, session fixation, BFF.',
      'Mistakes: storing long-lived tokens in localStorage without a threat model; treating JWT as authorization; broad Domain cookies. Follow-ups: refresh rotation, session fixation, BFF.',
    ],
    check: ['Почему HttpOnly не устраняет CSRF?', 'Why does HttpOnly not eliminate CSRF?'],
    criteria: [
      [
        'Браузер всё равно прикладывает cookie автоматически.',
        'The browser still attaches the cookie automatically.',
      ],
      ['Нужна отдельная проверка намерения/origin.', 'Intent/origin needs an independent check.'],
    ],
    source: [
      'OWASP Session Management Cheat Sheet',
      'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html',
    ],
  },
  {
    id: 'postgresql-querying',
    title: ['SQL: JOIN, aggregation и CTE', 'SQL: joins, aggregation, and CTEs'],
    goal: [
      'Писать корректные PostgreSQL-запросы и замечать изменение cardinality.',
      'Write correct PostgreSQL queries and reason about cardinality.',
    ],
    category: 'postgresql',
    priority: 'P0',
    concepts: ['join', 'group-by', 'having', 'cte'],
    theory: [
      'INNER оставляет совпадения, LEFT сохраняет левую сторону, RIGHT обычно переписывают как LEFT для читаемости. WHERE фильтрует строки до aggregation, HAVING — группы после. CTE улучшает декомпозицию; в современных PostgreSQL он не всегда optimization fence.',
      'INNER keeps matches, LEFT preserves the left side, and RIGHT is often rewritten as LEFT for readability. WHERE filters rows before aggregation; HAVING filters groups after it. CTEs aid decomposition and are not always optimization fences in modern PostgreSQL.',
    ],
    steps: [
      [
        'Filter base rows',
        'Join with explicit keys',
        'Group',
        'Aggregate',
        'HAVING',
        'Order/limit',
      ],
      [
        'Filter base rows',
        'Join with explicit keys',
        'Group',
        'Aggregate',
        'HAVING',
        'Order/limit',
      ],
    ],
    practice: [
      'Найдите клиентов с ≥3 оплаченными заказами за 90 дней и суммой >100000, включая имя клиента.',
      'Find customers with at least three paid orders in 90 days and total above 100000, including customer name.',
    ],
    hints: [
      'Фильтр status/date — WHERE; COUNT/SUM — aggregate; пороги — HAVING; group by customer key/name.',
      'Put status/date in WHERE; COUNT/SUM in aggregates; thresholds in HAVING; group by customer key/name.',
    ],
    solution: [
      "SELECT c.id, c.name, COUNT(*) AS orders, SUM(o.total) AS revenue FROM customers c JOIN orders o ON o.customer_id=c.id WHERE o.status='paid' AND o.paid_at >= now()-interval '90 days' GROUP BY c.id,c.name HAVING COUNT(*)>=3 AND SUM(o.total)>100000 ORDER BY revenue DESC;",
      "SELECT c.id, c.name, COUNT(*) AS orders, SUM(o.total) AS revenue FROM customers c JOIN orders o ON o.customer_id=c.id WHERE o.status='paid' AND o.paid_at >= now()-interval '90 days' GROUP BY c.id,c.name HAVING COUNT(*)>=3 AND SUM(o.total)>100000 ORDER BY revenue DESC;",
    ],
    pitfalls: [
      'Ошибки: predicate правой таблицы в WHERE после LEFT JOIN; COUNT(*) вместо COUNT(child.id); duplicate multiplication. Follow-up: window functions, FILTER, lateral join.',
      'Mistakes: right-side predicate in WHERE after LEFT JOIN; COUNT(*) instead of COUNT(child.id); duplicate multiplication. Follow-ups: windows, FILTER, lateral joins.',
    ],
    check: [
      'Как сохранить клиентов без заказов при LEFT JOIN?',
      'How do you preserve customers without orders in a LEFT JOIN?',
    ],
    criteria: [
      [
        'Фильтр child поместить в ON или корректно учесть NULL.',
        'Put child filters in ON or handle NULL correctly.',
      ],
      ['COUNT(child.id), не COUNT(*).', 'Use COUNT(child.id), not COUNT(*).'],
    ],
    source: ['PostgreSQL — Queries', 'https://www.postgresql.org/docs/current/queries.html'],
  },
  {
    id: 'postgresql-indexes-plans',
    title: ['PostgreSQL: индексы и планы', 'PostgreSQL indexes and plans'],
    goal: [
      'Выбирать B-tree/composite/partial index и читать EXPLAIN ANALYZE.',
      'Choose B-tree/composite/partial indexes and read EXPLAIN ANALYZE.',
    ],
    category: 'postgresql',
    priority: 'P0',
    prerequisites: ['postgresql-querying'],
    related: ['postgresql-n-plus-one-pagination'],
    concepts: ['btree', 'composite-index', 'partial-index', 'explain-analyze'],
    theory: [
      'B-tree поддерживает equality/range/order. В composite index важны leading columns и фактические predicates; partial index индексирует только строки предиката. EXPLAIN показывает оценки, ANALYZE выполняет запрос и показывает actual rows/timing; сравнение estimated vs actual выявляет проблемы статистики/cardinality.',
      'B-tree supports equality, ranges, and ordering. Composite indexes depend on leading columns and real predicates; partial indexes only index rows matching a predicate. EXPLAIN shows estimates, while ANALYZE executes and reports actual rows/timing; estimated-vs-actual differences expose statistics/cardinality issues.',
    ],
    steps: [
      [
        'Query predicates/order',
        'Candidate index',
        'EXPLAIN (ANALYZE, BUFFERS)',
        'Compare estimates/actual',
        'Measure write/storage cost',
      ],
      [
        'Query predicates/order',
        'Candidate index',
        'EXPLAIN (ANALYZE, BUFFERS)',
        'Compare estimates/actual',
        'Measure write/storage cost',
      ],
    ],
    practice: [
      "Для WHERE tenant_id=? AND status='open' ORDER BY created_at DESC LIMIT 50 выберите индекс и объясните plan.",
      'Choose an index and explain the plan for tenant_id/status/order/limit.',
    ],
    hints: [
      'Equality columns before ordering column; consider partial status=open; verify buffers and rows removed.',
      'Put equality columns before the ordering column; consider a partial open-status index; inspect buffers and rows removed.',
    ],
    solution: [
      "CREATE INDEX CONCURRENTLY idx_jobs_tenant_open_created ON jobs (tenant_id, created_at DESC) WHERE status='open'; Проверить Index Scan, actual rows, buffers и latency на representative data. CONCURRENTLY снижает блокировку writes, но дольше строится и требует контроля failed invalid index.",
      "CREATE INDEX CONCURRENTLY idx_jobs_tenant_open_created ON jobs (tenant_id, created_at DESC) WHERE status='open'; verify Index Scan, actual rows, buffers, and latency on representative data. CONCURRENTLY reduces write blocking but takes longer and failed builds need cleanup.",
    ],
    pitfalls: [
      'Ошибки: индекс на каждую колонку; верить cost как миллисекундам; запускать ANALYZE опасной mutation без rollback. Follow-up: covering INCLUDE, extended statistics, bitmap scan.',
      'Mistakes: indexing every column; treating cost as milliseconds; ANALYZE on dangerous mutations without rollback. Follow-ups: INCLUDE, extended statistics, bitmap scans.',
    ],
    check: [
      'Почему planner может выбрать Seq Scan при существующем индексе?',
      'Why might the planner choose a Seq Scan despite an index?',
    ],
    criteria: [
      [
        'Большая доля таблицы/дешевле sequential I/O.',
        'A large table fraction makes sequential I/O cheaper.',
      ],
      ['Статистика/селективность/корреляция.', 'Statistics/selectivity/correlation matter.'],
    ],
    source: [
      'PostgreSQL — Using EXPLAIN',
      'https://www.postgresql.org/docs/current/using-explain.html',
    ],
  },
  {
    id: 'postgresql-n-plus-one-pagination',
    title: ['N+1, batching и cursor pagination', 'N+1, batching, and cursor pagination'],
    goal: [
      'Устранять N+1 и проектировать стабильную pagination.',
      'Eliminate N+1 and design stable pagination.',
    ],
    category: 'postgresql',
    priority: 'P0',
    prerequisites: ['postgresql-indexes-plans'],
    concepts: ['n-plus-one', 'eager-loading', 'batching', 'cursor-pagination'],
    theory: [
      'N+1 — один запрос списка плюс запрос на каждую строку. Eager loading через join может умножить строки; batching загружает связанные записи через WHERE id=ANY(...) и собирает map. Cursor pagination требует детерминированного уникального порядка и keyset predicate.',
      'N+1 is one list query plus one query per row. Join eager loading can multiply rows; batching loads related rows with WHERE id=ANY(...) and assembles a map. Cursor pagination needs deterministic unique ordering and a keyset predicate.',
    ],
    steps: [
      [
        'Trace request queries',
        'Detect repeated shape',
        'Batch/eager load',
        'Use stable (created_at,id) cursor',
        'Test concurrent inserts/deletes',
      ],
      [
        'Trace request queries',
        'Detect repeated shape',
        'Batch/eager load',
        'Use stable (created_at,id) cursor',
        'Test concurrent inserts/deletes',
      ],
    ],
    practice: [
      'API делает 101 query для 100 posts. Исправьте и добавьте pagination без OFFSET.',
      'An API performs 101 queries for 100 posts. Fix it and add pagination without OFFSET.',
    ],
    hints: [
      'Collect author_ids; one ANY query; map by id. Cursor encodes last created_at+id; next predicate uses tuple comparison.',
      'Collect author IDs; one ANY query; map by id. Encode last created_at+id; use tuple comparison.',
    ],
    solution: [
      'Загрузить page posts одним запросом WHERE (created_at,id)<($1,$2) ORDER BY created_at DESC,id DESC LIMIT 51; одним вторым запросом получить authors WHERE id=ANY($ids), собрать Map, 51-ю запись использовать только для hasNext/cursor. Ограничить batch size.',
      'Load posts with a tuple keyset predicate ordered by created_at,id and LIMIT 51; fetch authors once with id=ANY($ids), build a Map, and use the 51st row only for hasNext/cursor. Bound batch size.',
    ],
    pitfalls: [
      'Ошибки: includes всех associations; cursor только по неуникальному timestamp; огромный IN. Follow-up: DataLoader request scope, snapshot consistency.',
      'Mistakes: including every association; cursor on a non-unique timestamp; huge IN lists. Follow-ups: request-scoped DataLoader, snapshot consistency.',
    ],
    check: ['Почему cursor должен включать id?', 'Why should the cursor include an ID?'],
    criteria: [
      ['Timestamp может совпадать.', 'Timestamps can tie.'],
      [
        'Уникальный tie-breaker предотвращает пропуски/дубли.',
        'A unique tie-breaker avoids skips/duplicates.',
      ],
    ],
    source: [
      'PostgreSQL — Row comparisons',
      'https://www.postgresql.org/docs/current/functions-comparisons.html#ROW-WISE-COMPARISON',
    ],
  },
  {
    id: 'postgresql-transactions-migrations',
    title: ['Transactions, MVCC и migrations', 'Transactions, MVCC, and migrations'],
    goal: [
      'Объяснить isolation/locks/deadlocks и безопасно менять большие таблицы.',
      'Explain isolation/locks/deadlocks and safely change large tables.',
    ],
    category: 'postgresql',
    priority: 'P0',
    prerequisites: ['postgresql-indexes-plans'],
    related: ['backend-message-email-outbox'],
    concepts: [
      'acid',
      'mvcc',
      'isolation',
      'deadlock',
      'batch-processing',
      'zero-downtime-migration',
    ],
    theory: [
      'MVCC даёт snapshots и версии строк; isolation определяет допустимые аномалии. Locks защищают конфликтующие изменения, deadlock PostgreSQL обнаруживает и abort одну transaction. Zero-downtime migration использует expand/contract: совместимая schema, backfill bounded batches, dual-compatible code, constraints/indexes безопасными операциями, затем cleanup.',
      'MVCC provides snapshots and row versions; isolation defines allowed anomalies. Locks protect conflicting changes, and PostgreSQL detects deadlocks and aborts one transaction. Zero-downtime migration uses expand/contract: compatible schema, bounded backfill, dual-compatible code, safe constraints/indexes, then cleanup.',
    ],
    steps: [
      [
        'Expand nullable/new structure',
        'Deploy compatible reads/writes',
        'Backfill small resumable batches',
        'Validate + add constraint/index safely',
        'Switch reads then contract',
      ],
      [
        'Expand nullable/new structure',
        'Deploy compatible reads/writes',
        'Backfill small resumable batches',
        'Validate + add constraint/index safely',
        'Switch reads then contract',
      ],
    ],
    practice: [
      'Добавьте NOT NULL колонку к таблице из миллионов строк без долгой блокировки и спроектируйте resumable backfill.',
      'Add a NOT NULL column to a multi-million-row table without a long lock and design a resumable backfill.',
    ],
    hints: [
      'Separate schema change/backfill/constraint; process key ranges; commit batches; record checkpoint; monitor locks/replication lag.',
      'Separate schema/backfill/constraint; process key ranges; commit batches; record checkpoints; monitor locks/replication lag.',
    ],
    solution: [
      'Добавить nullable column; deploy code writing both forms; backfill id ranges with bounded UPDATE and commits, idempotently skipping filled rows; add CHECK NOT VALID, VALIDATE CONSTRAINT, затем SET NOT NULL where supported efficiently; switch reads and later remove old field. Retry deadlocks with bounded jitter only for safe transactions.',
      'Add a nullable column; deploy dual-compatible writes; backfill ID ranges in bounded committed batches while skipping completed rows; add CHECK NOT VALID, validate it, then set NOT NULL efficiently; switch reads and later remove the old field. Retry deadlocks with bounded jitter only for safe transactions.',
    ],
    pitfalls: [
      'Ошибки: одна гигантская transaction; DDL без lock timeout; different lock order; retry non-idempotent work. Follow-up: Serializable retries, vacuum, replica lag.',
      'Mistakes: one giant transaction; DDL without lock timeout; inconsistent lock order; retrying non-idempotent work. Follow-ups: Serializable retries, vacuum, replica lag.',
    ],
    check: ['Как уменьшить вероятность deadlock?', 'How do you reduce deadlock probability?'],
    criteria: [
      ['Единый порядок захвата locks.', 'Use a consistent lock order.'],
      ['Короткие transactions.', 'Keep transactions short.'],
      ['Retry aborted transaction целиком.', 'Retry the entire aborted transaction.'],
    ],
    source: [
      'PostgreSQL — Explicit Locking',
      'https://www.postgresql.org/docs/current/explicit-locking.html',
    ],
  },
  {
    id: 'backend-layers-transactions',
    title: ['Backend layers и transaction boundaries', 'Backend layers and transaction boundaries'],
    goal: [
      'Разместить бизнес-логику и границы transaction без ceremony.',
      'Place business logic and transaction boundaries without needless ceremony.',
    ],
    category: 'backend-architecture',
    priority: 'P0',
    prerequisites: ['web-http-api-design'],
    concepts: [
      'controller',
      'service',
      'repository',
      'domain',
      'dependency-injection',
      'solid',
      'domain-events',
    ],
    theory: [
      'Controller переводит transport в use-case input/output; application service оркестрирует use case и transaction; domain хранит инварианты; repository абстрагирует persistence там, где это полезно. DI направляет зависимости к abstractions, но не требует container. SOLID — эвристики, а не цель; лишние слои вредят так же, как смешение HTTP, SQL и domain rules.',
      'A controller translates transport into use-case input/output; an application service orchestrates the use case and transaction; the domain holds invariants; repositories abstract persistence where useful. DI points dependencies toward abstractions but does not require a container. SOLID is a set of heuristics, not a goal; needless layers hurt as much as mixing HTTP, SQL, and domain rules.',
    ],
    steps: [
      [
        'HTTP controller validates shape',
        'Use case authorizes and opens transaction',
        'Domain enforces invariant',
        'Repository persists',
        'Commit then publish external effects safely',
      ],
      [
        'HTTP controller validates shape',
        'Use case authorizes and opens transaction',
        'Domain enforces invariant',
        'Repository persists',
        'Commit then publish external effects safely',
      ],
    ],
    practice: [
      'Разложите createMessage по слоям и выберите transaction boundary.',
      'Split createMessage into layers and choose the transaction boundary.',
    ],
    hints: [
      'HTTP concerns stay in controller; invariant belongs to domain/use case; transaction spans atomic DB changes, not email API.',
      'Keep HTTP concerns in the controller; invariants belong to domain/use case; the transaction spans atomic DB changes, not an email API.',
    ],
    solution: [
      'Controller parses actor/DTO and maps errors. CreateMessage service checks authorization, runs repository writes and domain-event/outbox insert in one transaction. Domain validates message state. Repository contains SQL, not business decisions. Email delivery is outside the DB transaction.',
      'The controller parses actor/DTO and maps errors. CreateMessage checks authorization and runs repository writes plus domain-event/outbox insert in one transaction. The domain validates message state. The repository contains SQL, not business decisions. Email delivery stays outside the DB transaction.',
    ],
    pitfalls: [
      'Ошибки: fat controller; repository с orchestration; transaction на весь HTTP call; interface на каждый class. Follow-up: unit of work, aggregate boundaries, modular monolith.',
      'Mistakes: fat controllers; repositories orchestrating use cases; transactions spanning the HTTP call; interfaces for every class. Follow-ups: unit of work, aggregate boundaries, modular monolith.',
    ],
    check: [
      'Почему email API не должен быть внутри DB transaction?',
      'Why should an email API not run inside a DB transaction?',
    ],
    criteria: [
      [
        'Внешний side effect не откатывается с DB.',
        'The external side effect cannot roll back with the DB.',
      ],
      [
        'Долгая transaction удерживает resources/locks.',
        'A long transaction holds resources/locks.',
      ],
    ],
    source: [
      'Microsoft — Domain events',
      'https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation',
    ],
  },
  {
    id: 'backend-jobs-delivery',
    title: ['Background jobs и delivery semantics', 'Background jobs and delivery semantics'],
    goal: [
      'Проектировать retries, queues и consumers с честными гарантиями.',
      'Design retries, queues, and consumers with honest guarantees.',
    ],
    category: 'backend-architecture',
    priority: 'P0',
    prerequisites: ['backend-layers-transactions'],
    related: ['backend-message-email-outbox'],
    concepts: [
      'background-jobs',
      'queues',
      'retry',
      'backoff',
      'jitter',
      'at-least-once',
      'dead-letter-queue',
    ],
    theory: [
      'At-most-once может потерять работу; at-least-once может повторить её. Consumer обязан быть идемпотентным. Retry ограничивают attempt budget, exponential backoff и jitter; permanent errors не ретраят. DLQ — карантин с причиной и replay-процедурой, не архив, который никто не смотрит.',
      'At-most-once may lose work; at-least-once may repeat it. Consumers must be idempotent. Retries need attempt budgets, exponential backoff, and jitter; permanent errors should not retry. A DLQ is a quarantine with reasons and replay procedures, not an ignored archive.',
    ],
    steps: [
      [
        'Producer enqueues durable job',
        'Worker leases message',
        'Idempotency check',
        'Perform effect',
        'Ack or retry/DLQ',
      ],
      [
        'Producer enqueues durable job',
        'Worker leases message',
        'Idempotency check',
        'Perform effect',
        'Ack or retry/DLQ',
      ],
    ],
    practice: [
      'Спроектируйте worker отправки email при timeouts, 4xx/5xx, crash после send и poison message.',
      'Design an email worker for timeouts, 4xx/5xx, a crash after send, and poison messages.',
    ],
    hints: [
      'Classify errors; stable operation key; persist attempts/provider ID; ack only after durable outcome; DLQ alert.',
      'Classify errors; use a stable operation key; persist attempts/provider ID; ack after a durable outcome; alert on DLQ.',
    ],
    solution: [
      'Job содержит notificationId. Worker atomарно claims запись, проверяет sent status, вызывает provider с idempotency key если доступно, сохраняет providerMessageId/status, затем ack. Timeout — uncertain outcome: reconcile by provider key/status before retry. 429/5xx retry with bounded exponential backoff+jitter; invalid address → permanent failure/DLQ. Crash after send может дать duplicate без provider dedupe, поэтому exactly-once для внешнего email не обещается.',
      'The job carries notificationId. The worker atomically claims it, checks sent status, calls the provider with an idempotency key where available, stores providerMessageId/status, then acknowledges. A timeout is uncertain: reconcile before retry. Retry 429/5xx with bounded exponential backoff+jitter; invalid addresses are permanent failures/DLQ. A crash after send can duplicate without provider dedupe, so exactly-once external email is not promised.',
    ],
    pitfalls: [
      'Ошибки: бесконечный retry; одинаковая задержка без jitter; ack до persistence; ручной replay без idempotency. Follow-up: visibility timeout, ordering, backpressure.',
      'Mistakes: infinite retries; fixed delay without jitter; ack before persistence; replay without idempotency. Follow-ups: visibility timeout, ordering, backpressure.',
    ],
    check: [
      'Что означает at-least-once для consumer?',
      'What does at-least-once mean for a consumer?',
    ],
    criteria: [
      ['Сообщение может прийти повторно.', 'A message may be delivered repeatedly.'],
      [
        'Effect должен дедуплицироваться/быть идемпотентным.',
        'The effect needs deduplication/idempotency.',
      ],
    ],
    source: [
      'AWS Builders Library — retries and backoff',
      'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/',
    ],
  },
  {
    id: 'backend-message-email-outbox',
    title: ['Message → Email: Transactional Outbox', 'Message to email: Transactional Outbox'],
    goal: [
      'Эволюционировать решение от sync send к outbox и объяснить оставшиеся сбои.',
      'Evolve sync sending into an outbox and explain remaining failure modes.',
    ],
    category: 'backend-architecture',
    priority: 'P0',
    prerequisites: ['backend-jobs-delivery', 'postgresql-transactions-migrations'],
    related: ['backend-idempotency-resilience'],
    concepts: ['transactional-outbox', 'after-commit', 'idempotency', 'exactly-once'],
    theory: [
      'Sync send увеличивает latency и всё равно не атомарен с DB. Enqueue после commit оставляет окно commit→enqueue; enqueue до commit создаёт ghost job. Outbox записывает message и event в одной DB transaction; relay публикует event после commit. Relay может публиковать повторно, поэтому consumer остаётся идемпотентным. Outbox не делает внешний email exactly-once.',
      'Synchronous send increases latency and is still not atomic with the DB. Enqueue after commit leaves a commit→enqueue gap; enqueue before commit can create a ghost job. An outbox writes the message and event in one DB transaction; a relay publishes after commit. The relay can publish twice, so consumers remain idempotent. Outbox does not make external email exactly-once.',
    ],
    steps: [
      [
        'API: BEGIN',
        'INSERT message',
        'INSERT outbox(eventId, MessageCreated)',
        'COMMIT',
        'Relay claims/publishes/marks event',
        'Worker deduplicates and sends/reconciles email',
      ],
      [
        'API: BEGIN',
        'INSERT message',
        'INSERT outbox(eventId, MessageCreated)',
        'COMMIT',
        'Relay claims/publishes/marks event',
        'Worker deduplicates and sends/reconciles email',
      ],
    ],
    practice: [
      'Реализуйте TypeScript use case и relay contract; разберите crash после commit, после publish и после provider send.',
      'Implement a TypeScript use case and relay contract; analyze crashes after commit, publish, and provider send.',
    ],
    hints: [
      '1) message+outbox in one tx. 2) SELECT … FOR UPDATE SKIP LOCKED. 3) Stable eventId/notificationId. 4) Mark only after publish; tolerate duplicate.',
      '1) Write message+outbox in one tx. 2) SELECT … FOR UPDATE SKIP LOCKED. 3) Stable eventId/notificationId. 4) Mark only after publish; tolerate duplicates.',
    ],
    solution: [
      "await db.transaction(async tx => { const message=await tx.messages.insert(input); await tx.outbox.insert({id: eventId, type:'MessageCreated', aggregateId:message.id, payload:{messageId:message.id,userId:input.userId}}); }); Relay читает bounded batch unpublished rows с SKIP LOCKED, публикует с eventId и помечает published_at. Crash после publish до mark даёт повтор; consumer UNIQUE(event_id) и notification state делают обработку идемпотентной. Provider timeout требует reconciliation; DLQ/replay и age/depth/failure metrics обеспечивают восстановление.",
      "await db.transaction(async tx => { const message=await tx.messages.insert(input); await tx.outbox.insert({id: eventId, type:'MessageCreated', aggregateId:message.id, payload:{messageId:message.id,userId:input.userId}}); }); The relay claims a bounded unpublished batch with SKIP LOCKED, publishes eventId, then marks published_at. A crash after publish before marking causes a duplicate; UNIQUE(event_id) and notification state make the consumer idempotent. Provider timeout needs reconciliation; DLQ/replay and age/depth/failure metrics support recovery.",
    ],
    pitfalls: [
      'Ошибки: считать commit и queue atomic; удалить outbox до ack; держать row lock во время медленной сети; обещать exactly-once. Follow-up: CDC relay, ordering per aggregate, retention.',
      'Mistakes: treating DB commit and queue as atomic; deleting outbox before acknowledgment; holding row locks over slow network; promising exactly-once. Follow-ups: CDC relay, per-aggregate ordering, retention.',
    ],
    check: [
      'Какой сбой outbox устраняет, а какой оставляет?',
      'Which failure does the outbox remove, and which remains?',
    ],
    criteria: [
      [
        'Устраняет потерю между DB commit и durable event record.',
        'It removes loss between DB commit and the durable event record.',
      ],
      [
        'Оставляет duplicate publish/delivery и uncertain external effect.',
        'Duplicate publication/delivery and uncertain external effects remain.',
      ],
    ],
    source: [
      'AWS Prescriptive Guidance — Transactional outbox',
      'https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html',
    ],
  },
  {
    id: 'backend-idempotency-resilience',
    title: [
      'Idempotency, rate limits и circuit breaker',
      'Idempotency, rate limits, and circuit breakers',
    ],
    goal: [
      'Защитить mutation и downstream без скрытия отказов.',
      'Protect mutations and downstreams without hiding failures.',
    ],
    category: 'backend-architecture',
    priority: 'P0',
    prerequisites: ['backend-message-email-outbox'],
    concepts: ['idempotency-key', 'rate-limiting', 'circuit-breaker'],
    theory: [
      'Idempotency key scoped to actor/operation binds a request hash to a durable outcome. Rate limiter protects a resource with an explicit key, window/bucket and distributed consistency tradeoff. Circuit breaker fails fast after a threshold and probes recovery; it is not a replacement for timeout, bulkhead or retry budget.',
      'An idempotency key scoped to actor/operation binds a request hash to a durable outcome. A rate limiter protects a resource with an explicit key, bucket/window, and distributed-consistency tradeoff. A circuit breaker fails fast after a threshold and probes recovery; it does not replace timeouts, bulkheads, or retry budgets.',
    ],
    steps: [
      [
        'Authenticate/rate-limit',
        'Reserve idempotency key+hash',
        'Execute bounded operation',
        'Store outcome',
        'Retry returns same outcome',
      ],
      [
        'Authenticate/rate-limit',
        'Reserve idempotency key+hash',
        'Execute bounded operation',
        'Store outcome',
        'Retry returns same outcome',
      ],
    ],
    practice: [
      'Спроектируйте POST /payments с retries и нестабильным provider.',
      'Design POST /payments with retries and an unstable provider.',
    ],
    hints: [
      'Unique(actor,key); request hash; in-progress/final states; provider key; timeout; breaker only for systemic failure.',
      'Use unique(actor,key), request hash, in-progress/final states, provider key, timeout, and a breaker only for systemic failure.',
    ],
    solution: [
      'В transaction резервируется key+hash; conflict с иным hash → 409, final → replay response, in-progress → 409/202. Provider получает stable key. Timeout не объявляется failure без reconciliation. Token bucket ограничивает actor/tenant; breaker открывается по rolling failures, half-open допускает bounded probes.',
      'Reserve key+hash in a transaction; a different hash conflicts, a final state replays the response, and in-progress returns 409/202. Give the provider a stable key. Reconcile timeouts. A token bucket limits actor/tenant; the breaker opens on rolling failures and allows bounded half-open probes.',
    ],
    pitfalls: [
      'Ошибки: key без payload binding; кешировать 500 навсегда; retry storm; global limiter для всех tenants. Follow-up: multi-region dedupe, fencing tokens.',
      'Mistakes: key without payload binding; caching 500 forever; retry storms; one global limiter for all tenants. Follow-ups: multi-region dedupe, fencing tokens.',
    ],
    check: [
      'Почему circuit breaker не заменяет timeout?',
      'Why does a circuit breaker not replace a timeout?',
    ],
    criteria: [
      ['Закрытый breaker всё равно допускает вызов.', 'A closed breaker still allows the call.'],
      ['Каждый вызов должен иметь deadline.', 'Every call still needs a deadline.'],
    ],
    source: [
      'Microsoft — Circuit Breaker pattern',
      'https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker',
    ],
  },
  {
    id: 'performance-api-diagnostics',
    title: ['Диагностика медленного API', 'Diagnosing a slow API'],
    goal: [
      'Локализовать bottleneck по traces, profiles и latency percentiles.',
      'Localize bottlenecks with traces, profiles, and latency percentiles.',
    ],
    category: 'performance',
    priority: 'P1',
    prerequisites: ['backend-layers-transactions'],
    related: ['performance-caching-reliability'],
    concepts: [
      'cpu-bound',
      'io-bound',
      'event-loop',
      'worker-threads',
      'connection-pool',
      'profiling',
      'p99',
    ],
    theory: [
      'Сначала определяют scope и распределение, затем разбивают latency по trace spans. CPU-bound работа загружает event loop и требует algorithm/profile/worker isolation; I/O-bound ждёт downstream и ограничивается concurrency/pools. p99 растёт от queueing, saturation, cold paths и редких медленных зависимостей, даже если p50 стабилен.',
      'First define scope and distribution, then split latency by trace spans. CPU-bound work occupies the event loop and needs algorithmic fixes, profiling, or worker isolation; I/O-bound work waits on downstreams and is constrained by concurrency/pools. p99 grows from queueing, saturation, cold paths, and rare slow dependencies even when p50 stays stable.',
    ],
    steps: [
      [
        'Confirm SLI and percentile/window',
        'Trace endpoint spans',
        'Check saturation: CPU/event-loop/pools/DB',
        'Profile representative slow requests',
        'Change one hypothesis and compare',
      ],
      [
        'Confirm SLI and percentile/window',
        'Trace endpoint spans',
        'Check saturation: CPU/event-loop/pools/DB',
        'Profile representative slow requests',
        'Change one hypothesis and compare',
      ],
    ],
    practice: [
      'После роста traffic p50 стабилен, p99 вырос в 5 раз. Составьте diagnostic plan.',
      'After traffic growth, p50 is stable while p99 is five times higher. Build a diagnostic plan.',
    ],
    hints: [
      'Correlate p99 with queue depth, pool wait, event-loop lag, GC, slow query and downstream spans.',
      'Correlate p99 with queue depth, pool wait, event-loop lag, GC, slow queries, and downstream spans.',
    ],
    solution: [
      'Сравнить deploy/traffic cohorts; trace slow exemplars; проверить event-loop utilization/delay, CPU profiles, GC/heap, DB pool acquire time, query plans/locks, outbound pool and provider latency. Little’s Law объясняет queueing near saturation. Worker Threads применять для измеренной CPU-heavy работы, не для обычного async I/O.',
      'Compare deployment/traffic cohorts; trace slow exemplars; inspect event-loop utilization/delay, CPU profiles, GC/heap, DB pool acquisition, query plans/locks, outbound pools, and provider latency. Little’s Law explains queueing near saturation. Use Worker Threads for measured CPU-heavy work, not normal async I/O.',
    ],
    pitfalls: [
      'Ошибки: оптимизировать среднее; увеличить pool без capacity check; профилировать только happy path. Follow-up: coordinated omission, load shedding, async profiling.',
      'Mistakes: optimizing averages; increasing pools without capacity checks; profiling only happy paths. Follow-ups: coordinated omission, load shedding, async profiling.',
    ],
    check: [
      'Почему больший DB pool может ухудшить latency?',
      'Why can a larger DB pool worsen latency?',
    ],
    criteria: [
      [
        'DB получает больше concurrent work/lock contention.',
        'The DB receives more concurrent work/lock contention.',
      ],
      [
        'Queue переносится внутрь DB и растёт tail latency.',
        'The queue moves into the DB and tail latency grows.',
      ],
    ],
    source: [
      'Node.js — Don’t block the Event Loop',
      'https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop',
    ],
  },
  {
    id: 'performance-caching-reliability',
    title: ['Caching, SLO и graceful degradation', 'Caching, SLOs, and graceful degradation'],
    goal: [
      'Выбрать cache policy и деградацию с измеримыми целями.',
      'Choose cache policy and degradation using measurable targets.',
    ],
    category: 'performance',
    priority: 'P1',
    prerequisites: ['performance-api-diagnostics'],
    concepts: [
      'redis',
      'cache-invalidation',
      'sli',
      'slo',
      'sla',
      'graceful-degradation',
      'observability',
    ],
    theory: [
      'Cache-aside прост, но допускает stampede/stale data; write-through упрощает read consistency ценой write path. TTL — policy staleness, не универсальная invalidation. SLI — измерение, SLO — внутренний target, SLA — договорное обязательство. Error budget связывает надёжность и темп изменений. Деградация сохраняет core journey и отключает дорогие вторичные возможности.',
      'Cache-aside is simple but allows stampedes and stale data; write-through simplifies read consistency at a write-path cost. TTL is a staleness policy, not universal invalidation. An SLI is a measurement, an SLO an internal target, and an SLA a contractual commitment. Error budgets connect reliability and change velocity. Degradation preserves the core journey while disabling expensive secondary features.',
    ],
    steps: [
      [
        'Define correctness/staleness budget',
        'Choose cache key/ownership',
        'Prevent stampede',
        'Invalidate/version',
        'Observe hit rate, latency, errors and stale age',
      ],
      [
        'Define correctness/staleness budget',
        'Choose cache key/ownership',
        'Prevent stampede',
        'Invalidate/version',
        'Observe hit rate, latency, errors and stale age',
      ],
    ],
    practice: [
      'Выберите Redis strategy для product cards и поведение при падении recommendation service.',
      'Choose a Redis strategy for product cards and behavior when recommendations fail.',
    ],
    hints: [
      'Separate authoritative product data from optional recommendations; version keys; jitter TTL; single-flight; stale-if-error.',
      'Separate authoritative product data from optional recommendations; version keys; jitter TTL; single-flight; stale-if-error.',
    ],
    solution: [
      'Product cards: cache-aside by product/version, bounded TTL+jitter, explicit invalidation event, request coalescing and metrics. On Redis failure read DB with concurrency limit, not unlimited fallback. Recommendations: strict timeout/bulkhead; return popular items or omit block. Define availability/latency SLI for core API and monitor p50/p95/p99, errors, saturation, cache age.',
      'Product cards use cache-aside by product/version, bounded TTL+jitter, explicit invalidation events, request coalescing, and metrics. On Redis failure, read the DB with a concurrency limit. Recommendations get a strict timeout/bulkhead and fall back to popular items or omission. Define core availability/latency SLIs and monitor percentiles, errors, saturation, and cache age.',
    ],
    pitfalls: [
      'Ошибки: cache everything; unbounded fallback; SLA=SLO; high hit rate без correctness. Follow-up: negative caching, hot keys, multi-region invalidation.',
      'Mistakes: caching everything; unbounded fallback; equating SLA and SLO; high hit rate without correctness. Follow-ups: negative caching, hot keys, multi-region invalidation.',
    ],
    check: [
      'Что должно произойти при недоступности Redis?',
      'What should happen when Redis is unavailable?',
    ],
    criteria: [
      [
        'Поведение зависит от criticality и capacity.',
        'Behavior depends on criticality and capacity.',
      ],
      [
        'Fallback ограничен, наблюдаем и не создаёт stampede.',
        'Fallback is bounded, observable, and avoids a stampede.',
      ],
    ],
    source: [
      'Google SRE — Service Level Objectives',
      'https://sre.google/sre-book/service-level-objectives/',
    ],
  },
  {
    id: 'behavioral-ownership-decisions',
    title: [
      'Behavioral: ошибки, сложность и решения',
      'Behavioral: mistakes, complexity, and decisions',
    ],
    goal: [
      'Подготовить честные STAR-ответы об ошибках и архитектурных решениях.',
      'Prepare honest STAR answers about mistakes and architectural decisions.',
    ],
    category: 'behavioral',
    priority: 'P0',
    concepts: ['star', 'ownership', 'tradeoffs', 'technical-debt'],
    theory: [
      'Интервьюер проверяет ownership, глубину диагностики, trade-offs и обучение. STAR: Situation/constraints → Task/your responsibility → Actions/alternatives/evidence → Result/verified effect → Reflection. Вопросы: серьёзная ошибка; обнаружение и исправление; сложнейшая задача; отказ от первоначальной архитектуры; выбор между вариантами; технический долг; аргументация решения.',
      'The interviewer tests ownership, diagnostic depth, tradeoffs, and learning. STAR: situation/constraints → task/your responsibility → actions/alternatives/evidence → result/verified effect → reflection. Questions cover a major mistake, detection/fix, hardest task, abandoning an architecture, choosing alternatives, technical debt, and persuading a team.',
    ],
    steps: [
      [
        'Select a verified episode',
        'State your scope, not the team’s as yours',
        'Explain alternatives and evidence',
        'Give only verified result',
        'Reflect and invite follow-ups',
      ],
      [
        'Select a verified episode',
        'State your scope, not the team’s as yours',
        'Explain alternatives and evidence',
        'Give only verified result',
        'Reflect and invite follow-ups',
      ],
    ],
    practice: [
      'Подготовьте ответы на 7 вопросов. Можно опираться на подтверждённые кейсы: Yandex Market — участие в развитии микрофронтендов; MTS — выбор modular monolith вместо неудачного microfrontend experiment. Детали результата заполните сами.',
      'Prepare answers to seven questions. Verified anchors: participation in Yandex Market microfrontend evolution; at MTS, choosing a modular monolith after an unsuccessful microfrontend experiment. Fill in result details yourself.',
    ],
    hints: [
      'Что проверяют: ownership и judgment. STAR: контекст → ваша зона → сигнал/варианты → решение → подтверждённый результат → урок. Follow-ups: кто не согласился, что измеряли, что сделали бы иначе?',
      'What is tested: ownership and judgment. STAR: context → your scope → signal/options → decision → verified result → lesson. Follow-ups: who disagreed, what was measured, what would you change?',
    ],
    solution: [
      'Шаблон хорошего ответа: «В [подтверждённом контексте] моей задачей было […]. Первоначально мы выбрали […], потому что […]. Сигналы […], показали компромисс […]. Я сравнил варианты по […], предложил […], согласовал […]. Подтверждённый результат: [заполнить]. Мой урок: […].» Не публикуйте неподтверждённые цифры. Собственный ответ храните только в личных заметках; сайт намеренно не сохраняет чувствительный текст в localStorage.',
      'Good-answer template: “In [verified context], I was responsible for […]. We initially chose […] because […]. Signals […] exposed the tradeoff […]. I compared options by […], proposed […], and aligned […]. Verified result: [fill in]. My lesson: […].” Do not publish unverified metrics. Keep your own answer in private notes; the site intentionally does not persist sensitive free text in localStorage.',
    ],
    pitfalls: [
      'Ошибки: обвинять коллег; говорить только «мы»; скрывать trade-off; выдумывать результат; превращать STAR в 10 минут. Senior follow-ups: reversibility, stakeholders, leading indicators, prevention.',
      'Mistakes: blaming colleagues; saying only “we”; hiding tradeoffs; inventing outcomes; a ten-minute STAR. Senior follow-ups: reversibility, stakeholders, leading indicators, prevention.',
    ],
    check: [
      'Какие факты отделяют сильный ответ от красивой истории?',
      'What facts separate a strong answer from a polished story?',
    ],
    criteria: [
      ['Ясна личная ответственность.', 'Personal responsibility is clear.'],
      ['Названы альтернативы и evidence.', 'Alternatives and evidence are named.'],
      [
        'Результат проверяем и без выдуманных метрик.',
        'The result is verifiable and has no invented metrics.',
      ],
    ],
    source: [
      'Google re:Work — structured interviewing',
      'https://rework.withgoogle.com/intl/en/guides/hiring-use-structured-interviewing',
    ],
  },
  {
    id: 'behavioral-leadership-ai',
    title: ['Behavioral: leadership, мотивация и AI', 'Behavioral: leadership, motivation, and AI'],
    goal: [
      'Подготовить ответы о конфликтах, качестве, мотивации и инженерном контроле AI.',
      'Prepare answers about conflict, quality, motivation, and engineering control of AI.',
    ],
    category: 'behavioral',
    priority: 'P0',
    prerequisites: ['behavioral-ownership-decisions'],
    concepts: ['leadership', 'quality', 'motivation', 'ai-oversight'],
    theory: [
      'Вопросы проверяют влияние без authority, баланс риска и скорости, зрелую мотивацию и контроль AI. Набор: конфликт tech/business; качество при сроках; почему смена; почему компания; как используется AI; проверка AI-generated code; что не делегировать AI. Ответ о компании должен основываться на публичной вакансии/продукте, а не слухах.',
      'These questions test influence without authority, risk/speed balance, mature motivation, and AI oversight. The set covers tech/business conflict, quality under deadlines, reasons for changing jobs/company interest, AI usage, AI-code verification, and tasks not to delegate. Company-specific answers must use public role/product evidence, not rumors.',
    ],
    steps: [
      [
        'Clarify stakeholder goal',
        'Make constraints and risks explicit',
        'Offer options and reversible scope',
        'Agree quality gates',
        'Measure and revisit',
      ],
      [
        'Clarify stakeholder goal',
        'Make constraints and risks explicit',
        'Offer options and reversible scope',
        'Agree quality gates',
        'Measure and revisit',
      ],
    ],
    practice: [
      'Подготовьте 7 ответов. Для quality можно использовать только подтверждённые практики; для company motivation заполните публичные факты конкретной вакансии. Для AI подчеркните human ownership.',
      'Prepare seven answers. Use only verified quality practices; fill company motivation from public job facts. For AI, emphasize human ownership.',
    ],
    hints: [
      'STAR + stakeholder map. AI answer: spec/context → bounded task → review/tests/security → traceability. Не делегировать финальную ответственность, secrets, irreversible production actions и decisions без контекста.',
      'Use STAR plus a stakeholder map. AI answer: spec/context → bounded task → review/tests/security → traceability. Do not delegate final accountability, secrets, irreversible production actions, or context-poor decisions.',
    ],
    solution: [
      'Шаблон: «Цель бизнеса была […], технический риск — […]. Я предложил варианты A/B с ценой и quality gates […]. Мы выбрали […]; мой вклад […]; подтверждённый результат [заполнить].» AI: использовать для вариантов, поиска и черновиков; проверять diff, источники, types/lint/tests, security и production assumptions; решения и release остаются за инженером.',
      'Template: “The business goal was […], while the technical risk was […]. I offered A/B with costs and quality gates […]. We chose […]; my contribution was […]; verified result [fill in].” Use AI for alternatives, search, and drafts; verify diffs, sources, types/lint/tests, security, and production assumptions; engineering decisions and release ownership remain human.',
    ],
    pitfalls: [
      'Ошибки: «бизнес не понимал»; generic company praise; AI как автономный автор; тесты как единственная проверка. Follow-ups: deadline moved again, AI hallucinated API, sensitive code, disagreement after incident.',
      'Mistakes: “business did not understand”; generic company praise; AI as an autonomous author; tests as the only check. Follow-ups: another deadline cut, hallucinated API, sensitive code, post-incident disagreement.',
    ],
    check: ['Что нельзя делегировать AI и почему?', 'What should not be delegated to AI, and why?'],
    criteria: [
      [
        'Accountability и risk acceptance остаются у человека.',
        'Accountability and risk acceptance remain human.',
      ],
      [
        'Secrets/permissions/irreversible actions требуют policy и approval.',
        'Secrets, permissions, and irreversible actions need policy and approval.',
      ],
      [
        'Output проверяется независимыми evidence/gates.',
        'Output is checked with independent evidence/gates.',
      ],
    ],
    source: [
      'NIST AI Risk Management Framework',
      'https://www.nist.gov/itl/ai-risk-management-framework',
    ],
  },
  {
    id: 'rails-node-analogies',
    title: ['Rails: справочник для Node.js инженера', 'Rails reference for Node.js engineers'],
    goal: [
      'Сопоставить Rails-механизмы с Node.js/TypeScript без включения Rails в основной трек.',
      'Map Rails mechanisms to Node.js/TypeScript without making Rails part of the core track.',
    ],
    category: 'rails',
    priority: 'P2',
    concepts: ['rack', 'active-record', 'callbacks', 'active-job', 'sidekiq', 'service-object'],
    theory: [
      'Rack похож на middleware contract request→response; Rails — opinionated framework поверх него. ActiveRecord callbacks before_save/after_save работают вокруг persistence, after_commit — после commit текущей transaction. ActiveJob — abstraction, Sidekiq — Redis-backed backend. includes/preload/eager_load управляют N+1; find_each/find_in_batches обрабатывают bounded batches. Service/Form/Policy/Decorator objects разделяют orchestration, validation, authorization и presentation.',
      'Rack resembles a request→response middleware contract; Rails is an opinionated framework above it. ActiveRecord before_save/after_save run around persistence, while after_commit runs after the current transaction commits. ActiveJob is an abstraction and Sidekiq a Redis-backed backend. includes/preload/eager_load address N+1; find_each/find_in_batches process bounded batches. Service/Form/Policy/Decorator objects separate orchestration, validation, authorization, and presentation.',
    ],
    steps: [
      [
        'Rack middleware ↔ Express/Nest middleware',
        'ActiveRecord ↔ ORM/data mapper',
        'after_commit ↔ transaction hook/outbox trigger',
        'ActiveJob/Sidekiq ↔ queue adapter/worker',
        'Policy/Decorator ↔ authz/presenter',
      ],
      [
        'Rack middleware ↔ Express/Nest middleware',
        'ActiveRecord ↔ ORM/data mapper',
        'after_commit ↔ transaction hook/outbox trigger',
        'ActiveJob/Sidekiq ↔ queue adapter/worker',
        'Policy/Decorator ↔ authz/presenter',
      ],
    ],
    practice: [
      'Rails callback отправляет email в after_save и создаёт дубли. Перепроектируйте и назовите Node.js аналог.',
      'A Rails after_save callback sends email and creates duplicates. Redesign it and name the Node.js analogue.',
    ],
    hints: [
      'after_save ещё внутри transaction; after_commit решает ghost side effect, но не commit→enqueue loss; outbox надёжнее.',
      'after_save is still inside the transaction; after_commit avoids a ghost effect but not commit→enqueue loss; outbox is stronger.',
    ],
    solution: [
      'Убрать network side effect из model callback. Минимум — after_commit enqueue ActiveJob/Sidekiq с stable job key; надёжно — message+outbox в transaction, relay и идемпотентный job. Node/Nest аналог: application service + DB transaction + outbox table + BullMQ/queue worker. includes/preload выбирать по нужной SQL semantics, batches — с checkpoint/idempotency.',
      'Remove the network side effect from the model callback. At minimum enqueue ActiveJob/Sidekiq after_commit with a stable job key; robustly write an outbox row in the transaction and use an idempotent worker. Node/Nest analogue: application service + DB transaction + outbox table + BullMQ/queue worker. Choose eager-loading methods by SQL semantics and make batches resumable/idempotent.',
    ],
    pitfalls: [
      'Ошибки: callback со скрытым I/O; считать after_commit atomic с Redis; includes без просмотра SQL; class proliferation. Follow-up: callback ordering, Sidekiq retries, transaction nesting.',
      'Mistakes: callbacks with hidden I/O; treating after_commit and Redis as atomic; includes without inspecting SQL; class proliferation. Follow-ups: callback ordering, Sidekiq retries, nested transactions.',
    ],
    check: [
      'Чем after_commit лучше after_save и чего он не гарантирует?',
      'Why is after_commit better than after_save, and what does it not guarantee?',
    ],
    criteria: [
      [
        'Не запускается для rolled-back transaction.',
        'It does not run for a rolled-back transaction.',
      ],
      [
        'Не делает enqueue атомарным с DB commit.',
        'It does not make enqueue atomic with the DB commit.',
      ],
    ],
    source: [
      'Rails Guides — Active Record Callbacks',
      'https://guides.rubyonrails.org/active_record_callbacks.html',
    ],
  },
];

export const seniorLearningSessions = specs.map((spec) => ({
  id: spec.id,
  version: 1,
  title: l(...spec.title),
  goal: l(...spec.goal),
  category: spec.category,
  priority: spec.priority,
  tags: [spec.category, spec.priority.toLowerCase(), ...spec.concepts.slice(0, 2)],
  difficulty: 'senior' as const,
  estimatedMinutes: 18,
  cards: [
    {
      id: 'theory',
      kind: 'concept' as const,
      title: l('Краткая теория', 'Concise theory'),
      body: l(...spec.theory),
      estimatedMinutes: 3,
    },
    {
      id: 'mechanism',
      kind: 'diagram' as const,
      title: l('Механизм', 'Mechanism'),
      body: l(
        'Пройдите схему и назовите границы и сбои.',
        'Follow the flow and identify boundaries and failures.',
      ),
      estimatedMinutes: 3,
      diagram: {
        steps: spec.steps[0].map((ru, index) => l(ru, spec.steps[1][index] ?? ru)),
        alternative: l(spec.steps[0].join(' → '), spec.steps[1].join(' → ')),
      },
    },
    {
      id: 'practice',
      kind: 'mini-task' as const,
      title: l('Практическая задача', 'Practical task'),
      body: l(...spec.practice),
      details: l(...spec.hints),
      estimatedMinutes: 3,
    },
    {
      id: 'solution',
      kind: 'answer' as const,
      title: l('Эталонный разбор', 'Reference solution'),
      body: l(
        'Сначала сформулируйте своё решение, затем раскройте эталон.',
        'State your solution before revealing the reference.',
      ),
      details: l(...spec.solution),
      estimatedMinutes: 3,
    },
    {
      id: 'pitfalls',
      kind: 'pitfall' as const,
      title: l('Ошибки и Senior follow-ups', 'Pitfalls and senior follow-ups'),
      body: l(...spec.pitfalls),
      estimatedMinutes: 2,
    },
    {
      id: 'check',
      kind: 'self-check' as const,
      title: l('Самопроверка', 'Self-check'),
      body: l(
        'Ответьте за 60–90 секунд и сравните с критериями.',
        'Answer in 60–90 seconds and compare with the criteria.',
      ),
      estimatedMinutes: 3,
      assessment: {
        question: l(...spec.check),
        criteria: spec.criteria.map(([ru, en]) => l(ru, en)),
      },
    },
  ],
  sourceTopicIds: [],
  sourceExerciseIds: [],
  prerequisiteSessionIds: spec.prerequisites ?? [],
  relatedSessionIds: spec.related ?? [],
  conceptIds: spec.concepts,
  reviewPolicy,
  sources: [{ title: spec.source[0], url: spec.source[1] }],
  updatedAt: '2026-11-15',
}));
