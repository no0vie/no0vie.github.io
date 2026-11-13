const reading = [
  {
    label: 'NIST AI Risk Management Framework',
    url: 'https://www.nist.gov/itl/ai-risk-management-framework',
  },
  { label: 'OWASP Top 10 for LLM Applications', url: 'https://genai.owasp.org/llm-top-10/' },
];

function localized(input: {
  title: string;
  description: string;
  problem: string;
  requirements: string[];
  starterCode: string;
  solution: string;
  explanation: string[];
  edgeCases: string[];
  followUps: string[];
}) {
  return {
    title: input.title,
    description: input.description,
    problem: input.problem,
    examples: [input.description],
    requirements: input.requirements,
    starterCode: { label: 'TypeScript starter', language: 'typescript', code: input.starterCode },
    hints: [
      'Сначала зафиксируйте типизированные границы и инварианты. / Start with typed boundaries and invariants.',
      'Отделите вероятностный компонент от детерминированной проверки. / Separate probabilistic work from deterministic validation.',
      'Добавьте timeout, cancellation, observability и failure path. / Add timeout, cancellation, observability, and a failure path.',
    ],
    solution: {
      blocks: [{ label: 'Reference design', language: 'typescript', code: input.solution }],
      alternative: [
        'Допустимы иные решения, если они сохраняют контракт, безопасность и проверяемость. / Alternatives are valid if they preserve contract, safety, and testability.',
      ],
    },
    explanation: input.explanation,
    edgeCases: input.edgeCases,
    complexity: [
      'Обоснуйте latency, memory, token/cost budget и внешние I/O. / Explain latency, memory, token/cost budget, and external I/O.',
    ],
    followUps: input.followUps,
    production: [
      'Не вызывайте реальную LLM в браузере задания: используйте внедряемые adapters и deterministic fixtures. / Do not call a real LLM from the exercise UI; use injected adapters and deterministic fixtures.',
    ],
    furtherReading: reading,
  };
}

const rag = {
  title: 'Простой RAG / Simple RAG',
  description:
    'Постройте typed ingestion и retrieval pipeline с цитатами. / Build a typed ingestion and retrieval pipeline with citations.',
  problem:
    'Реализуйте in-memory RAG: chunk documents, embed through an injected adapter, retrieve top-k with ACL filtering, compose a grounded request and reject unsupported citations. / Implement in-memory RAG: chunk documents, embed through an injected adapter, retrieve top-k with ACL filtering, compose a grounded request, and reject unsupported citations.',
  requirements: [
    'Stable chunk/source IDs and metadata.',
    'ACL filtering before returning context.',
    'Deterministic embedding/model fixtures in tests.',
    'Citations must reference retrieved chunks.',
    'Explicit no-evidence result.',
  ],
  starterCode: `interface Embedder { embed(texts: readonly string[]): Promise<readonly number[][]> }
interface Generator { answer(input: { query: string; context: readonly Chunk[] }): Promise<Answer> }
export function createRag(embedder: Embedder, generator: Generator) { /* implement */ }`,
  solution: `export function createRag(embedder: Embedder, generator: Generator) {
  const chunks: Chunk[] = [];
  return {
    async ingest(docs: readonly Document[]) { chunks.push(...chunkDocuments(docs)); await index(chunks, embedder); },
    async answer(query: string, principal: Principal) {
      const hits = (await search(query, embedder)).filter((x) => canRead(principal, x));
      if (!hits.length) return { kind: 'no-evidence' as const };
      const answer = await generator.answer({ query, context: hits.slice(0, 5) });
      assertCitations(answer, new Set(hits.map((x) => x.id)));
      return { kind: 'answer' as const, ...answer };
    },
  };
}`,
  explanation: [
    'Retrieval and generation are independently replaceable and testable.',
    'Authorization is deterministic and outside the model.',
  ],
  edgeCases: [
    'Empty corpus or query.',
    'Deleted/outdated document version.',
    'Zero-length vector or embedding dimension mismatch.',
    'Model cites a chunk it did not receive.',
  ],
  followUps: [
    'Add hybrid retrieval and reranking.',
    'Design recall@k and groundedness evals.',
    'Support incremental re-indexing and deletion.',
  ],
};

const agent = {
  title: 'Агент с инструментами / Tool-calling agent',
  description:
    'Реализуйте bounded agent loop с typed tools. / Implement a bounded agent loop with typed tools.',
  problem:
    'Оркестратор принимает proposed tool calls как недоверенные данные, проверяет schema/authorization, ограничивает шаги и требует approval для side effects. / Treat proposed tool calls as untrusted data, validate schema and authorization, bound steps, and require approval for side effects.',
  requirements: [
    'Typed tool registry and argument validation.',
    'Maximum steps, timeout, and cancellation.',
    'Read/write distinction and approval result.',
    'Structured trace without secrets.',
    'Explicit finish, refusal, and budget-exceeded outcomes.',
  ],
  starterCode: `type Decision = { type: 'finish'; text: string } | { type: 'tool'; name: string; args: unknown };
export async function runAgent(goal: string, deps: AgentDeps): Promise<AgentResult> { /* implement */ }`,
  solution: `export async function runAgent(goal: string, deps: AgentDeps): Promise<AgentResult> {
  let state = createState(goal);
  for (let step = 0; step < deps.maxSteps; step += 1) {
    const decision = await deps.model.decide(state, deps.signal);
    if (decision.type === 'finish') return { kind: 'completed', text: decision.text, trace: state.trace };
    const tool = deps.tools.get(decision.name);
    if (!tool) return { kind: 'refused', reason: 'unknown-tool', trace: state.trace };
    const args = tool.schema.parse(decision.args);
    deps.authorize(tool, args);
    if (tool.sideEffect && !deps.approved(decision)) return { kind: 'approval-required', call: decision };
    state = append(state, decision, await tool.run(args, deps.signal));
  }
  return { kind: 'budget-exceeded', trace: state.trace };
}`,
  explanation: [
    'The orchestrator owns policy; model output never grants authority.',
    'Bounded execution makes failures and costs inspectable.',
  ],
  edgeCases: [
    'Unknown or malformed tool call.',
    'Repeated equivalent side effect.',
    'Tool timeout or partial failure.',
    'Prompt-injected tool result.',
  ],
  followUps: [
    'Make write tools idempotent.',
    'Add resumable approval.',
    'Evaluate task success and policy violations.',
  ],
};

const gateway = {
  title: 'TypeScript SDK для AI Gateway / TypeScript AI Gateway SDK',
  description:
    'Спроектируйте provider-neutral core без потери capabilities. / Design a provider-neutral core without erasing capabilities.',
  problem:
    'Опишите SDK для generate/stream, model capabilities, typed errors, retries, usage and trace propagation. / Define an SDK for generate/stream, model capabilities, typed errors, retries, usage, and trace propagation.',
  requirements: [
    'Discriminated request/result/event types.',
    'AbortSignal and deadlines.',
    'Typed transient, policy, quota, and provider errors.',
    'Capability discovery and explicit provider extensions.',
    'No retry after visible partial stream output.',
  ],
  starterCode: `interface AiGateway { generate(request: GenerateRequest, options?: RequestOptions): Promise<GenerateResult>; stream(request: GenerateRequest, options?: RequestOptions): AsyncIterable<AiEvent>; }`,
  solution: `export type AiEvent =
  | { type: 'text-delta'; value: string }
  | { type: 'tool-call'; call: ToolCall }
  | { type: 'usage'; usage: Usage }
  | { type: 'done'; finishReason: FinishReason };
export interface AiGateway {
  generate(request: GenerateRequest, options?: RequestOptions): Promise<GenerateResult>;
  stream(request: GenerateRequest, options?: RequestOptions): AsyncIterable<AiEvent>;
  capabilities(model: ModelId): Promise<ModelCapabilities>;
}
export class AiGatewayError extends Error { constructor(readonly kind: 'transient'|'quota'|'policy'|'invalid-request', message: string, readonly retryAfterMs?: number) { super(message); } }`,
  explanation: [
    'A stable core supports portability while capability discovery prevents lowest-common-denominator design.',
    'Error classification is required for safe retry and fallback.',
  ],
  edgeCases: [
    'Client disconnect during stream.',
    'Provider emits usage only at completion.',
    'Fallback lacks tools or schema support.',
    'Quota response includes retry-after.',
  ],
  followUps: [
    'Version the public SDK.',
    'Add circuit breakers and routing.',
    'Define redaction and telemetry hooks.',
  ],
};

const evals = {
  title: 'Evals для AI-функциональности / AI feature evals',
  description:
    'Разработайте versioned eval suite и release gate. / Build a versioned eval suite and release gate.',
  problem:
    'Создайте deterministic checks, rubric-based scoring, slices and baseline comparison for a grounded assistant. / Create deterministic checks, rubric-based scoring, slices, and baseline comparison for a grounded assistant.',
  requirements: [
    'Versioned cases and artifacts.',
    'Normal, edge, unanswerable, multilingual, and adversarial slices.',
    'Deterministic schema/citation/policy checks.',
    'Calibrated judge abstraction, never an unquestioned oracle.',
    'Per-slice regression thresholds.',
  ],
  starterCode: `type EvalCase = { id: string; slice: string; input: string; assertions: readonly Assertion[] };
export async function evaluate(candidate: Candidate, suite: readonly EvalCase[]): Promise<EvalReport> { /* implement */ }`,
  solution: `export async function evaluate(candidate: Candidate, suite: readonly EvalCase[]): Promise<EvalReport> {
  const results = [];
  for (const test of suite) {
    const output = await candidate.run(test.input);
    const deterministic = test.assertions.flatMap((assert) => assert(output));
    const rubric = await candidate.judge.score({ test, output });
    results.push({ id: test.id, slice: test.slice, failures: deterministic, rubric });
  }
  return summarizeBySlice(results);
}
export const passesGate = (candidate: EvalReport, baseline: EvalReport) =>
  candidate.slices.every((slice) => slice.criticalFailures === 0 && slice.score >= baseline.score - 0.02);`,
  explanation: [
    'Per-slice gates prevent a high average from hiding critical regressions.',
    'Judge results are versioned and calibrated against human review.',
  ],
  edgeCases: [
    'Judge timeout or malformed score.',
    'Test-data leakage into prompts.',
    'Flaky external dependency.',
    'Baseline model no longer available.',
  ],
  followUps: [
    'Add confidence intervals.',
    'Design human adjudication.',
    'Connect failures to production traces.',
  ],
};

const exercise = (id: string, slug: string, input: typeof rag, minutes: number) => ({
  id,
  slug,
  category: 'ai-engineering',
  difficulty: 'senior',
  estimatedMinutes: minutes,
  tags: ['ai-engineering', 'typescript', 'production'],
  runtime: 'node',
  content: { ru: localized(input), en: localized(input) },
});

export const aiEngineeringExercises = [
  exercise('16', 'build-simple-rag', rag, 90),
  exercise('17', 'tool-calling-agent', agent, 90),
  exercise('18', 'typescript-ai-gateway-sdk', gateway, 75),
  exercise('19', 'ai-evaluation-suite', evals, 75),
];
