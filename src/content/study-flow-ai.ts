import { aiEngineeringTopics } from './preparation-ai-engineering';

const l = (ru: string, en: string) => ({ ru, en });
const reviewPolicy = { againDays: 1, hardDays: 3, goodDays: 7, easyDays: 14 } as const;
const source = (title: string, url: string) => ({ title, url });

const specs = [
  [
    'ai-llm-fundamentals',
    'llm-fundamentals',
    'Основы LLM',
    'LLM fundamentals',
    [
      'ai-tokens-context-window',
      'ai-generation-controls',
      'ai-embeddings-similarity',
      'ai-structured-output',
    ],
    undefined,
    ['Текст → токены', 'Logits → sampling', 'Output → schema validation'],
    ['Text → tokens', 'Logits → sampling', 'Output → schema validation'],
    'Модель предсказывает следующий токен; приложение управляет контекстом, sampling и проверкой результата.',
    'The model predicts the next token; the application manages context, sampling, and result validation.',
  ],
  [
    'ai-rag-engineering',
    'rag',
    'RAG',
    'RAG',
    ['ai-rag-pipeline', 'ai-rag-chunking', 'ai-rag-hybrid-reranking', 'ai-rag-evaluation'],
    '16',
    [
      'Документы → chunks + metadata',
      'Embeddings + lexical index',
      'Query → ACL → retrieve → rerank',
      'Model → citations или отказ',
    ],
    [
      'Documents → chunks + metadata',
      'Embeddings + lexical index',
      'Query → ACL → retrieve → rerank',
      'Model → citations or abstention',
    ],
    'Offline ingestion создаёт индексы; online path проверяет доступ, извлекает evidence и генерирует ответ с provenance.',
    'Offline ingestion creates indexes; the online path enforces access, retrieves evidence, and generates an answer with provenance.',
  ],
  [
    'ai-agent-engineering',
    'ai-agents',
    'AI Agents',
    'AI Agents',
    ['ai-agent-loop', 'ai-tool-calling-contract', 'ai-agent-memory', 'ai-mcp'],
    '17',
    [
      'Goal + state + budget',
      'Model предлагает action',
      'Policy + schema + authorization',
      'Tool/approval → observation → stop',
    ],
    [
      'Goal + state + budget',
      'Model proposes an action',
      'Policy + schema + authorization',
      'Tool/approval → observation → stop',
    ],
    'Оркестратор ограничивает цикл, проверяет предложенные tool calls и завершает работу по явному исходу или бюджету.',
    'The orchestrator bounds the loop, validates proposed tool calls, and stops on an explicit outcome or budget.',
  ],
  [
    'ai-architecture',
    'ai-architecture',
    'AI Architecture',
    'AI Architecture',
    ['ai-gateway', 'ai-routing-fallback', 'ai-streaming-backpressure'],
    '18',
    [
      'Product → typed SDK',
      'Gateway: policy, quota, telemetry',
      'Capability router → provider adapters',
      'Stream events + usage + errors',
    ],
    [
      'Product → typed SDK',
      'Gateway: policy, quota, telemetry',
      'Capability router → provider adapters',
      'Stream events + usage + errors',
    ],
    'Gateway централизует policy и observability, но adapters сохраняют различия capabilities и ошибок провайдеров.',
    'The gateway centralizes policy and observability while adapters preserve provider capability and error differences.',
  ],
  [
    'ai-first-sdd',
    'ai-first-sdd',
    'AI-first и SDD',
    'AI-first and SDD',
    ['ai-sdd-contracts', 'ai-evals-regression', 'ai-human-in-loop'],
    '19',
    [
      'Outcome + risk boundaries',
      'Specification + acceptance criteria',
      'Candidate → evals + human calibration',
      'Release gate → canary → feedback',
    ],
    [
      'Outcome + risk boundaries',
      'Specification + acceptance criteria',
      'Candidate → evals + human calibration',
      'Release gate → canary → feedback',
    ],
    'Спецификация фиксирует outcome, границы и evals до реализации; human oversight усиливается с риском и необратимостью.',
    'The specification defines outcomes, boundaries, and evals before implementation; human oversight increases with risk and irreversibility.',
  ],
  [
    'ai-production',
    'production-ai',
    'Production AI',
    'Production AI',
    ['ai-observability', 'ai-prompt-injection', 'ai-cost-latency', 'ai-release-governance'],
    undefined,
    [
      'Versioned model/prompt/index/policy',
      'Offline eval gate',
      'Canary + traces + budgets',
      'Rollback или controlled rollout',
    ],
    [
      'Versioned model/prompt/index/policy',
      'Offline eval gate',
      'Canary + traces + budgets',
      'Rollback or controlled rollout',
    ],
    'Версионированный release проходит eval gate и canary; traces, safety и cost signals управляют rollout и rollback.',
    'A versioned release passes an eval gate and canary; traces, safety, and cost signals control rollout and rollback.',
  ],
] as const;

export const aiLearningSessions = specs.map(
  (
    [id, module, titleRu, titleEn, topicIds, exerciseId, stepsRu, stepsEn, altRu, altEn],
    moduleIndex,
  ) => {
    const topics = topicIds.map((topicId) => {
      const found = aiEngineeringTopics.find((item) => item.id === topicId);
      if (!found) throw new Error(`Unknown AI topic ${topicId}`);
      return found;
    });
    const cards = [
      ...topics.map((topic) => ({
        id: topic.id.replace(/^ai-/, ''),
        kind: 'concept' as const,
        title: topic.title,
        body: topic.theory.shortAnswer,
        details: {
          ru: topic.theory.detailedExplanation.ru.join('\n\n'),
          en: topic.theory.detailedExplanation.en.join('\n\n'),
        },
        estimatedMinutes: 3,
      })),
      {
        id: 'architecture',
        kind: 'diagram' as const,
        title: l('Архитектурная схема', 'Architecture diagram'),
        body: l(
          'Пройдите путь данных и назовите trust boundaries.',
          'Follow the data path and identify trust boundaries.',
        ),
        estimatedMinutes: 2,
        diagram: {
          steps: stepsRu.map((ru, i) => l(ru, stepsEn[i] ?? ru)),
          alternative: l(altRu, altEn),
        },
      },
      ...(exerciseId
        ? [
            {
              id: 'practice',
              kind: 'mini-task' as const,
              title: l(`Практика ${exerciseId}`, `Practice ${exerciseId}`),
              body: l(
                'Откройте полноформатное задание: зафиксируйте contracts, failure paths, tests и production trade-offs.',
                'Open the full exercise: define contracts, failure paths, tests, and production tradeoffs.',
              ),
              estimatedMinutes: 3,
            },
          ]
        : []),
      {
        id: 'check',
        kind: 'self-check' as const,
        title: l('Самопроверка', 'Self-check'),
        body: l(
          'Ответьте без преувеличения возможностей модели.',
          'Answer without overstating model capabilities.',
        ),
        estimatedMinutes: 2,
        assessment: {
          question: l(
            'Какие части решения вероятностны, какие детерминированы и где применяются ограничения?',
            'Which parts are probabilistic, which are deterministic, and where are controls enforced?',
          ),
          criteria: [
            l(
              'Названы typed boundaries и validation.',
              'Typed boundaries and validation are named.',
            ),
            l(
              'Есть budgets, observability и failure path.',
              'Budgets, observability, and a failure path are included.',
            ),
            l(
              'Capability отделена от рекомендации и гипотезы.',
              'Capability is separated from recommendation and hypothesis.',
            ),
          ],
        },
      },
    ];
    return {
      id,
      version: 1,
      title: l(`AI Engineering: ${titleRu}`, `AI Engineering: ${titleEn}`),
      goal: l(
        `Разобрать модуль «${titleRu}» и применить его в production design.`,
        `Explain ${titleEn} and apply it to a production design.`,
      ),
      category: 'ai-engineering' as const,
      module,
      tags: ['ai-engineering', module],
      difficulty: 'senior' as const,
      estimatedMinutes: cards.reduce((sum, card) => sum + card.estimatedMinutes, 0) + 1,
      cards,
      sourceTopicIds: [...topicIds],
      sourceExerciseIds: exerciseId ? [exerciseId] : [],
      sourceReferences: [
        ...topicIds.map((id) => ({ kind: 'topic' as const, id })),
        ...(exerciseId ? [{ kind: 'exercise' as const, id: exerciseId }] : []),
      ],
      prerequisiteSessionIds: moduleIndex ? [specs[moduleIndex - 1][0]] : [],
      relatedSessionIds: [specs[(moduleIndex + 1) % specs.length][0]],
      conceptIds: [...topicIds],
      reviewPolicy,
      sources: [
        source(
          module === 'rag'
            ? 'Retrieval-Augmented Generation'
            : module === 'ai-agents'
              ? 'ReAct'
              : 'NIST AI Risk Management Framework',
          module === 'rag'
            ? 'https://arxiv.org/abs/2005.11401'
            : module === 'ai-agents'
              ? 'https://arxiv.org/abs/2210.03629'
              : 'https://www.nist.gov/itl/ai-risk-management-framework',
        ),
      ],
      updatedAt: '2026-11-13',
    };
  },
);
