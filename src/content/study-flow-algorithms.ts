import { algorithmPatterns, algorithmProblems } from './algorithmic-patterns';
import type { LearningSession } from './study-flow';

const reviewPolicy = { againDays: 1, hardDays: 3, goodDays: 7, easyDays: 14 } as const;
const l = (ru: string, en: string) => ({ ru, en });

export const algorithmLearningSessions: LearningSession[] = algorithmPatterns.map(
  (pattern, index) => {
    const problems = pattern.practiceProblemIds
      .map((id) => algorithmProblems.find((problem) => problem.id === id))
      .filter((problem) => problem !== undefined);
    return {
      id: `algorithm-${pattern.id}`,
      version: 1,
      title: pattern.name,
      goal: l(
        `Распознать ${pattern.name.ru} по ограничениям, обосновать выбор и оценить сложность.`,
        `Recognize ${pattern.name.en} from constraints, justify the choice, and estimate complexity.`,
      ),
      category: 'algorithms',
      priority: pattern.priority,
      module: 'algorithmic-patterns',
      tags: ['algorithms', 'problem-recognition', pattern.id],
      difficulty: index < 8 ? 'hard' : 'senior',
      estimatedMinutes: 15,
      sourceTopicIds: [],
      sourceExerciseIds: pattern.id === 'hash-map-set' ? ['08'] : [],
      sourceReferences: [
        { kind: 'pattern', id: pattern.id },
        ...(pattern.id === 'hash-map-set' ? [{ kind: 'exercise' as const, id: '08' }] : []),
      ],
      prerequisiteSessionIds: [],
      relatedSessionIds: [],
      conceptIds: [`algorithm-pattern:${pattern.id}`],
      reviewPolicy,
      sources: pattern.sources,
      updatedAt: '2026-11-15',
      cards: [
        {
          id: 'recognize',
          kind: 'hook',
          title: l('Сигналы задачи', 'Problem signals'),
          body: l(
            pattern.recognitionSignals.map((x) => x.ru).join(' '),
            pattern.recognitionSignals.map((x) => x.en).join(' '),
          ),
          estimatedMinutes: 3,
        },
        {
          id: 'intuition',
          kind: 'concept',
          title: l('Интуиция и границы', 'Intuition and boundaries'),
          body: pattern.intuition,
          details: l(
            `${pattern.useWhen.ru} ${pattern.avoidWhen.ru}`,
            `${pattern.useWhen.en} ${pattern.avoidWhen.en}`,
          ),
          estimatedMinutes: 3,
          diagram: pattern.diagram,
        },
        {
          id: 'typescript',
          kind: 'worked-example',
          title: l('Канонический TypeScript', 'Canonical TypeScript'),
          body: l(
            `Откройте реализацию и проследите инвариант. Сложность: ${pattern.complexity.ru}`,
            `Open the implementation and trace the invariant. Complexity: ${pattern.complexity.en}`,
          ),
          details: l(pattern.canonicalTypeScript, pattern.canonicalTypeScript),
          estimatedMinutes: 3,
        },
        {
          id: 'practice',
          kind: 'mini-task',
          title: l('Практика: выберите подход', 'Practice: choose an approach'),
          body: l(
            problems.map((x) => x.title.ru).join(' · '),
            problems.map((x) => x.title.en).join(' · '),
          ),
          details: l(
            'Используйте режимы Recognize и Solve: они перемешивают задачи и не раскрывают паттерн до ответа.',
            'Use Recognize and Solve modes: they shuffle prompts and hide the pattern until answering.',
          ),
          estimatedMinutes: 3,
        },
        {
          id: 'check',
          kind: 'self-check',
          title: l('Контроль выбора', 'Choice check'),
          body: l(
            'Назовите сигнал, инвариант и сложность до просмотра критериев.',
            'Name the signal, invariant, and complexity before revealing criteria.',
          ),
          estimatedMinutes: 2,
          assessment: {
            question: pattern.checkQuestions[0],
            criteria: [pattern.checkQuestions[1], ...pattern.tradeoffs],
          },
        },
      ],
    };
  },
);
