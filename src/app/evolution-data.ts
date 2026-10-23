import { experience, type Locale } from '../content';

const stageOrder = ['fruct', 'tensor', 'yandex', 'mts'] as const;
type EvolutionStageId = (typeof stageOrder)[number];

const presentation = {
  fruct: {
    highlightIds: ['glass-factory-display', 'fuel-sports-displays', 'display-web-interface'],
    capabilities: {
      ru: ['Прикладная разработка', 'Веб-интерфейсы', 'Java / Kotlin'],
      en: ['Applied software', 'Web interfaces', 'Java / Kotlin'],
    },
  },
  tensor: {
    highlightIds: ['business-interfaces', 'sql-optimization', 'tensor-mentoring'],
    capabilities: {
      ru: ['Продуктовые интерфейсы', 'Работа с данными', 'Наставничество'],
      en: ['Product interfaces', 'Data engineering', 'Mentoring'],
    },
  },
  yandex: {
    highlightIds: ['checkout-addresses', 'microfrontends', 'address-cache', 'production-on-call'],
    capabilities: {
      ru: ['Продуктовая разработка', 'Архитектура', 'Производительность и эксплуатация'],
      en: ['Product engineering', 'Architecture', 'Performance and operations'],
    },
  },
  mts: {
    highlightIds: [
      'campaign-wizard',
      'template-editors',
      'validation-feedback',
      'crm-trends-landing',
    ],
    capabilities: {
      ru: ['Расширяемая архитектура', 'Инженерные инструменты', 'ИИ-инструменты'],
      en: ['Extensible architecture', 'Engineering tooling', 'AI-assisted development'],
    },
  },
} as const satisfies Record<
  EvolutionStageId,
  { highlightIds: readonly string[]; capabilities: Record<Locale, readonly string[]> }
>;

export interface EvolutionStage {
  id: EvolutionStageId;
  employer: string;
  role: string;
  start: string;
  end?: string;
  datePrecision: 'exact' | 'approximate';
  summary: string;
  highlights: string[];
  technologies: string[];
  capabilities: readonly string[];
  resumeAnchor: `experience-${EvolutionStageId}`;
}

export function getEvolutionStages(locale: Locale): EvolutionStage[] {
  return stageOrder.map((id) => {
    const source = experience.find((item) => item.id === id);
    if (!source) throw new Error(`Missing canonical experience for Evolution stage: ${id}`);
    const metadata = presentation[id];
    const highlights = metadata.highlightIds.map((achievementId) => {
      const achievement = source.achievements.find((item) => item.id === achievementId);
      if (!achievement)
        throw new Error(
          `Missing canonical achievement ${achievementId} for Evolution stage: ${id}`,
        );
      return achievement.text[locale];
    });

    return {
      id,
      employer: source.employer[locale],
      role: source.role[locale],
      start: source.start,
      end: source.end,
      datePrecision: source.datePrecision,
      summary: source.overview[locale],
      highlights,
      technologies: source.technologies,
      capabilities: metadata.capabilities[locale],
      resumeAnchor: `experience-${id}`,
    };
  });
}
