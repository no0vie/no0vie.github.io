import type { PreparationTopic } from './preparation';

type Level = 'medium' | 'hard' | 'senior';
type Module =
  'llm-fundamentals' | 'rag' | 'ai-agents' | 'ai-architecture' | 'ai-first-sdd' | 'production-ai';

const sources = {
  llm: { title: 'Attention Is All You Need', url: 'https://arxiv.org/abs/1706.03762' },
  rag: { title: 'Retrieval-Augmented Generation', url: 'https://arxiv.org/abs/2005.11401' },
  agents: {
    title: 'ReAct: Synergizing Reasoning and Acting',
    url: 'https://arxiv.org/abs/2210.03629',
  },
  mcp: {
    title: 'Model Context Protocol specification',
    url: 'https://modelcontextprotocol.io/specification/2025-06-18',
  },
  evals: {
    title: 'NIST AI Risk Management Framework',
    url: 'https://www.nist.gov/itl/ai-risk-management-framework',
  },
  security: {
    title: 'OWASP Top 10 for LLM Applications',
    url: 'https://genai.owasp.org/llm-top-10/',
  },
} as const;

function topic(input: {
  id: string;
  module: Module;
  level: Level;
  titleRu: string;
  titleEn: string;
  shortRu: string;
  shortEn: string;
  detailRu: string[];
  detailEn: string[];
  code?: string;
  mistakesRu: string[];
  mistakesEn: string[];
  followRu: string[];
  followEn: string[];
  related?: string[];
  practiceIds?: string[];
  reference: (typeof sources)[keyof typeof sources];
}): PreparationTopic {
  return {
    id: input.id,
    slug: input.id,
    title: { ru: input.titleRu, en: input.titleEn },
    description: { ru: input.shortRu, en: input.shortEn },
    category: 'ai-engineering',
    difficulty: input.level,
    interviewLevel:
      input.level === 'medium' ? 'basic' : input.level === 'hard' ? 'middle' : 'senior',
    estimatedMinutes: input.level === 'medium' ? 25 : input.level === 'hard' ? 35 : 45,
    prerequisites: [],
    relatedTopics: input.related ?? [],
    theory: {
      shortAnswer: { ru: input.shortRu, en: input.shortEn },
      detailedExplanation: { ru: input.detailRu, en: input.detailEn },
      mechanism: { ru: input.detailRu, en: input.detailEn },
      codeExamples: input.code
        ? [
            {
              label: { ru: 'Практический пример', en: 'Practical example' },
              language: 'typescript',
              code: input.code,
            },
          ]
        : [],
      commonMistakes: { ru: input.mistakesRu, en: input.mistakesEn },
      productionUse: {
        ru: 'В production фиксируйте контракт, ограничения, телеметрию и безопасный fallback; проверяйте качество на репрезентативных данных.',
        en: 'In production, define the contract, constraints, telemetry, and a safe fallback; validate quality on representative data.',
      },
      tradeoffs: {
        ru: 'Качество, задержка, стоимость, безопасность и управляемость конфликтуют; решение зависит от измеряемого сценария.',
        en: 'Quality, latency, cost, safety, and operability conflict; the right choice depends on the measured use case.',
      },
      followUps: { ru: input.followRu, en: input.followEn },
    },
    practiceIds: input.practiceIds ?? [],
    scenarioIds: [input.module, `level:${input.level}`],
    references: [input.reference],
    lastReviewedAt: '2026-11-13',
  };
}

const callModel = `type Message = { role: 'system' | 'user' | 'assistant'; content: string };
async function generate(messages: Message[], signal: AbortSignal) {
  const response = await fetch('/api/ai/generate', {
    method: 'POST', signal, headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ messages, temperature: 0 }),
  });
  if (!response.ok) throw new Error(\`AI request failed: \${response.status}\`);
  return response.json() as Promise<{ text: string; usage: { input: number; output: number } }>;
}`;

export const aiEngineeringTopics: PreparationTopic[] = [
  topic({
    id: 'ai-tokens-context-window',
    module: 'llm-fundamentals',
    level: 'medium',
    titleRu: 'Что такое токены и контекстное окно?',
    titleEn: 'What are tokens and a context window?',
    shortRu:
      'Токен — единица разбиения текста моделью, а контекстное окно ограничивает суммарный объём входа и генерируемого ответа. Большое окно не гарантирует одинакового внимания ко всем фрагментам.',
    shortEn:
      'A token is a model-specific text unit; the context window bounds input plus generated output. A larger window does not guarantee equal use of every fragment.',
    detailRu: [
      'Токенизатор преобразует текст в идентификаторы; длина зависит от языка и модели.',
      'Промпт, история, retrieved context, tool results и output конкурируют за один бюджет.',
      'Переполнение требует усечения, суммаризации или retrieval, причём каждый вариант может потерять важные данные.',
    ],
    detailEn: [
      'A tokenizer maps text to IDs; length varies by language and model.',
      'Prompt, history, retrieved context, tool results, and output share one budget.',
      'Overflow requires truncation, summarization, or retrieval, each of which can lose important information.',
    ],
    mistakesRu: [
      'Считать токен словом.',
      'Предполагать, что информация в начале или середине длинного контекста обязательно будет использована.',
    ],
    mistakesEn: [
      'Treating a token as a word.',
      'Assuming every part of a long context will be used reliably.',
    ],
    followRu: ['Как считать бюджет до запроса?', 'Что делать при переполнении?'],
    followEn: ['How do you budget before a request?', 'How do you handle overflow?'],
    related: ['ai-generation-controls', 'ai-embeddings-similarity'],
    reference: sources.llm,
  }),
  topic({
    id: 'ai-generation-controls',
    module: 'llm-fundamentals',
    level: 'medium',
    titleRu: 'Как temperature и sampling влияют на ответ?',
    titleEn: 'How do temperature and sampling affect output?',
    shortRu:
      'Temperature изменяет форму распределения вероятностей, а top-p ограничивает рассматриваемую вероятностную массу. Низкие значения уменьшают вариативность, но не делают модель детерминированной или истинной.',
    shortEn:
      'Temperature reshapes the probability distribution while top-p limits the considered probability mass. Lower values reduce variation but do not make the model deterministic or truthful.',
    detailRu: [
      'Модель предсказывает следующий токен по распределению logits.',
      'Sampling-параметры управляют выбором, но провайдер, версия модели и инфраструктура также влияют на воспроизводимость.',
      'Для extraction полезнее строгая схема и валидация, чем попытка настроить истинность temperature.',
    ],
    detailEn: [
      'The model predicts the next token from a logits distribution.',
      'Sampling controls selection, but provider, model version, and infrastructure also affect reproducibility.',
      'For extraction, a strict schema and validation matter more than tuning temperature for truth.',
    ],
    code: callModel,
    mistakesRu: [
      'Использовать temperature как настройку фактической точности.',
      'Менять несколько sampling-параметров без evals.',
    ],
    mistakesEn: [
      'Using temperature as a factual-accuracy control.',
      'Changing several sampling controls without evals.',
    ],
    followRu: [
      'Когда нужна вариативность?',
      'Почему temperature=0 не гарантирует одинаковый ответ?',
    ],
    followEn: [
      'When is variation useful?',
      'Why does temperature=0 not guarantee identical output?',
    ],
    related: ['ai-structured-output'],
    reference: sources.llm,
  }),
  topic({
    id: 'ai-embeddings-similarity',
    module: 'llm-fundamentals',
    level: 'hard',
    titleRu: 'Что такое embeddings и similarity search?',
    titleEn: 'What are embeddings and similarity search?',
    shortRu:
      'Embedding кодирует объект в вектор, где близость приближённо отражает семантическое сходство для задач модели. Поиск использует cosine, dot product или distance и требует проверки на ваших данных.',
    shortEn:
      'An embedding maps an object to a vector where proximity approximates task-specific semantic similarity. Retrieval uses cosine, dot product, or distance and must be evaluated on your data.',
    detailRu: [
      'Векторы одной embedding-модели сравнимы в согласованном пространстве.',
      'ANN-индексы ускоряют поиск ценой приближённости и параметров recall/latency.',
      'Similarity не равна фактической релевантности, авторитетности или праву доступа.',
    ],
    detailEn: [
      'Vectors from one embedding model share a comparable space.',
      'ANN indexes accelerate search with recall/latency tradeoffs.',
      'Similarity is not factual relevance, authority, or authorization.',
    ],
    code: `type Vector = readonly number[];
export const cosine = (a: Vector, b: Vector) => {
  const dot = a.reduce((sum, x, i) => sum + x * (b[i] ?? 0), 0);
  const norm = (v: Vector) => Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
  return dot / (norm(a) * norm(b));
};`,
    mistakesRu: ['Смешивать vectors разных моделей.', 'Не фильтровать документы по ACL до выдачи.'],
    mistakesEn: [
      'Mixing vectors from different models.',
      'Failing to enforce document ACLs before retrieval.',
    ],
    followRu: ['Как выбрать metric?', 'Как измерить retrieval recall?'],
    followEn: ['How do you choose a metric?', 'How do you measure retrieval recall?'],
    related: ['ai-rag-pipeline', 'ai-rag-chunking'],
    reference: sources.rag,
  }),
  topic({
    id: 'ai-structured-output',
    module: 'llm-fundamentals',
    level: 'hard',
    titleRu: 'Как получать структурированный вывод?',
    titleEn: 'How do you obtain structured output?',
    shortRu:
      'Используйте provider-supported schema/tool contract, затем всё равно валидируйте результат на границе приложения. Исправление или retry должны быть ограничены и наблюдаемы.',
    shortEn:
      'Use a provider-supported schema or tool contract, then validate at the application boundary. Repair and retries must be bounded and observable.',
    detailRu: [
      'JSON-подобный текст не является типобезопасным результатом.',
      'Schema-constrained decoding снижает синтаксические ошибки, но не гарантирует семантическую корректность полей.',
      'После Zod-валидации применяйте доменные проверки и не доверяйте model-generated identifiers.',
    ],
    detailEn: [
      'JSON-looking text is not a type-safe result.',
      'Schema-constrained decoding reduces syntax failures but does not guarantee semantic correctness.',
      'After Zod validation, apply domain rules and distrust model-generated identifiers.',
    ],
    code: `import { z } from 'zod';
const Result = z.object({ answer: z.string(), citations: z.array(z.string().url()) });
export function parseModelResult(value: unknown) { return Result.parse(value); }`,
    mistakesRu: [
      'Парсить JSON без schema validation.',
      'Бесконечно просить модель исправить собственный ответ.',
    ],
    mistakesEn: [
      'Parsing JSON without schema validation.',
      'Letting the model repair its own output indefinitely.',
    ],
    followRu: ['Что проверяет схема, а что доменная логика?', 'Как ограничить retry?'],
    followEn: ['What belongs to schema versus domain validation?', 'How do you bound retries?'],
    related: ['ai-tool-calling-contract'],
    reference: sources.llm,
  }),
  topic({
    id: 'ai-rag-pipeline',
    module: 'rag',
    level: 'medium',
    titleRu: 'Из каких этапов состоит RAG pipeline?',
    titleEn: 'What stages make up a RAG pipeline?',
    shortRu:
      'RAG индексирует доверенные документы, извлекает релевантные фрагменты для запроса и передаёт их модели с инструкцией и ссылками. Retrieval и generation оцениваются отдельно.',
    shortEn:
      'RAG indexes trusted documents, retrieves relevant passages for a query, and gives them to a model with instructions and citations. Retrieval and generation are evaluated separately.',
    detailRu: [
      'Ingestion включает parsing, очистку, chunking, metadata и embedding.',
      'Online path формирует query, фильтрует доступ, retrieves/reranks контекст и собирает prompt.',
      'Ответ должен сохранять provenance и уметь отказаться при недостатке evidence.',
    ],
    detailEn: [
      'Ingestion includes parsing, cleaning, chunking, metadata, and embeddings.',
      'The online path builds a query, enforces access filters, retrieves/reranks context, and assembles the prompt.',
      'The answer should preserve provenance and abstain when evidence is insufficient.',
    ],
    code: `async function answer(query: string) {
  const hits = await retrieve(query, { limit: 8 });
  const context = hits.map((x) => \`[\${x.id}] \${x.text}\`).join('\n');
  return generateGrounded({ query, context, allowedCitationIds: hits.map((x) => x.id) });
}`,
    mistakesRu: [
      'Оценивать только красивый финальный ответ.',
      'Индексировать недоверенный контент без provenance.',
    ],
    mistakesEn: [
      'Evaluating only fluent final answers.',
      'Indexing untrusted content without provenance.',
    ],
    followRu: ['Как диагностировать плохой ответ?', 'Когда RAG не нужен?'],
    followEn: ['How do you diagnose a bad answer?', 'When is RAG unnecessary?'],
    related: ['ai-rag-chunking', 'ai-rag-evaluation'],
    practiceIds: ['16'],
    reference: sources.rag,
  }),
  topic({
    id: 'ai-rag-chunking',
    module: 'rag',
    level: 'hard',
    titleRu: 'Как выбрать chunking strategy?',
    titleEn: 'How do you choose a chunking strategy?',
    shortRu:
      'Chunk должен быть достаточно мал для точного поиска и достаточно полон для ответа. Начните со структуры документа и overlap, затем подберите параметры по retrieval evals.',
    shortEn:
      'A chunk must be small enough for precise retrieval and complete enough to answer. Start from document structure and overlap, then tune with retrieval evals.',
    detailRu: [
      'Фиксированный размер прост, но может разрывать таблицы, код и смысловые секции.',
      'Semantic/structure-aware chunking сохраняет границы, но сложнее и дороже.',
      'Храните parent/section metadata, версии и позиции для контекста и цитат.',
    ],
    detailEn: [
      'Fixed-size splitting is simple but can break tables, code, and semantic units.',
      'Semantic or structure-aware splitting preserves boundaries but is more complex and costly.',
      'Keep parent/section metadata, versions, and offsets for context and citations.',
    ],
    mistakesRu: ['Выбирать размер без benchmark.', 'Терять заголовки и source offsets.'],
    mistakesEn: [
      'Choosing chunk size without a benchmark.',
      'Dropping headings and source offsets.',
    ],
    followRu: ['Зачем overlap?', 'Как работать с кодом и таблицами?'],
    followEn: ['Why use overlap?', 'How do you handle code and tables?'],
    related: ['ai-embeddings-similarity', 'ai-rag-pipeline'],
    reference: sources.rag,
  }),
  topic({
    id: 'ai-rag-hybrid-reranking',
    module: 'rag',
    level: 'senior',
    titleRu: 'Зачем hybrid search и reranking?',
    titleEn: 'Why use hybrid search and reranking?',
    shortRu:
      'Dense retrieval хорошо ловит семантику, lexical — точные имена и коды. Hybrid объединяет кандидатов, а reranker тратит больше вычислений на точное упорядочивание небольшого набора.',
    shortEn:
      'Dense retrieval captures semantics while lexical search catches exact names and codes. Hybrid retrieval merges candidates; a reranker spends more compute ordering a small set.',
    detailRu: [
      'BM25 и vector search имеют разные ошибки и дополняют друг друга.',
      'Fusion требует нормализации/ранговой стратегии, иначе шкалы score несопоставимы.',
      'Reranking улучшает precision, но добавляет latency, стоимость и ещё одну модель для мониторинга.',
    ],
    detailEn: [
      'BM25 and vector retrieval fail differently and complement each other.',
      'Fusion needs normalization or rank-based merging because scores are not directly comparable.',
      'Reranking may improve precision but adds latency, cost, and another model to operate.',
    ],
    mistakesRu: [
      'Складывать несопоставимые scores напрямую.',
      'Увеличивать top-k без контроля контекстного бюджета.',
    ],
    mistakesEn: [
      'Adding incomparable scores directly.',
      'Increasing top-k without controlling context budget.',
    ],
    followRu: ['Как построить ablation?', 'Где кэшировать reranking?'],
    followEn: ['How do you design an ablation?', 'Where can reranking be cached?'],
    related: ['ai-rag-evaluation'],
    reference: sources.rag,
  }),
  topic({
    id: 'ai-rag-evaluation',
    module: 'rag',
    level: 'senior',
    titleRu: 'Как оценивать RAG?',
    titleEn: 'How do you evaluate RAG?',
    shortRu:
      'Разделите retrieval metrics (recall@k, MRR/nDCG) и answer metrics (correctness, groundedness, citation precision). Используйте размеченный набор, slices и ручную калибровку model-based judges.',
    shortEn:
      'Separate retrieval metrics such as recall@k or MRR/nDCG from answer correctness, groundedness, and citation precision. Use labeled sets, slices, and human calibration of model-based judges.',
    detailRu: [
      'End-to-end pass/fail не показывает, где сломалась система.',
      'Golden set должен включать обычные, сложные, недоступные и adversarial запросы.',
      'LLM-as-judge масштабирует оценку, но сам имеет bias, variance и требует version pinning.',
    ],
    detailEn: [
      'End-to-end pass/fail does not localize failures.',
      'A golden set should contain normal, difficult, unanswerable, and adversarial queries.',
      'LLM-as-judge scales evaluation but has bias and variance and requires version pinning.',
    ],
    mistakesRu: ['Использовать только cosine score.', 'Считать judge объективным oracle.'],
    mistakesEn: [
      'Using cosine score as the only metric.',
      'Treating a judge model as an objective oracle.',
    ],
    followRu: ['Как оценить abstention?', 'Какие slices обязательны?'],
    followEn: ['How do you score abstention?', 'Which slices are essential?'],
    related: ['ai-evals-regression', 'ai-observability'],
    practiceIds: ['19'],
    reference: sources.evals,
  }),
  topic({
    id: 'ai-agent-loop',
    module: 'ai-agents',
    level: 'medium',
    titleRu: 'Что такое agent loop?',
    titleEn: 'What is an agent loop?',
    shortRu:
      'Agent loop чередует выбор следующего действия моделью, выполнение контролируемого инструмента и добавление результата в состояние до stop condition. Это ограниченный workflow, а не безошибочная автономность.',
    shortEn:
      'An agent loop alternates model-selected actions, controlled tool execution, and state updates until a stop condition. It is a bounded workflow, not error-free autonomy.',
    detailRu: [
      'Состояние содержит цель, историю, tool results, budget и policy decisions.',
      'Оркестратор, а не модель, применяет allowlist, timeout, iteration and cost limits.',
      'Завершение, ошибка, запрос подтверждения и невозможность решить задачу — явные исходы.',
    ],
    detailEn: [
      'State contains the goal, history, tool results, budget, and policy decisions.',
      'The orchestrator, not the model, enforces allowlists, timeouts, iteration and cost limits.',
      'Success, failure, approval request, and inability to solve are explicit outcomes.',
    ],
    code: `for (let step = 0; step < maxSteps; step += 1) {
  const action = await decide(state);
  if (action.type === 'finish') return action.result;
  const result = await tools.executeAuthorized(action, signal);
  state = appendObservation(state, action, result);
}
throw new Error('Agent step budget exceeded');`,
    mistakesRu: ['Цикл без лимита шагов.', 'Позволять модели самой определять разрешения.'],
    mistakesEn: ['Running without a step limit.', 'Letting the model decide its own permissions.'],
    followRu: ['Какие stop conditions нужны?', 'Когда workflow лучше агента?'],
    followEn: ['Which stop conditions are required?', 'When is a fixed workflow better?'],
    related: ['ai-tool-calling-contract', 'ai-agent-memory'],
    practiceIds: ['17'],
    reference: sources.agents,
  }),
  topic({
    id: 'ai-tool-calling-contract',
    module: 'ai-agents',
    level: 'hard',
    titleRu: 'Как безопасно реализовать tool calling?',
    titleEn: 'How do you implement tool calling safely?',
    shortRu:
      'Tool call — недоверенное предложение выполнить типизированную операцию. Оркестратор валидирует имя и аргументы, авторизацию, side effects, timeout и результат; опасные действия требуют подтверждения.',
    shortEn:
      'A tool call is an untrusted proposal to execute a typed operation. The orchestrator validates name and arguments, authorization, side effects, timeouts, and results; dangerous actions require approval.',
    detailRu: [
      'Schema описывает синтаксис, но не право выполнить действие.',
      'Используйте capability-scoped credentials и разделяйте read/write tools.',
      'Логи должны сохранять correlation ID и outcome без утечки secrets.',
    ],
    detailEn: [
      'A schema describes syntax, not permission.',
      'Use capability-scoped credentials and separate read from write tools.',
      'Logs should retain correlation IDs and outcomes without leaking secrets.',
    ],
    code: `const tools = { getOrder: { sideEffect: false, run: getOrder } } as const;
async function execute(name: keyof typeof tools, args: unknown, user: User) {
  authorize(user, name);
  const parsed = toolSchemas[name].parse(args);
  return withTimeout(tools[name].run(parsed), 2_000);
}`,
    mistakesRu: ['Считать JSON schema sandbox.', 'Передавать модели долгоживущие credentials.'],
    mistakesEn: ['Treating JSON Schema as a sandbox.', 'Giving the model long-lived credentials.'],
    followRu: ['Как сделать idempotent write tool?', 'Что логировать?'],
    followEn: ['How do you make a write tool idempotent?', 'What should be logged?'],
    related: ['ai-prompt-injection', 'ai-mcp'],
    reference: sources.security,
  }),
  topic({
    id: 'ai-agent-memory',
    module: 'ai-agents',
    level: 'senior',
    titleRu: 'Как проектировать память агента?',
    titleEn: 'How do you design agent memory?',
    shortRu:
      'Разделяйте краткосрочное состояние запуска, резюме разговора и долговременные факты. Запись требует provenance, TTL, user control и защиты от превращения недоверенного текста в инструкцию.',
    shortEn:
      'Separate run-local state, conversation summaries, and long-term facts. Writes need provenance, TTL, user control, and protection against turning untrusted text into instructions.',
    detailRu: [
      'Полная история быстро переполняет контекст и увеличивает стоимость.',
      'Суммаризация lossy, поэтому важные факты должны храниться структурированно.',
      'Memory retrieval — ещё один RAG path с ACL, deletion и eval requirements.',
    ],
    detailEn: [
      'Full history quickly exhausts context and cost.',
      'Summarization is lossy, so important facts should be stored structurally.',
      'Memory retrieval is another RAG path with ACL, deletion, and evaluation requirements.',
    ],
    mistakesRu: ['Хранить всё навсегда.', 'Смешивать user data между tenants.'],
    mistakesEn: ['Keeping everything forever.', 'Mixing user data across tenants.'],
    followRu: ['Как пользователь удаляет память?', 'Что нельзя суммаризовать?'],
    followEn: ['How does a user delete memory?', 'What must not be summarized?'],
    related: ['ai-agent-loop', 'ai-prompt-injection'],
    reference: sources.agents,
  }),
  topic({
    id: 'ai-mcp',
    module: 'ai-agents',
    level: 'senior',
    titleRu: 'Что такое MCP и где его границы?',
    titleEn: 'What is MCP and what are its boundaries?',
    shortRu:
      'MCP стандартизирует обмен контекстом и возможностями между AI host/client и servers через resources, prompts и tools. Он улучшает интеграцию, но не заменяет auth, sandboxing, policy и доверие к серверу.',
    shortEn:
      'MCP standardizes context and capability exchange between an AI host/client and servers through resources, prompts, and tools. It improves integration but does not replace auth, sandboxing, policy, or server trust.',
    detailRu: [
      'Host управляет пользовательским опытом и соединениями; server публикует capabilities.',
      'Capability negotiation и transport interoperability не делают tool безопасным.',
      'Нужно проверять server identity, permissions, data flow и обновления контракта.',
    ],
    detailEn: [
      'The host manages user experience and connections; a server exposes capabilities.',
      'Capability negotiation and transport interoperability do not make a tool safe.',
      'Verify server identity, permissions, data flow, and contract upgrades.',
    ],
    mistakesRu: [
      'Называть MCP моделью или агентом.',
      'Подключать неизвестный server с широкими правами.',
    ],
    mistakesEn: [
      'Calling MCP a model or an agent.',
      'Connecting an unknown server with broad permissions.',
    ],
    followRu: ['Чем MCP отличается от REST?', 'Где применять policy enforcement?'],
    followEn: ['How does MCP differ from REST?', 'Where is policy enforced?'],
    related: ['ai-tool-calling-contract', 'ai-gateway'],
    reference: sources.mcp,
  }),
  topic({
    id: 'ai-gateway',
    module: 'ai-architecture',
    level: 'hard',
    titleRu: 'Зачем нужен AI Gateway?',
    titleEn: 'Why use an AI Gateway?',
    shortRu:
      'AI Gateway централизует provider adapters, routing, credentials, quotas, retries, observability и policy. Он не должен скрывать различия моделей так сильно, чтобы потерять capabilities и семантику ошибок.',
    shortEn:
      'An AI Gateway centralizes provider adapters, routing, credentials, quotas, retries, observability, and policy. It should not hide model differences so completely that capabilities and error semantics are lost.',
    detailRu: [
      'Нормализуйте стабильное ядро контракта, а provider-specific возможности делайте явными.',
      'Retry допустим только для классифицированных transient failures и с budget/deadline.',
      'Gateway — место для redaction, usage accounting и trace context, но не единственная security boundary.',
    ],
    detailEn: [
      'Normalize a stable core contract and expose provider-specific capabilities explicitly.',
      'Retry only classified transient failures within budget and deadline.',
      'The gateway is useful for redaction, accounting, and trace context, but is not the only security boundary.',
    ],
    code: `interface AiGateway {
  generate(request: GenerateRequest, options?: { signal?: AbortSignal }): Promise<GenerateResult>;
  stream(request: GenerateRequest, options?: { signal?: AbortSignal }): AsyncIterable<AiEvent>;
  capabilities(model: string): Promise<ModelCapabilities>;
}`,
    mistakesRu: ['Retry всех ошибок.', 'Терять provider request ID и usage.'],
    mistakesEn: ['Retrying every failure.', 'Dropping provider request IDs and usage.'],
    followRu: ['Как версионировать SDK?', 'Как выбирать provider?'],
    followEn: ['How do you version the SDK?', 'How do you route providers?'],
    related: ['ai-routing-fallback', 'ai-observability'],
    practiceIds: ['18'],
    reference: sources.evals,
  }),
  topic({
    id: 'ai-routing-fallback',
    module: 'ai-architecture',
    level: 'senior',
    titleRu: 'Как проектировать routing и fallback моделей?',
    titleEn: 'How do you design model routing and fallback?',
    shortRu:
      'Routing выбирает модель по capability, data policy, latency, quality и cost budget. Fallback безопасен только при совместимом контракте и не должен незаметно менять семантику или обходить policy.',
    shortEn:
      'Routing selects a model by capability, data policy, latency, quality, and cost budget. Fallback is safe only with a compatible contract and must not silently change semantics or bypass policy.',
    detailRu: [
      'Сначала фильтруйте по обязательным capabilities и compliance, затем оптимизируйте score.',
      'Circuit breaker защищает от каскадных отказов, но требует наблюдаемого degraded mode.',
      'Проверяйте fallback на том же eval set и маркируйте ответ/trace фактической моделью.',
    ],
    detailEn: [
      'Filter by mandatory capabilities and compliance before optimizing a score.',
      'A circuit breaker limits cascading failure but needs an observable degraded mode.',
      'Evaluate fallback on the same set and record the actual model in response traces.',
    ],
    mistakesRu: [
      'Выбирать только по цене.',
      'Fallback на модель без structured output/tool support.',
    ],
    mistakesEn: [
      'Routing on price alone.',
      'Falling back to a model without required structured output or tool support.',
    ],
    followRu: ['Когда лучше fail closed?', 'Как избежать retry storm?'],
    followEn: ['When should you fail closed?', 'How do you avoid retry storms?'],
    related: ['ai-gateway', 'ai-cost-latency'],
    reference: sources.evals,
  }),
  topic({
    id: 'ai-streaming-backpressure',
    module: 'ai-architecture',
    level: 'senior',
    titleRu: 'Как устроить streaming и backpressure?',
    titleEn: 'How do you handle streaming and backpressure?',
    shortRu:
      'Streaming уменьшает time-to-first-token, но требует протокола событий, cancellation, bounded buffers и финального usage/error event. Медленный клиент не должен бесконечно накапливать данные.',
    shortEn:
      'Streaming reduces time to first token but requires an event protocol, cancellation, bounded buffers, and final usage/error events. A slow client must not create unbounded buffering.',
    detailRu: [
      'Отделяйте text deltas, tool calls, metadata, completion и errors.',
      'AbortSignal должен доходить до provider и tool execution.',
      'После частично показанного ответа retry нельзя маскировать как продолжение того же потока.',
    ],
    detailEn: [
      'Separate text deltas, tool calls, metadata, completion, and errors.',
      'AbortSignal must reach the provider and tool execution.',
      'After partial output, a retry cannot masquerade as continuation of the same stream.',
    ],
    code: `type AiEvent = { type: 'text'; delta: string } | { type: 'usage'; tokens: number } | { type: 'done' };
async function consume(events: AsyncIterable<AiEvent>, signal: AbortSignal) {
  for await (const event of events) { if (signal.aborted) break; render(event); }
}`,
    mistakesRu: ['Буферизовать весь ответ перед отправкой.', 'Не обрабатывать disconnect клиента.'],
    mistakesEn: ['Buffering the entire answer before sending.', 'Ignoring client disconnects.'],
    followRu: ['Как передать tool call в stream?', 'Где учитывать usage?'],
    followEn: ['How do tool calls appear in the stream?', 'Where is usage accounted?'],
    related: ['ai-gateway', 'ai-observability'],
    reference: sources.evals,
  }),
  topic({
    id: 'ai-sdd-contracts',
    module: 'ai-first-sdd',
    level: 'hard',
    titleRu: 'Что означает AI-first и SDD?',
    titleEn: 'What do AI-first and SDD mean?',
    shortRu:
      'AI-first — проектирование продукта вокруг вероятностной capability там, где она даёт измеримую ценность; SDD фиксирует спецификацию, acceptance criteria и evals до генерации реализации. Это инженерный процесс, не отказ от review.',
    shortEn:
      'AI-first designs a product around probabilistic capability where it creates measurable value; SDD fixes specifications, acceptance criteria, and evals before generating implementation. It does not remove review.',
    detailRu: [
      'Сначала формулируются пользовательский outcome, границы и допустимые ошибки.',
      'Спецификация связывает prompt/model-independent contract с тестами и наблюдаемостью.',
      'Generated code остаётся недоверенным изменением: review, tests, security checks и ownership обязательны.',
    ],
    detailEn: [
      'Start with user outcome, boundaries, and acceptable failures.',
      'The specification connects a model-independent contract to tests and observability.',
      'Generated code remains an untrusted change requiring review, tests, security checks, and ownership.',
    ],
    mistakesRu: [
      'Называть AI-first любую интеграцию чат-бота.',
      'Принимать generated code без понимания.',
    ],
    mistakesEn: [
      'Calling any chatbot integration AI-first.',
      'Accepting generated code without understanding it.',
    ],
    followRu: ['Что входит в spec?', 'Как выбрать deterministic boundary?'],
    followEn: ['What belongs in the spec?', 'How do you choose deterministic boundaries?'],
    related: ['ai-evals-regression', 'ai-human-in-loop'],
    reference: sources.evals,
  }),
  topic({
    id: 'ai-evals-regression',
    module: 'ai-first-sdd',
    level: 'senior',
    titleRu: 'Как строить evals и regression gates?',
    titleEn: 'How do you build evals and regression gates?',
    shortRu:
      'Evals — версионированный набор входов, ожидаемых свойств, slices и scoring. До релиза сравнивайте candidate с baseline, задавайте пороги и вручную анализируйте статистически и продуктово значимые изменения.',
    shortEn:
      'Evals are versioned inputs, expected properties, slices, and scoring. Before release, compare candidate with baseline, set thresholds, and manually inspect statistically and product-relevant changes.',
    detailRu: [
      'Используйте deterministic checks для схем, цитат, policy и business invariants.',
      'Для open-ended качества применяйте rubric, несколько оценок и калибровку с людьми.',
      'Храните model/prompt/retrieval versions и артефакты failure analysis.',
    ],
    detailEn: [
      'Use deterministic checks for schemas, citations, policy, and business invariants.',
      'For open-ended quality, use rubrics, repeated judgments, and human calibration.',
      'Store model, prompt, and retrieval versions plus failure-analysis artifacts.',
    ],
    code: `type EvalCase = { id: string; input: string; assert: (r: Result) => string[] };
const cases: EvalCase[] = [{ id: 'refusal-no-evidence', input: 'Unknown policy?', assert: (r) => r.citations.length ? [] : ['must cite or abstain'] }];`,
    mistakesRu: [
      'Подгонять eval set под текущую модель.',
      'Сводить качество к одному average score.',
    ],
    mistakesEn: [
      'Overfitting the eval set to the current model.',
      'Reducing quality to one average score.',
    ],
    followRu: ['Как предотвратить leakage?', 'Как версионировать judge?'],
    followEn: ['How do you prevent leakage?', 'How do you version the judge?'],
    related: ['ai-rag-evaluation', 'ai-observability'],
    practiceIds: ['19'],
    reference: sources.evals,
  }),
  topic({
    id: 'ai-human-in-loop',
    module: 'ai-first-sdd',
    level: 'senior',
    titleRu: 'Когда нужен human-in-the-loop?',
    titleEn: 'When is human-in-the-loop required?',
    shortRu:
      'Чем выше необратимость, неопределённость и ущерб ошибки, тем важнее review или approval до действия. Интерфейс должен показывать evidence, uncertainty и точный proposed change, а не формальную кнопку подтверждения.',
    shortEn:
      'The greater the irreversibility, uncertainty, and harm, the stronger the need for review or approval before action. The UI must show evidence, uncertainty, and the exact proposed change, not a ceremonial confirm button.',
    detailRu: [
      'Различайте review результата, approval действия и escalation при low confidence.',
      'Автоматизация допустима для bounded reversible operations с мониторингом.',
      'Измеряйте нагрузку и automation bias: человек не является бесплатным идеальным oracle.',
    ],
    detailEn: [
      'Distinguish output review, action approval, and low-confidence escalation.',
      'Automation is appropriate for bounded reversible operations with monitoring.',
      'Measure workload and automation bias; humans are not free perfect oracles.',
    ],
    mistakesRu: [
      'Approval после уже выполненного side effect.',
      'Показывать reviewer только итог без источников.',
    ],
    mistakesEn: [
      'Asking approval after the side effect.',
      'Showing reviewers an answer without evidence.',
    ],
    followRu: ['Как выбрать threshold?', 'Как логировать override?'],
    followEn: ['How do you choose a threshold?', 'How do you log overrides?'],
    related: ['ai-tool-calling-contract', 'ai-sdd-contracts'],
    reference: sources.evals,
  }),
  topic({
    id: 'ai-observability',
    module: 'production-ai',
    level: 'hard',
    titleRu: 'Что мониторить в AI-системе?',
    titleEn: 'What should an AI system observe?',
    shortRu:
      'Нужны traces по request → retrieval → model → tools, latency/TTFT, errors, token/cost usage и quality/safety signals. Логи редактируют чувствительные данные и связывают версии prompt, model и index.',
    shortEn:
      'Trace request → retrieval → model → tools and measure latency/TTFT, errors, token/cost usage, and quality/safety signals. Logs must redact sensitive data and link prompt, model, and index versions.',
    detailRu: [
      'Техническая доступность не равна качеству ответа.',
      'Distributed trace должен сохранять correlation IDs и provider request IDs.',
      'Online signals обнаруживают drift, но требуют offline review и feedback-quality controls.',
    ],
    detailEn: [
      'Technical availability is not answer quality.',
      'Distributed traces should retain correlation IDs and provider request IDs.',
      'Online signals detect drift but require offline review and feedback-quality controls.',
    ],
    mistakesRu: ['Логировать prompts с секретами.', 'Не различать provider latency и queue time.'],
    mistakesEn: [
      'Logging prompts containing secrets.',
      'Failing to separate provider latency from queue time.',
    ],
    followRu: ['Как измерять качество без ground truth?', 'Какие данные редактировать?'],
    followEn: [
      'How do you measure quality without ground truth?',
      'Which data should be redacted?',
    ],
    related: ['ai-cost-latency', 'ai-evals-regression'],
    reference: sources.evals,
  }),
  topic({
    id: 'ai-prompt-injection',
    module: 'production-ai',
    level: 'senior',
    titleRu: 'Как защищаться от prompt injection?',
    titleEn: 'How do you defend against prompt injection?',
    shortRu:
      'Prompt injection нельзя надёжно устранить одной инструкцией. Считайте model output и retrieved content недоверенными, минимизируйте capabilities, разделяйте data/instructions и применяйте authorization вне модели.',
    shortEn:
      'Prompt injection cannot be reliably solved by one instruction. Treat model output and retrieved content as untrusted, minimize capabilities, separate data from instructions, and enforce authorization outside the model.',
    detailRu: [
      'Indirect injection приходит из документов, web pages и tool results.',
      'Content filters полезны как слой, но обходятся и дают false positives.',
      'Основная защита — least privilege, typed tools, confirmation, isolation и monitoring.',
    ],
    detailEn: [
      'Indirect injection arrives through documents, web pages, and tool results.',
      'Content filters are a useful layer but are bypassable and produce false positives.',
      'Primary controls are least privilege, typed tools, confirmation, isolation, and monitoring.',
    ],
    mistakesRu: [
      'Полагаться на system prompt как security boundary.',
      'Передавать retrieved instructions в привилегированный контекст.',
    ],
    mistakesEn: [
      'Treating the system prompt as a security boundary.',
      'Putting retrieved instructions into privileged context.',
    ],
    followRu: ['Как тестировать indirect injection?', 'Что делать с exfiltration?'],
    followEn: ['How do you test indirect injection?', 'How do you prevent exfiltration?'],
    related: ['ai-tool-calling-contract', 'ai-agent-memory'],
    reference: sources.security,
  }),
  topic({
    id: 'ai-cost-latency',
    module: 'production-ai',
    level: 'hard',
    titleRu: 'Как управлять стоимостью и latency?',
    titleEn: 'How do you manage cost and latency?',
    shortRu:
      'Задайте SLO и budget на сценарий, измеряйте input/output tokens, TTFT и end-to-end latency. Уменьшайте контекст, кэшируйте только безопасные стабильные результаты, выбирайте модель по evals и ограничивайте concurrency.',
    shortEn:
      'Set per-use-case SLOs and budgets and measure input/output tokens, TTFT, and end-to-end latency. Reduce context, cache only safe stable results, route by evals, and bound concurrency.',
    detailRu: [
      'Стоимость включает retrieval, reranking, generation, tools, retries и observability.',
      'Prompt caching зависит от provider semantics и не заменяет application cache design.',
      'Оптимизация маленькой моделью допустима после проверки quality floor на критичных slices.',
    ],
    detailEn: [
      'Cost includes retrieval, reranking, generation, tools, retries, and observability.',
      'Prompt caching depends on provider semantics and does not replace application cache design.',
      'Using a smaller model is valid after checking the quality floor on critical slices.',
    ],
    code: `class Semaphore {
  private active = 0;
  constructor(private readonly limit: number) {}
  async run<T>(task: () => Promise<T>): Promise<T> {
    while (this.active >= this.limit) await new Promise((r) => setTimeout(r, 10));
    this.active += 1; try { return await task(); } finally { this.active -= 1; }
  }
}`,
    mistakesRu: ['Оптимизировать только цену токена.', 'Retry без общего deadline/cost budget.'],
    mistakesEn: [
      'Optimizing token price alone.',
      'Retrying without a total deadline and cost budget.',
    ],
    followRu: ['Что можно кэшировать?', 'Как построить load test?'],
    followEn: ['What can be cached?', 'How do you load-test the system?'],
    related: ['ai-routing-fallback', 'ai-observability'],
    reference: sources.evals,
  }),
  topic({
    id: 'ai-release-governance',
    module: 'production-ai',
    level: 'senior',
    titleRu: 'Как выпускать изменения AI-функциональности?',
    titleEn: 'How do you release AI changes?',
    shortRu:
      'Версионируйте model, prompt, retrieval и policy; прогоняйте offline evals, затем canary/shadow с guardrails и rollback. Отделяйте подтверждённые capabilities от рекомендаций и экспериментальных гипотез.',
    shortEn:
      'Version model, prompt, retrieval, and policy; run offline evals, then canary or shadow traffic with guardrails and rollback. Separate verified capabilities from recommendations and experimental hypotheses.',
    detailRu: [
      'Любое изменение компонента может сдвинуть распределение ответов.',
      'Release artifact должен позволять воспроизвести trace и сравнить с baseline.',
      'Incident plan включает provider outage, unsafe output, data exposure и резкий cost drift.',
    ],
    detailEn: [
      'Any component change can shift output distribution.',
      'A release artifact should reproduce traces and compare against a baseline.',
      'Incident plans cover provider outage, unsafe output, data exposure, and sudden cost drift.',
    ],
    mistakesRu: ['Обновлять model alias без eval.', 'Не иметь kill switch/degraded mode.'],
    mistakesEn: [
      'Updating a model alias without evaluation.',
      'Lacking a kill switch or degraded mode.',
    ],
    followRu: ['Что входит в rollback?', 'Как работать с provider deprecation?'],
    followEn: ['What must rollback cover?', 'How do you handle provider deprecation?'],
    related: ['ai-evals-regression', 'ai-observability', 'ai-gateway'],
    reference: sources.evals,
  }),
];
