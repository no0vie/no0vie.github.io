export const architectureExercises = [
  {
    id: '13',
    slug: 'frontend-security-review',
    category: 'security',
    difficulty: 'senior',
    estimatedMinutes: 75,
    tags: ['XSS', 'CSRF', 'CSP', 'cookies', 'authentication', 'security review'],
    runtime: 'browser',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Security review фронтенд-приложения',
        description:
          'Проведите системный review клиентского приложения: от источников недоверенных данных до браузерных политик и серверных границ защиты.',
        problem:
          'Вы ревьюите SPA с авторизацией, комментариями, предпросмотром пользовательского HTML, загрузкой изображений и ссылками на внешние сайты. Access token сохраняется в localStorage, HTML вставляется напрямую, изменение профиля выполняется cookie-аутентифицированным POST-запросом, а внешняя ссылка открывается через window.open. Составьте модель угроз, найдите уязвимости, предложите безопасный дизайн и объясните, какие гарантии невозможно обеспечить только средствами фронтенда.',
        examples: [
          'Комментарий `<img src=x onerror=fetch(...)>` не должен исполнять код после отображения или повторной загрузки.',
          'Внешняя страница, открытая в новой вкладке, не должна получать доступ к `window.opener` исходного приложения.',
          'Запрос изменения email должен требовать серверной CSRF-защиты и повторной проверки полномочий.',
        ],
        requirements: [
          'Постройте модель потоков данных: источники ввода, DOM-sinks, сетевые запросы, хранилища, iframe, загрузки и внешняя навигация; для каждой границы укажите владельца проверки.',
          'Разберите reflected, stored и DOM XSS, небезопасный `innerHTML`/`dangerouslySetInnerHTML`, контекстное экранирование и санитизацию; предложите безопасные DOM API или проверенный allowlist-санитайзер.',
          'Опишите CSRF-защиту для cookie-аутентификации: SameSite как дополнительный барьер, CSRF-токен или проверка Origin/Fetch Metadata на сервере и запрет изменения состояния через GET.',
          'Составьте CSP без `unsafe-inline` и `unsafe-eval`, с nonce/hash для необходимых скриптов, ограниченными `script-src`, `connect-src`, `img-src`, `frame-ancestors`, `base-uri` и `object-src`; рассмотрите report-only rollout и Trusted Types.',
          'Сравните HttpOnly Secure SameSite cookie с хранением bearer-токена в localStorage/sessionStorage/памяти и объясните последствия XSS, CSRF, обновления и выхода.',
          'Закройте небезопасную внешнюю навигацию: проверка схемы и назначения по allowlist, `noopener,noreferrer`, недоверие к redirect-параметрам и запрет `javascript:` URL.',
          'Явно отделите frontend hardening от обязательных серверных мер: авторизации каждого действия, валидации, ротации сессий, лимитов, журналирования и безопасных заголовков.',
        ],
        hints: [
          'Начните не со списка заголовков, а с инвентаризации недоверенных данных и опасных sinks: HTML, URL, script, style, DOM-атрибуты, postMessage и сетевые мутации.',
          'Разделите угрозы по месту контроля: браузер может уменьшить поверхность атаки, но только сервер способен подтвердить личность, полномочия, CSRF-токен и допустимость изменения состояния.',
          'Предложите эшелонированную защиту: безопасный рендеринг по умолчанию, строгая санитизация исключений, CSP и Trusted Types как containment, защищённая cookie-сессия и серверный аудит.',
        ],
        solution: {
          blocks: [
            {
              label: 'Чек-лист и безопасные альтернативы',
              language: 'text',
              code: `1. DATA FLOW
- Mark every value from URL, API, storage, postMessage and user input as untrusted.
- Prefer textContent and framework text interpolation; never concatenate HTML.
- If rich HTML is a product requirement, sanitize with a maintained allowlist policy,
  forbid scripts/event attributes/dangerous URLs, and sanitize again on the server.

2. SESSION AND REQUESTS
- Prefer an opaque session or refresh credential in an HttpOnly; Secure; SameSite cookie.
- Keep short-lived access material in memory when the architecture requires bearer tokens.
- For cookie-authenticated mutations require a server-issued CSRF token and validate
  Origin or Fetch Metadata; SameSite alone is not the complete defense.
- Re-authorize every object and action on the server.

3. BROWSER POLICY
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-<per-response-random-value>';
  object-src 'none'; base-uri 'none'; frame-ancestors 'none';
  connect-src 'self' https://api.example.invalid;
  img-src 'self' data: https:;
  require-trusted-types-for 'script'

4. NAVIGATION
- Parse with URL, permit only https: and approved hosts where restriction is required.
- Use <a target="_blank" rel="noopener noreferrer"> or window.open(..., '_blank', 'noopener').
- Validate redirect destinations on the server; reject javascript:, data: and credentials.

5. SERVER CONTROLS
- Validate canonical input, authorize per resource, rotate/revoke sessions, rate-limit,
  log security events, set security headers, scan uploads and encode output by context.`,
            },
          ],
          alternative: [
            'Если приложению не нужен rich text, хранить и выводить только обычный текст — более сильная и простая альтернатива санитизации HTML.',
            'BFF с серверной сессией и HttpOnly cookie уменьшает доступ JavaScript к секретам; OAuth/OIDC с Authorization Code + PKCE нужен для публичного клиента, но PKCE не нейтрализует XSS.',
            'Строгая nonce-based CSP предпочтительнее разрешения inline-скриптов; hash-based CSP подходит стабильным статическим фрагментам, а Trusted Types дополнительно ограничивает DOM XSS sinks.',
          ],
        },
        explanation: [
          'XSS — это нарушение границы выполнения кода. Экранирование зависит от контекста: HTML-текст, атрибут, URL, CSS и JavaScript требуют разных правил. Современный фреймворк безопасно интерполирует текст, пока разработчик не обходит механизм через raw HTML, небезопасную работу с DOM или URL. Санитизация нужна именно когда сохранение разметки является требованием; регулярные выражения не являются HTML-санитайзером. CSP и Trusted Types уменьшают ущерб и блокируют классы sinks, но не исправляют уже доверенный вредоносный код и не заменяют удаление источника XSS.',
          'HttpOnly cookie скрывает credential от прямого чтения JavaScript, но браузер прикладывает cookie автоматически, поэтому нужны CSRF-контроли. SameSite полезен, но зависит от режима, схемы навигации и браузера; сервер должен проверять непредсказуемый токен и/или достоверный Origin/Fetch Metadata. Bearer-токен в localStorage переживает перезагрузку и удобен, но любая XSS может прочитать и унести его. Токен в памяти сокращает окно кражи, но не мешает активному XSS выполнять запросы от имени пользователя.',
          'Frontend-only меры недостаточны: атакующий может вызвать API без интерфейса, изменить клиентский код или повторить запрос. Сервер обязан валидировать и нормализовать данные, проверять аутентификацию и объектную авторизацию на каждом действии, ограничивать запросы, управлять сроком жизни сессии и формировать CSP/Set-Cookie. Клиентская проверка улучшает UX и снижает случайные ошибки, но не является границей доверия.',
        ],
        edgeCases: [
          'Санитизированный HTML позже модифицируется плагином или вставляется в другой контекст; мутационная XSS возвращает опасный атрибут или URL, поэтому результат нельзя повторно конкатенировать.',
          'Разрешённый URL содержит `javascript:`, Unicode/punycode-двойника, userinfo (`trusted.example@evil.example`) или open redirect на разрешённом хосте; сравнивать нужно разобранные scheme/hostname и защищать конечный redirect.',
          'Cookie с `SameSite=Lax` всё ещё отправляется в некоторых top-level навигациях, поддомены могут считаться same-site, а компрометированный sibling domain меняет модель угроз.',
          'CSP ломает legacy inline-обработчики или сторонний виджет; сначала собирают report-only отчёты, удаляют зависимости и лишь затем включают enforcement без широких исключений.',
          'Пользователь выходит в одной вкладке, но украденный или уже выданный токен остаётся действительным; нужны серверная ревокация/ротация и согласование вкладок без передачи секрета.',
        ],
        complexity: [
          'Review масштабируется по числу потоков данных, sinks, endpoint-ов и внешних интеграций; автоматический поиск сокращает инвентаризацию, но ручная проверка контекста остаётся обязательной.',
          'Строгая CSP, отказ от raw HTML и BFF уменьшают поверхность атаки ценой миграции legacy-кода, ограничений сторонних скриптов и дополнительной серверной инфраструктуры.',
        ],
        followUps: [
          'Как безопасно мигрировать большую кодовую базу на Trusted Types и строгую CSP, не добавляя глобальную policy, которая просто возвращает исходную строку?',
          'Как изменится дизайн для нескольких поддоменов, embedded iframe и федеративного входа через OIDC?',
          'Какие security-события следует логировать, как не записать токены/PII и как связать клиентский CSP report с серверным расследованием?',
          'Как защищать загрузку SVG/HTML-файлов, предпросмотр и Content-Disposition, если пользовательский контент раздаётся через CDN?',
        ],
        production: [
          'Вводите CSP через Report-Only, наблюдайте нарушения, затем ужесточайте директивы; отчёты фильтруйте от шума и не включайте в них чувствительные URL. Добавьте SAST/линтеры для опасных sinks, dependency scanning и тесты security headers.',
          'Проводите threat modeling при изменении потоков данных, периодически тестируйте XSS/CSRF/IDOR независимо от UI, управляйте сроком и ротацией ключей/сессий, подготовьте процедуру отзыва credential и incident response.',
          'Компромисс: сторонние скрипты ускоряют интеграцию, но выполняются с полномочиями origin. Изолируйте их в sandboxed iframe или удаляйте; SRI помогает только неизменяемым cross-origin ресурсам и не ограничивает полномочия корректно загруженного скрипта.',
        ],
        furtherReading: [
          {
            label: 'OWASP Cross Site Scripting Prevention Cheat Sheet',
            url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html',
          },
          {
            label: 'OWASP CSRF Prevention Cheat Sheet',
            url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html',
          },
          {
            label: 'MDN Content Security Policy',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
          },
        ],
      },
      en: {
        title: 'Frontend application security review',
        description:
          'Perform a systematic client security review, from untrusted data sources to browser policies and server-side trust boundaries.',
        problem:
          'You are reviewing an authenticated SPA with comments, user-supplied HTML previews, image uploads, and links to external sites. The access token is persisted in localStorage, HTML is inserted directly, profile changes use cookie-authenticated POST requests, and external links are opened with window.open. Build a threat model, identify vulnerabilities, propose a safer design, and explain which guarantees cannot be provided by frontend code alone.',
        examples: [
          'A comment such as `<img src=x onerror=fetch(...)>` must not execute code when first rendered or loaded again.',
          'An external page opened in a new tab must not gain control of the source application through `window.opener`.',
          'Changing an email address must require server-side CSRF protection and fresh authorization checks.',
        ],
        requirements: [
          'Map data flows across input sources, DOM sinks, requests, storage, iframes, uploads, and external navigation; assign an owner to every validation boundary.',
          'Cover reflected, stored, and DOM XSS, unsafe `innerHTML`/`dangerouslySetInnerHTML`, contextual output encoding, and sanitization; propose safe DOM APIs or a maintained allowlist sanitizer.',
          'Design CSRF protection for cookie authentication: SameSite as defense in depth, a CSRF token or server-side Origin/Fetch Metadata checks, and no state changes through GET.',
          'Define a CSP without `unsafe-inline` or `unsafe-eval`, using nonces/hashes where scripts are necessary and constraining `script-src`, `connect-src`, `img-src`, `frame-ancestors`, `base-uri`, and `object-src`; include report-only rollout and Trusted Types.',
          'Compare an HttpOnly Secure SameSite cookie with bearer tokens in localStorage, sessionStorage, or memory, including XSS, CSRF, refresh, and logout consequences.',
          'Harden external navigation with scheme and destination allowlists, `noopener,noreferrer`, distrust of redirect parameters, and rejection of `javascript:` URLs.',
          'Explicitly separate frontend hardening from mandatory server controls: authorization per action, validation, session rotation, rate limits, audit logging, and security headers.',
        ],
        hints: [
          'Start with untrusted data and dangerous sinks rather than a header checklist: HTML, URL, script, style, DOM attributes, postMessage, and state-changing requests.',
          'Assign controls to the correct boundary: the browser can reduce attack surface, but only the server can verify identity, authorization, CSRF evidence, and whether state may change.',
          'Propose defense in depth: safe rendering by default, strict sanitization for exceptional rich content, CSP and Trusted Types for containment, protected cookie sessions, and server auditing.',
        ],
        solution: {
          blocks: [
            {
              label: 'Review checklist and safer alternatives',
              language: 'text',
              code: `1. DATA FLOW
- Treat values from URLs, APIs, storage, postMessage and users as untrusted.
- Prefer textContent and framework text interpolation; do not concatenate HTML.
- If rich HTML is required, use a maintained allowlist sanitizer, reject scripts,
  event handlers and dangerous URLs, and independently sanitize on the server.

2. SESSION AND REQUESTS
- Prefer an opaque session or refresh credential in an HttpOnly; Secure; SameSite cookie.
- Keep short-lived access material in memory when bearer tokens are required.
- For cookie-authenticated mutations, validate a server-issued CSRF token and
  Origin or Fetch Metadata. SameSite is not a complete CSRF defense.
- Re-authorize each action and resource on the server.

3. BROWSER POLICY
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-<per-response-random-value>';
  object-src 'none'; base-uri 'none'; frame-ancestors 'none';
  connect-src 'self' https://api.example.invalid;
  img-src 'self' data: https:;
  require-trusted-types-for 'script'

4. NAVIGATION
- Parse with URL; allow only https: and approved hosts where restriction is required.
- Use <a target="_blank" rel="noopener noreferrer"> or window.open(..., '_blank', 'noopener').
- Validate final redirects server-side; reject javascript:, data: and URL credentials.

5. SERVER CONTROLS
- Canonicalize and validate input, authorize resources, rotate/revoke sessions,
  rate-limit, log security events, set headers, scan uploads, and encode by context.`,
            },
          ],
          alternative: [
            'If the product does not require rich text, storing and rendering plain text is stronger and simpler than attempting to sanitize HTML.',
            'A BFF with a server-side session and HttpOnly cookie reduces JavaScript access to credentials; OAuth/OIDC Authorization Code with PKCE is appropriate for a public client, but PKCE does not neutralize XSS.',
            'A strict nonce-based CSP is preferable to allowing inline script; hash-based CSP suits stable static fragments, while Trusted Types additionally restricts DOM XSS sinks.',
          ],
        },
        explanation: [
          'XSS is a code-execution boundary failure. Encoding is contextual: HTML text, attributes, URLs, CSS, and JavaScript have different rules. A modern framework safely interpolates text until code bypasses it with raw HTML, unsafe DOM manipulation, or unsafe URLs. Sanitization is appropriate only when preserving markup is a requirement; regular expressions are not HTML sanitizers. CSP and Trusted Types contain classes of mistakes, but they neither make already trusted malicious code safe nor replace removal of the XSS source.',
          'An HttpOnly cookie prevents direct credential reads from JavaScript, but the browser attaches it automatically, so CSRF controls remain necessary. SameSite helps but depends on mode, navigation, site boundaries, and browser behavior; the server should verify an unpredictable token and/or a trustworthy Origin or Fetch Metadata signal. A localStorage bearer survives reloads but any XSS can exfiltrate it. An in-memory token narrows the theft window, yet active XSS can still issue authorized requests.',
          'Frontend-only measures are insufficient because an attacker can call the API without the UI, alter client code, or replay a request. The server must canonicalize and validate data, authenticate and authorize every object and action, rate-limit, manage session lifetime, and emit CSP/Set-Cookie headers. Client validation improves usability and catches accidents; it is not a trust boundary.',
        ],
        edgeCases: [
          'Sanitized HTML is later changed by a plugin or inserted into a different context; mutation XSS restores a dangerous attribute or URL, so sanitized output must not be concatenated again.',
          'An allowed URL uses `javascript:`, a Unicode/punycode lookalike, userinfo (`trusted.example@evil.example`), or an open redirect on an allowed host; compare parsed scheme/hostname and secure the final redirect.',
          'A `SameSite=Lax` cookie may still be sent on some top-level navigations, subdomains can be same-site, and a compromised sibling domain changes the threat model.',
          'A new CSP breaks legacy inline handlers or a vendor widget; collect report-only violations, remove dependencies, and then enforce rather than adding broad exceptions.',
          'Logout occurs in one tab while a stolen or previously issued token remains valid; use server revocation/rotation and coordinate tabs without broadcasting secrets.',
        ],
        complexity: [
          'Review effort scales with data flows, sinks, endpoints, and third-party integrations; automated discovery helps inventory them, but contextual manual review remains necessary.',
          'Strict CSP, avoiding raw HTML, and a BFF reduce attack surface at the cost of legacy migration, vendor limitations, and additional server infrastructure.',
        ],
        followUps: [
          'How would you migrate a large application to Trusted Types and strict CSP without adding a global policy that simply returns its input?',
          'How does the design change for multiple subdomains, embedded iframes, and federated OIDC login?',
          'Which security events should be logged, how do you avoid logging tokens or PII, and how do you correlate a client CSP report with server investigation?',
          'How should SVG/HTML uploads, previews, and Content-Disposition be handled when user content is served through a CDN?',
        ],
        production: [
          'Roll CSP out through Report-Only, observe violations, and then tighten enforcement; filter noisy reports and avoid sensitive URLs in reports. Add static checks for dangerous sinks, dependency scanning, and tests for security headers.',
          'Threat-model data-flow changes, test XSS/CSRF/IDOR independently of the UI, rotate keys and sessions, and maintain credential-revocation and incident-response procedures.',
          'Tradeoff: third-party scripts speed integration but execute with origin authority. Isolate them in sandboxed iframes or remove them; SRI only helps immutable cross-origin resources and does not constrain a correctly loaded script.',
        ],
        furtherReading: [
          {
            label: 'OWASP Cross Site Scripting Prevention Cheat Sheet',
            url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html',
          },
          {
            label: 'OWASP CSRF Prevention Cheat Sheet',
            url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html',
          },
          {
            label: 'MDN Content Security Policy',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
          },
        ],
      },
    },
  },
  {
    id: '14',
    slug: 'resumable-large-file-upload',
    category: 'architecture',
    difficulty: 'senior',
    estimatedMinutes: 90,
    tags: ['upload', 'resumable', 'chunks', 'object storage', 'integrity'],
    runtime: 'browser',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Возобновляемая загрузка большого файла',
        description:
          'Спроектируйте устойчивый протокол chunked upload с паузой, восстановлением после перезагрузки, контролем целостности и безопасной финализацией.',
        problem:
          'Нужно загрузить из браузера файл, который может быть значительно больше доступной памяти и загружается через нестабильную сеть. Пользователь должен видеть подтверждённый прогресс, ставить загрузку на паузу, продолжать её после потери сети или перезагрузки страницы и безопасно повторять запросы. Спроектируйте клиент, API управления upload session, прямую передачу частей в object storage и атомарную финализацию без предположений о конкретном размере файла или скорости сети.',
        examples: [
          'После обрыва на нескольких отправленных частях клиент спрашивает сервер о подтверждённых part numbers и передаёт только отсутствующие.',
          'Повтор одного и того же chunk с тем же номером и checksum не создаёт дубликат и возвращает прежний результат.',
          'Кнопка отмены останавливает новые запросы, прерывает активные и инициирует серверную очистку незавершённой multipart-сессии.',
        ],
        requirements: [
          'Опишите выбор файла, стабильный fingerprint без чтения файла целиком, создание upload session и сохранение только несекретных метаданных для восстановления.',
          'Покройте разбиение через `Blob.slice`, адаптивный размер частей, ограниченный параллелизм, backpressure, паузу/продолжение/отмену и подтверждённый сервером прогресс.',
          'Спроектируйте idempotent API или presigned multipart URLs, part numbers, checksums, retry с exponential backoff и jitter, обработку 401/403/409/429/5xx и обновление истёкших URL.',
          'Объясните восстановление после reload/offline: повторный выбор файла, проверка fingerprint/метаданных, сверка состояния с сервером и повтор только отсутствующих или повреждённых частей.',
          'Опишите проверку целостности каждой части и всего объекта, атомарную complete-операцию, защиту от гонок finalization и публикацию файла только после проверки/сканирования.',
          'Рассмотрите безопасность: авторизация upload session, ограничения типа/размера/квоты на сервере, безопасное имя и Content-Type, CORS, короткоживущие URL, malware scan и отсутствие credential в IndexedDB.',
          'Опишите lifecycle незавершённых загрузок, сборку мусора, наблюдаемость, доступность, browser limits и fallback, если streaming/hash API недостаточны.',
        ],
        starterCode: {
          label: 'Контракт планировщика',
          language: 'typescript',
          code: `type UploadPart = { number: number; start: number; end: number; checksum: string };
type ConfirmedPart = { number: number; checksum: string; storageTag: string };

interface UploadCoordinator {
  pause(): void;
  resume(): void;
  cancel(): Promise<void>;
  reconcile(): Promise<readonly ConfirmedPart[]>;
}`,
        },
        hints: [
          'Сначала отделите control plane от data plane: ваш API владеет сессией, правами и финализацией, а байты могут идти напрямую в object storage по короткоживущим URL.',
          'Прогресс считайте подтверждёнными сервером байтами, а не суммой `progress` активных запросов: при retry временные байты иначе будут учтены повторно.',
          'Сделайте номер части и checksum частью идемпотентности; после reload серверное состояние является источником истины, а локальная запись лишь помогает найти сессию.',
        ],
        solution: {
          blocks: [
            {
              label: 'Последовательность загрузки',
              language: 'mermaid',
              code: `sequenceDiagram
    actor U as User
    participant B as Browser
    participant A as Upload API
    participant S as Object storage
    participant W as Scanner worker
    U->>B: Select file
    B->>A: Create session (metadata, fingerprint)
    A-->>B: Session id and part upload grants
    loop Missing parts with bounded concurrency
        B->>S: PUT part number + checksum
        S-->>B: Storage tag / receipt
        B->>A: Confirm part receipt
        A-->>B: Durable confirmed state
    end
    B->>A: Complete(session, ordered receipts, whole checksum)
    A->>S: Atomically complete multipart object
    S-->>A: Object version
    A->>W: Validate and scan quarantined object
    W-->>A: Passed or rejected
    A-->>B: Published file or actionable failure`,
            },
            {
              label: 'Доступное текстовое описание последовательности',
              language: 'text',
              code: `1. Пользователь повторно выбирает локальный файл; браузер вычисляет ограниченный fingerprint.
2. Upload API создаёт авторизованную сессию и выдаёт короткоживущие разрешения на части.
3. Браузер режет Blob без загрузки всего файла в память и отправляет отсутствующие части
   в object storage с ограниченным параллелизмом и checksum.
4. После каждой успешной передачи браузер сообщает receipt API; только это двигает durable progress.
5. При восстановлении браузер запрашивает подтверждённые части и повторяет отсутствующие.
6. Complete передаёт упорядоченные receipts и checksum; API ровно один раз завершает multipart object.
7. Объект остаётся в карантине до проверки целостности и malware scan, затем публикуется
   либо сессия получает безопасную, пригодную для повторения ошибку.`,
            },
            {
              label: 'Состояния сессии',
              language: 'text',
              code: `created -> uploading <-> paused
uploading -> finalizing -> quarantined -> available
     |             |             |
     +----------> failed <-------+
created/uploading/paused -> cancelled
expired sessions -> garbage collection`,
            },
          ],
          alternative: [
            'Стандарт tus даёт совместимый resumable-протокол и offset-based восстановление; собственный multipart-протокол оправдан, когда требуется тесная интеграция с конкретным object storage и его checksums.',
            'Проксирование всех байтов через application server упрощает единую авторизацию и сканирование потока, но увеличивает нагрузку, стоимость и число отказов; direct-to-storage требует аккуратных CORS и краткоживущих grants.',
            'Последовательная загрузка проще и предсказуемее; ограниченный параллелизм лучше использует сеть, но расходует память, усложняет pause/retry и может ухудшить работу на слабом соединении.',
          ],
        },
        explanation: [
          'Клиент хранит `sessionId`, fingerprint, параметры частей и подтверждённые номера в IndexedDB, но не presigned URLs и не credential. Fingerprint может сочетать имя, размер, lastModified и хеш выбранных диапазонов; это не доказательство идентичности и не security check. После reload пользователь заново предоставляет File (если File System Access handle недоступен или не разрешён), клиент сравнивает метаданные, а сервер возвращает канонический список частей. `Blob.slice` и инкрементальный hash в worker ограничивают память и не блокируют основной поток.',
          'Планировщик держит небольшое динамическое число запросов, учитывает `navigator.onLine` только как подсказку и реагирует на фактические ошибки. Retry допустим для идемпотентной передачи части; backoff с jitter и `Retry-After` предотвращает синхронный шторм. 401/403 означает обновить grant или права, 409 — сверить сессию/checksum, 429 — замедлиться, retryable 5xx/сетевой сбой — повторить, а постоянная 4xx-ошибка требует остановки и понятного сообщения.',
          'Finalization — серверная операция compare-and-set: только владелец активной сессии может передать полный упорядоченный manifest. Сервер сверяет количество, диапазоны, receipts и checksums, завершает multipart upload один раз и сохраняет результат для повторного complete. Файл сначала закрыт в quarantine; MIME определяется по содержимому, имя нормализуется только для отображения, а публикация происходит после проверки. Whole-file hash обеспечивает end-to-end integrity, когда платформа и браузер позволяют вычислить его потоково.',
        ],
        edgeCases: [
          'Файл с теми же именем, размером и lastModified имеет другое содержимое; sampled fingerprint совпал случайно, поэтому checksum частей/объекта обнаруживает подмену до публикации.',
          'Ответ на PUT потерян после сохранения части: retry с тем же part number/checksum должен вернуть эквивалентный receipt, а reconciliation — увидеть часть.',
          'Presigned URL истёк посреди загрузки или часы клиента неверны; клиент запрашивает новый grant, не создавая новую сессию и не повторяя уже подтверждённые части.',
          'Две вкладки восстанавливают одну сессию и одновременно отправляют/finalize; lease или optimistic version предотвращает конфликт, а идемпотентный complete возвращает сохранённый результат.',
          'Последняя часть меньше остальных, файл нулевой длины, storage требует минимальный размер non-final parts или лимитирует число частей; сервер выбирает допустимый layout до передачи.',
          'Пользователь отменяет во время finalization или закрывает вкладку; серверная state machine определяет, можно ли abort, а lifecycle rule очищает зависшие multipart parts после TTL.',
        ],
        complexity: [
          'Клиент читает и передаёт O(n) байт; память ограничена примерно числом одновременно активных частей и буферами хеширования, а не размером всего файла.',
          'Больше и параллельнее части уменьшают относительные накладные расходы, но увеличивают стоимость retry и пиковую память; маленькие части точнее возобновляются, но создают больше запросов и metadata.',
        ],
        followUps: [
          'Как выбрать и динамически менять размер части и concurrency, не нарушив ограничения multipart API и воспроизводимость после reload?',
          'Как обеспечить дедупликацию по content hash, не раскрывая существование чужого файла и не создавая cross-tenant oracle?',
          'Как проектировать upload session для multi-region object storage, регионального сбоя и повторной finalization без split-brain?',
          'Когда Service Worker или Background Sync действительно помогут и какие browser/OS ограничения не позволяют обещать фоновую загрузку?',
        ],
        production: [
          'Метрики разделяют выбранные, активные, приостановленные, завершённые, отменённые и просроченные сессии; отдельно наблюдаются latency/retry по частям, причины ошибок, возраст незавершённых multipart upload и очередь сканирования. Логи содержат correlation/session ID, но не presigned URL или имя файла с PII.',
          'Lifecycle policy удаляет просроченные части и quarantine-объекты, а reconciler чинит расхождение базы с storage. Квоты резервируются при создании и освобождаются идемпотентно; complete/cancel защищены optimistic locking.',
          'Отказы должны быть явными: недоступность API не должна стирать локальную запись, недоступность storage ставит scheduler на паузу, ошибка checksum повторяет ограниченное число раз, провал сканирования не публикует объект. UX сообщает, нужен ли повторный выбор файла или действие пользователя.',
        ],
        furtherReading: [
          {
            label: 'MDN Blob.slice',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice',
          },
          {
            label: 'tus resumable upload protocol',
            url: 'https://tus.io/protocols/resumable-upload',
          },
          {
            label: 'MDN AbortController',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
          },
        ],
      },
      en: {
        title: 'Resumable large file upload',
        description:
          'Design a resilient chunked upload protocol with pause, reload recovery, integrity verification, and safe finalization.',
        problem:
          'A browser must upload a file that may be much larger than available memory over an unreliable network. The user needs durable progress, pause, recovery after connectivity loss or page reload, and safe request retries. Design the client, upload-session control API, direct part transfer to object storage, and atomic finalization without assuming a particular file size or network speed.',
        examples: [
          'After a failure with several parts sent, the client asks the server for confirmed part numbers and uploads only what is missing.',
          'Repeating a chunk with the same part number and checksum creates no duplicate and returns the prior result.',
          'Cancel stops scheduling, aborts active requests, and starts server-side cleanup of the incomplete multipart session.',
        ],
        requirements: [
          'Cover file selection, a stable fingerprint without reading the whole file into memory, upload-session creation, and persistence of only non-secret recovery metadata.',
          'Cover `Blob.slice` chunking, adaptive part size, bounded concurrency, backpressure, pause/resume/cancel, and server-confirmed progress.',
          'Design an idempotent API or presigned multipart URLs, part numbers, checksums, exponential backoff with jitter, handling for 401/403/409/429/5xx, and renewal of expired URLs.',
          'Explain reload/offline recovery: reselecting the file, checking its fingerprint and metadata, reconciling with server state, and retrying only missing or corrupt parts.',
          'Define per-part and whole-object integrity checks, atomic completion, protection from finalization races, and publication only after verification and scanning.',
          'Address authorization of the upload session, server-enforced type/size/quota limits, safe names and Content-Type, CORS, short-lived grants, malware scanning, and no credentials in IndexedDB.',
          'Describe lifecycle cleanup for abandoned uploads, observability, accessibility, browser constraints, and fallbacks when streaming or hashing APIs are insufficient.',
        ],
        starterCode: {
          label: 'Scheduler contract',
          language: 'typescript',
          code: `type UploadPart = { number: number; start: number; end: number; checksum: string };
type ConfirmedPart = { number: number; checksum: string; storageTag: string };

interface UploadCoordinator {
  pause(): void;
  resume(): void;
  cancel(): Promise<void>;
  reconcile(): Promise<readonly ConfirmedPart[]>;
}`,
        },
        hints: [
          'Separate the control plane from the data plane: your API owns sessions, authorization, and completion, while bytes can travel directly to object storage through short-lived grants.',
          'Calculate progress from bytes durably confirmed by the server, not by summing progress events from active requests, or retried bytes will be counted twice.',
          'Make part number and checksum part of idempotency; after reload, server state is authoritative and local persistence merely helps locate the session.',
        ],
        solution: {
          blocks: [
            {
              label: 'Upload sequence',
              language: 'mermaid',
              code: `sequenceDiagram
    actor U as User
    participant B as Browser
    participant A as Upload API
    participant S as Object storage
    participant W as Scanner worker
    U->>B: Select file
    B->>A: Create session (metadata, fingerprint)
    A-->>B: Session id and part upload grants
    loop Missing parts with bounded concurrency
        B->>S: PUT part number + checksum
        S-->>B: Storage tag / receipt
        B->>A: Confirm part receipt
        A-->>B: Durable confirmed state
    end
    B->>A: Complete(session, ordered receipts, whole checksum)
    A->>S: Atomically complete multipart object
    S-->>A: Object version
    A->>W: Validate and scan quarantined object
    W-->>A: Passed or rejected
    A-->>B: Published file or actionable failure`,
            },
            {
              label: 'Accessible textual sequence',
              language: 'text',
              code: `1. The user reselects a local file and the browser computes a bounded fingerprint.
2. The Upload API creates an authorized session and issues short-lived part grants.
3. The browser slices the Blob without loading the entire file and sends missing parts
   to object storage with bounded concurrency and checksums.
4. After each transfer, the browser confirms its receipt with the API; only this advances durable progress.
5. On recovery, the browser requests confirmed parts and retries the missing set.
6. Complete submits ordered receipts and a checksum; the API completes the multipart object once.
7. The object remains quarantined until integrity and malware checks pass, then it is
   published, or the session receives a safe and actionable failure.`,
            },
            {
              label: 'Session states',
              language: 'text',
              code: `created -> uploading <-> paused
uploading -> finalizing -> quarantined -> available
     |             |             |
     +----------> failed <-------+
created/uploading/paused -> cancelled
expired sessions -> garbage collection`,
            },
          ],
          alternative: [
            'The tus standard provides an interoperable resumable offset protocol; a custom multipart protocol is justified when tight integration with a storage provider and its checksums is required.',
            'Proxying bytes through the application server centralizes authorization and streaming scans but increases load, cost, and failure points; direct-to-storage requires careful CORS and short-lived grants.',
            'Sequential upload is simpler and predictable; bounded parallelism uses the network better but consumes more memory and complicates pause, retry, and weak-connection behavior.',
          ],
        },
        explanation: [
          'The client persists `sessionId`, fingerprint, part parameters, and confirmed numbers in IndexedDB, but not presigned URLs or credentials. A fingerprint may combine name, size, lastModified, and hashes of selected ranges; it is neither proof of identity nor a security check. After reload the user supplies the File again unless a permitted File System Access handle is available, the client compares metadata, and the server returns the canonical part set. `Blob.slice` and incremental hashing in a worker bound memory and avoid blocking the main thread.',
          'The scheduler maintains a small dynamic request pool, treats `navigator.onLine` only as a hint, and responds to actual failures. Retry is safe for idempotent part transfer; backoff with jitter and `Retry-After` avoids synchronized storms. A 401/403 renews the grant or authorization, 409 triggers session/checksum reconciliation, 429 reduces pressure, retryable 5xx/network failures retry, and permanent 4xx errors stop with actionable feedback.',
          'Finalization is a server-side compare-and-set operation: only the owner of an active session can submit a complete ordered manifest. The server verifies counts, ranges, receipts, and checksums, completes multipart storage once, and stores the result for duplicate complete calls. The file begins private in quarantine; MIME is detected from content, the name is normalized only for display, and publication follows scanning. A whole-file hash provides end-to-end integrity when the platform and browser can compute it incrementally.',
        ],
        edgeCases: [
          'A file has the same name, size, and lastModified but different bytes; a sampled fingerprint collides, so part/object checksums catch the substitution before publication.',
          'A PUT response is lost after the part was stored: retrying the same part number/checksum must return an equivalent receipt, and reconciliation must discover it.',
          'A presigned URL expires mid-upload or the client clock is wrong; request a fresh grant without creating a new session or repeating confirmed parts.',
          'Two tabs recover one session and upload or finalize concurrently; a lease or optimistic version prevents conflict, while idempotent complete returns the stored result.',
          'The final part is shorter, the file is empty, storage enforces a minimum non-final part size, or caps part count; the server chooses a legal layout before transfer.',
          'The user cancels during finalization or closes the tab; the server state machine decides whether abort is legal, and lifecycle rules remove stranded multipart parts after expiry.',
        ],
        complexity: [
          'The client reads and transfers O(n) bytes; memory is bounded by active parts and hashing buffers rather than the entire file size.',
          'Larger and more parallel parts reduce relative overhead but increase retry cost and peak memory; smaller parts resume more precisely but create more requests and metadata.',
        ],
        followUps: [
          'How would you choose and adapt part size and concurrency without violating multipart limits or making reload recovery nondeterministic?',
          'How can content-hash deduplication avoid disclosing another tenant’s file or creating a cross-tenant existence oracle?',
          'How would upload sessions work with multi-region object storage, a regional outage, and retried finalization without split-brain?',
          'When do Service Worker or Background Sync help, and which browser/OS constraints prevent a promise of background upload?',
        ],
        production: [
          'Metrics distinguish selected, active, paused, complete, cancelled, and expired sessions; separately observe part latency/retries, error causes, incomplete multipart age, and scan queue health. Logs carry correlation/session IDs but never presigned URLs or PII-bearing file names.',
          'Lifecycle policies delete expired parts and quarantine objects, while a reconciler repairs database/storage drift. Quotas are reserved at creation and released idempotently; complete and cancel use optimistic locking.',
          'Failures remain explicit: API outage preserves local recovery metadata, storage outage pauses scheduling, repeated checksum mismatch stops after a bound, and scan failure never publishes. The UI announces whether file reselection or another user action is required.',
        ],
        furtherReading: [
          {
            label: 'MDN Blob.slice',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice',
          },
          {
            label: 'tus resumable upload protocol',
            url: 'https://tus.io/protocols/resumable-upload',
          },
          {
            label: 'MDN AbortController',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
          },
        ],
      },
    },
  },
  {
    id: '15',
    slug: 'realtime-messaging-system',
    category: 'architecture',
    difficulty: 'senior',
    estimatedMinutes: 105,
    tags: ['realtime', 'WebSocket', 'offline', 'consistency', 'virtualization'],
    runtime: 'browser',
    hints: [1, 2, 3],
    content: {
      ru: {
        title: 'Архитектура realtime-мессенджера',
        description:
          'Спроектируйте клиент и сервисы сообщений с reconnect, offline outbox, multi-tab координацией, согласованной историей и виртуализированным интерфейсом.',
        problem:
          'Спроектируйте веб-мессенджер для личных и групповых диалогов. Новые сообщения должны появляться без ручного обновления, отправка должна оставаться понятной при нестабильной сети, история — загружаться страницами и не ломать позицию чтения, а несколько вкладок — не создавать лишние соединения и дубли уведомлений. Зафиксируйте допущения, сравните транспорты и определите модель порядка, дедупликации, доставленности, прочтения и offline-синхронизации без обещаний недостижимого exactly-once delivery.',
        examples: [
          'Сообщение с `clientMessageId` сначала отображается как pending, после server ack получает канонический id/sequence и не дублируется после reconnect.',
          'При возвращении онлайн клиент получает события после сохранённого cursor, затем делает gap repair через history API до перехода в live-режим.',
          'При подгрузке старых сообщений сверху виртуализированный список сохраняет видимый anchor, а не прыгает к началу.',
        ],
        requirements: [
          'Сформулируйте допущения о масштабе как переменные, а не выдуманные числа: число активных соединений, fan-out, размер групп, retention, вложения, регионы и допустимая задержка.',
          'Сравните WebSocket, Server-Sent Events и polling/long polling по двунаправленности, прокси, reconnect, backpressure, батарее и fallback; выберите транспорт и отдельный HTTP API истории.',
          'Опишите connection lifecycle: auth без токена в URL, heartbeat, reconnect с backoff/jitter, resume cursor, token refresh, разрыв сессии и flow control.',
          'Определите согласованность: clientMessageId для идемпотентной отправки, server message id, монотонный sequence внутри conversation, at-least-once transport, дедупликация, gap detection и отсутствие глобального порядка.',
          'Покройте optimistic UI, pending/sent/failed/delivered/read, retry/cancel, offline outbox, конфликты редактирования/удаления и семантику delivery/read receipts.',
          'Спроектируйте историю: cursor pagination, новые события во время загрузки старых, кэш, поиск как отдельную возможность, retention/tombstones и восстановление gaps.',
          'Покройте multi-tab через BroadcastChannel/SharedWorker/leader lease, единственного владельца сокета, синхронизацию outbox/cursors и дедупликацию уведомлений с корректным fallback.',
          'Опишите window/variable-height virtualization, anchor preservation, prepend, unread separator, keyboard/screen-reader доступность и управление памятью.',
        ],
        hints: [
          'Разделите durable state и ephemeral signals: сообщения и read cursor требуют хранения, а typing/presence могут теряться и иметь TTL без записи в историю.',
          'Не обещайте exactly once: соедините идемпотентную команду с `clientMessageId`, at-least-once доставку событий, sequence на диалог и reconciliation через HTTP.',
          'Рассматривайте список сообщений как изменяемое окно над cursor-based историей: сохраняйте anchor при prepend и объединяйте страницы/live events по каноническому id и sequence.',
        ],
        solution: {
          blocks: [
            {
              label: 'Архитектура realtime-мессенджера',
              language: 'mermaid',
              code: `flowchart TB
    UI[Virtualized accessible message UI]
    OS[IndexedDB cache and offline outbox]
    TC[Tab coordinator: leader lease / SharedWorker]
    RT[Realtime gateway: WebSocket, SSE fallback]
    API[HTTP history and command API]
    AUTH[Auth/session service]
    MSG[Message service]
    LOG[(Ordered conversation log)]
    BUS[Partitioned event bus]
    FAN[Fan-out and presence service]
    PUSH[Push notification service]

    UI <--> OS
    UI <--> TC
    TC <--> RT
    UI <--> API
    RT --> AUTH
    API --> AUTH
    RT --> MSG
    API --> MSG
    MSG --> LOG
    MSG --> BUS
    BUS --> FAN
    FAN --> RT
    FAN --> PUSH
    API --> LOG`,
            },
            {
              label: 'Доступное текстовое описание архитектуры',
              language: 'text',
              code: `1. Доступный виртуализированный UI читает локальный кэш и записывает команды в offline outbox.
2. Координатор вкладок выбирает владельца realtime-соединения; остальные вкладки обмениваются
   событиями через BroadcastChannel или используют SharedWorker, а при отсутствии поддержки
   каждая вкладка подключается отдельно и всё равно дедуплицирует события.
3. Realtime gateway аутентифицирует сессию, принимает команды и доставляет live events.
4. HTTP API независимо обслуживает cursor-based историю, gap repair и повтор команд.
5. Message service идемпотентно сохраняет команду в упорядоченный лог конкретного диалога.
6. Partitioned event bus передаёт durable events в fan-out; presence и typing идут как
   ephemeral события с TTL. Gateway доставляет их онлайн-клиентам, push покрывает offline.
7. Клиент сливает cache, history и live events по message id/sequence и обновляет read cursor.`,
            },
            {
              label: 'Модель сообщения и sync cursor',
              language: 'typescript',
              code: `type LocalState = 'pending' | 'sent' | 'failed';
type MessageEnvelope = {
  conversationId: string;
  clientMessageId: string;
  messageId?: string;
  sequence?: string;
  body: string;
  localState: LocalState;
};

type SyncCheckpoint = {
  conversationId: string;
  afterSequence: string | null;
};`,
            },
          ],
          alternative: [
            'WebSocket подходит для двунаправленных команд и событий в одном канале. SSE проще для server-to-client, автоматически переподключается и работает поверх HTTP, но отправка идёт отдельным HTTP-запросом и возможны лимиты соединений. Long polling — универсальный fallback, но создаёт больше запросов и задержек.',
            'SharedWorker естественно владеет одним сокетом, но поддержка и lifecycle неодинаковы; BroadcastChannel с leader lease шире применим, но требует fencing token и восстановления после смерти лидера. Отдельный сокет на вкладку — простой безопасный fallback с большей серверной ценой.',
            'Fan-out-on-write ускоряет чтение небольших групп ценой write amplification; fan-out-on-read лучше для очень больших каналов, но усложняет запрос и unread counts. Гибрид выбирается по типу conversation, а не одной политикой для всех.',
          ],
        },
        explanation: [
          'Допущения фиксируются до выбора инфраструктуры: ожидаемые concurrent connections C, средняя частота событий R, распределение размера групп G, retention T, география, размер payload и SLO latency/availability. Capacity model выражает fan-out и storage через эти параметры и измеряется нагрузочным тестом, а не подставляет выдуманные значения. Вложения идут отдельным upload/download контуром; realtime-событие содержит безопасные метаданные и статус обработки, а не большой бинарный payload.',
          'Практическая гарантия — идемпотентная отправка плюс at-least-once события. Клиент создаёт случайный `clientMessageId`; сервер хранит его в scope отправителя/диалога, повтор возвращает тот же message id. Сервис присваивает sequence, монотонный только внутри conversation. Клиент дедуплицирует по message id, обнаруживает пропуск sequence, приостанавливает применение зависимых событий и ремонтирует gap через HTTP. Между диалогами глобального порядка нет; timestamps служат отображению, а не консенсусу.',
          'Outbox в IndexedDB переживает reload: команды имеют состояние, попытки и локальную причинность. После reconnect сначала обновляется auth, затем клиент получает/запрашивает события после cursor, чинит gaps и повторяет идемпотентные команды. Ack означает durable server acceptance, delivered — доставку хотя бы одному устройству получателя согласно определённой политике, read — явное продвижение read cursor; UI не смешивает эти понятия. Edit/delete являются версиями или событиями с expected version, а конфликт приводит к reconciliation, не молчаливому overwrite.',
          'История использует opaque cursor, а не offset: новые записи не сдвигают страницы. Live events буферизуются во время fetch и затем сливаются по id/sequence. Виртуализатор хранит ограниченное окно и измеряет variable heights; перед prepend сохраняет key и offset первого видимого элемента, а после вставки восстанавливает anchor. Для accessibility элементы имеют семантику списка, новые сообщения объявляются ненавязчивым live region без повторного чтения всей ленты, keyboard focus не выбрасывается при unmount, а доступен режим без агрессивной виртуализации.',
        ],
        edgeCases: [
          'Ack потерян, клиент ушёл offline и повторил send: сервер возвращает запись по `clientMessageId`, клиент заменяет pending без второго сообщения.',
          'Live событие с большим sequence пришло раньше history page или edit пришёл раньше create: клиент буферизует, обнаруживает gap и выполняет repair, а не сортирует только по timestamp.',
          'Лидер-вкладка зависла без unload; lease истекает, новый лидер получает больший fencing token, а сервер/координатор игнорирует действия старого владельца.',
          'Пользователь читает с середины, сверху добавляется страница и изображения позже меняют высоту; ResizeObserver корректирует layout относительно anchor, не принудительно прокручивая вниз.',
          'Пользователь отправил offline, затем удалил диалог или потерял права на другом устройстве; replay получает permanent rejection, сохраняет понятную failed-запись и не повторяется бесконечно.',
          'Read receipt с одного устройства опережает локальную историю другого; read cursor монотонно объединяется через max sequence и не откатывается.',
          'Retention удалил сообщения внутри gap: API возвращает новый нижний checkpoint/tombstone, и клиент сбрасывает недостижимый диапазон вместо бесконечного repair.',
        ],
        complexity: [
          'Слияние страницы и live-буфера занимает O(n log n) при общей сортировке или O(n) для уже упорядоченных последовательностей; lookup/dedup хранится в Map с O(1) ожидаемым доступом.',
          'Виртуализация ограничивает DOM размером окна, но кэш и индекс истории требуют собственной eviction policy. Серверный fan-out зависит от размера группы и выбранной write/read модели.',
        ],
        followUps: [
          'Как изменится модель порядка и ключей партиционирования для очень большой группы, и где появятся hot partitions?',
          'Как реализовать end-to-end encryption: multi-device keys, history recovery, search, moderation и push preview, не заявляя несовместимые гарантии?',
          'Как провести безопасный deploy новой версии event schema при старых клиентах, offline outbox и событиях, задержанных в bus?',
          'Как вычислять unread counts и read cursors без write amplification на каждое сообщение и устройство?',
          'Какие метрики отличат проблему gateway, event bus, fan-out, history API и клиентского main thread?',
        ],
        production: [
          'Наблюдайте connection count, reconnect reasons, auth failures, heartbeat timeout, event lag, gap rate/repair outcome, duplicate rate, ack latency, outbox age, history latency и dropped ephemeral events. Correlation связывает command, durable message и delivery event без логирования текста сообщений.',
          'Используйте backpressure: ограничивайте размер send queue, замедляйте/отключайте медленного consumer с resume cursor, коалесцируйте presence/typing и никогда не выбрасывайте durable message молча. Reconnect применяет exponential backoff с jitter и server retry hints.',
          'Отказы: при падении realtime UI остаётся в degraded HTTP/offline режиме; при lag bus история остаётся источником восстановления; при недоступной истории live events буферизуются с жёстким лимитом; при переполнении клиент сбрасывает соединение и делает full resync от checkpoint. Региональный failover требует явной стратегии ownership диалога и допустимой консистентности.',
          'Безопасность и приватность: авторизация проверяется для каждого subscribe/send/history, токены не передаются в query string, payload имеет лимит и схему, rate limits действуют по субъекту и диалогу, push не раскрывает чувствительный текст без согласия, retention и удаление применяются к кэшу и серверу.',
        ],
        furtherReading: [
          {
            label: 'MDN WebSocket API',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket',
          },
          {
            label: 'MDN Server-sent events',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events',
          },
          {
            label: 'MDN BroadcastChannel',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel',
          },
        ],
      },
      en: {
        title: 'Realtime messaging system architecture',
        description:
          'Design a messaging client and services with reconnect, an offline outbox, multi-tab coordination, consistent history, and an accessible virtualized interface.',
        problem:
          'Design a web messenger for direct and group conversations. New messages must appear without manual refresh, sending must remain understandable on unreliable networks, paginated history must preserve reading position, and multiple tabs must avoid unnecessary connections and duplicate notifications. State assumptions, compare transports, and define ordering, deduplication, delivery, read, and offline synchronization semantics without promising unattainable exactly-once delivery.',
        examples: [
          'A message with a `clientMessageId` first appears as pending, receives a canonical id/sequence after server acknowledgement, and is not duplicated after reconnect.',
          'On reconnect the client receives events after its saved cursor, repairs gaps through the history API, and only then enters live mode.',
          'When older messages are prepended, the virtualized list preserves the visible anchor instead of jumping to the beginning.',
        ],
        requirements: [
          'State scale assumptions as variables, not invented figures: active connections, fan-out, group-size distribution, retention, attachments, regions, and acceptable latency.',
          'Compare WebSocket, Server-Sent Events, and polling/long polling across bidirectionality, proxies, reconnect, backpressure, battery use, and fallback; select a transport plus a separate HTTP history API.',
          'Define connection lifecycle: authentication without tokens in URLs, heartbeat, reconnect with backoff/jitter, resume cursor, token refresh, session revocation, and flow control.',
          'Define consistency: clientMessageId for idempotent sends, server message id, monotonic per-conversation sequence, at-least-once transport, deduplication, gap detection, and no global ordering claim.',
          'Cover optimistic UI, pending/sent/failed/delivered/read states, retry/cancel, offline outbox, edit/delete conflicts, and delivery/read-receipt semantics.',
          'Design history with cursor pagination, live arrivals while fetching older pages, caching, search as a separate capability, retention/tombstones, and gap repair.',
          'Cover multi-tab operation through BroadcastChannel, SharedWorker, or a leader lease, with one socket owner, synchronized outbox/cursors, notification deduplication, and a correct fallback.',
          'Explain windowed variable-height virtualization, anchor preservation, prepend, unread markers, keyboard/screen-reader accessibility, and memory management.',
        ],
        hints: [
          'Separate durable state from ephemeral signals: messages and read cursors require storage, while typing and presence may be lossy and expire without entering history.',
          'Do not promise exactly once: combine an idempotent command keyed by `clientMessageId`, at-least-once events, per-conversation sequence, and HTTP reconciliation.',
          'Treat the message list as a mutable window over cursor-based history: preserve an anchor on prepend and merge pages with live events by canonical id and sequence.',
        ],
        solution: {
          blocks: [
            {
              label: 'Realtime messaging architecture',
              language: 'mermaid',
              code: `flowchart TB
    UI[Virtualized accessible message UI]
    OS[IndexedDB cache and offline outbox]
    TC[Tab coordinator: leader lease / SharedWorker]
    RT[Realtime gateway: WebSocket, SSE fallback]
    API[HTTP history and command API]
    AUTH[Auth/session service]
    MSG[Message service]
    LOG[(Ordered conversation log)]
    BUS[Partitioned event bus]
    FAN[Fan-out and presence service]
    PUSH[Push notification service]

    UI <--> OS
    UI <--> TC
    TC <--> RT
    UI <--> API
    RT --> AUTH
    API --> AUTH
    RT --> MSG
    API --> MSG
    MSG --> LOG
    MSG --> BUS
    BUS --> FAN
    FAN --> RT
    FAN --> PUSH
    API --> LOG`,
            },
            {
              label: 'Accessible textual architecture description',
              language: 'text',
              code: `1. The accessible virtualized UI reads the local cache and writes commands to an offline outbox.
2. A tab coordinator elects a realtime-connection owner; other tabs exchange events through
   BroadcastChannel or use a SharedWorker. Without support, each tab connects independently
   and still deduplicates events and notifications.
3. The realtime gateway authenticates the session, accepts commands, and delivers live events.
4. A separate HTTP API serves cursor history, gap repair, and command retries.
5. The message service idempotently appends a command to that conversation's ordered log.
6. A partitioned event bus carries durable events to fan-out; presence and typing are
   ephemeral TTL signals. The gateway reaches online clients and push covers offline clients.
7. The client merges cache, history, and live events by message id/sequence and advances read cursors.`,
            },
            {
              label: 'Message and synchronization cursor model',
              language: 'typescript',
              code: `type LocalState = 'pending' | 'sent' | 'failed';
type MessageEnvelope = {
  conversationId: string;
  clientMessageId: string;
  messageId?: string;
  sequence?: string;
  body: string;
  localState: LocalState;
};

type SyncCheckpoint = {
  conversationId: string;
  afterSequence: string | null;
};`,
            },
          ],
          alternative: [
            'WebSocket fits bidirectional commands and events on one channel. SSE is simpler for server-to-client delivery, reconnects automatically, and uses HTTP, but sends commands through separate HTTP and may face connection limits. Long polling is a broadly compatible fallback with more requests and latency.',
            'A SharedWorker naturally owns one socket but has uneven support and lifecycle behavior; BroadcastChannel with a leader lease is more broadly usable but needs fencing and dead-leader recovery. One socket per tab is a simple safe fallback with higher server cost.',
            'Fan-out-on-write provides fast reads for small groups at the cost of write amplification; fan-out-on-read works better for very large channels but complicates reads and unread counts. A hybrid chooses by conversation type rather than imposing one policy.',
          ],
        },
        explanation: [
          'Assumptions precede infrastructure choices: expected concurrent connections C, average event rate R, group-size distribution G, retention T, geography, payload size, and latency/availability SLOs. A capacity model expresses fan-out and storage through those variables and is calibrated with load tests instead of fabricated values. Attachments use a separate upload/download path; realtime events contain safe metadata and processing status, not large binary payloads.',
          'The practical guarantee is idempotent send plus at-least-once events. The client generates a random `clientMessageId`; the server stores it in sender/conversation scope and a retry returns the same message id. The service assigns a sequence monotonic only within a conversation. The client deduplicates by message id, detects a missing sequence, pauses dependent application, and repairs the gap over HTTP. There is no global ordering across conversations; timestamps are presentation data, not consensus.',
          'An IndexedDB outbox survives reload; commands retain state, attempt information, and local causality. After reconnect the client refreshes authentication, receives or requests events after its cursor, repairs gaps, and retries idempotent commands. Ack means durable server acceptance, delivered means delivery to at least one recipient device under an explicit policy, and read means an explicit read-cursor advance; the UI does not conflate them. Edit/delete operations are versions or events with an expected version, and conflicts trigger reconciliation rather than silent overwrite.',
          'History uses opaque cursors rather than offsets, so inserts do not shift pages. Live events are buffered during a fetch and merged by id/sequence. The virtualizer keeps a bounded window and measures variable heights; before prepend it records the first visible key and offset, then restores that anchor. For accessibility, messages retain list semantics, a restrained live region announces new arrivals without rereading the feed, keyboard focus is not discarded on unmount, and a less aggressive virtualization mode is available.',
        ],
        edgeCases: [
          'An acknowledgement is lost, the client goes offline, and send is retried: the server returns the row for `clientMessageId`, and the client replaces pending without a second message.',
          'A live event with a later sequence arrives before a history page, or edit arrives before create: buffer it, detect the gap, and repair rather than sorting only by timestamp.',
          'The leader tab freezes without unload; its lease expires, a new leader obtains a larger fencing token, and the coordinator or server rejects actions from the stale owner.',
          'The user reads from the middle while a page is prepended and images later change height; ResizeObserver corrects layout relative to the anchor without forcing scroll to bottom.',
          'A user sent while offline, then lost conversation access or deleted it elsewhere; replay gets a permanent rejection, retains an actionable failed item, and does not retry forever.',
          'A read receipt from one device is ahead of another device’s local history; merge the read cursor monotonically by maximum sequence and never move it backward.',
          'Retention removed messages inside a gap; the API supplies a new lower checkpoint or tombstone, and the client abandons the unreachable range instead of repairing forever.',
        ],
        complexity: [
          'Merging a page and live buffer is O(n log n) with a general sort or O(n) for already ordered sequences; a Map provides expected O(1) lookup and deduplication.',
          'Virtualization bounds DOM nodes by window size, but cached history and indexes need their own eviction policy. Server fan-out cost depends on group size and the write/read model.',
        ],
        followUps: [
          'How do ordering and partition keys change for a very large group, and where do hot partitions emerge?',
          'How would end-to-end encryption affect multi-device keys, history recovery, search, moderation, and push previews without claiming incompatible guarantees?',
          'How do you safely deploy a new event schema with old clients, offline outboxes, and events delayed in the bus?',
          'How can unread counts and read cursors avoid write amplification for every message and device?',
          'Which metrics distinguish failures in the gateway, event bus, fan-out, history API, and client main thread?',
        ],
        production: [
          'Observe connection count, reconnect reasons, auth failures, heartbeat timeouts, event lag, gap and repair outcomes, duplicate rate, acknowledgement latency, outbox age, history latency, and dropped ephemeral events. Correlation joins command, durable message, and delivery event without logging message bodies.',
          'Apply backpressure: bound send queues, slow or disconnect a lagging consumer with a resume cursor, coalesce presence/typing, and never silently discard durable messages. Reconnect uses exponential backoff with jitter and server retry hints.',
          'Failure modes are explicit: when realtime fails the UI remains in degraded HTTP/offline mode; when the bus lags, history is the recovery source; when history is unavailable, live events buffer to a hard limit; on overflow the client disconnects and fully resynchronizes from a checkpoint. Regional failover needs an explicit conversation-ownership and consistency strategy.',
          'Security and privacy: authorize every subscribe/send/history operation, never place tokens in query strings, schema-check and bound payloads, rate-limit by subject and conversation, avoid sensitive push previews without consent, and apply retention/deletion to client caches and server storage.',
        ],
        furtherReading: [
          {
            label: 'MDN WebSocket API',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSocket',
          },
          {
            label: 'MDN Server-sent events',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events',
          },
          {
            label: 'MDN BroadcastChannel',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel',
          },
        ],
      },
    },
  },
] as const;
