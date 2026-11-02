import type { EvolutionEdge, EvolutionGraph } from '@no0vie/brnchly-core';
import type { Locale, ResumeData } from '../../../content';
import type { CareerGraphConfig } from '../config/careerGraphConfig';

const nodeId = (stageId: string, skillId: string) => `${stageId}:${skillId}`;

export function buildCareerGraph(
  resume: ResumeData,
  locale: Locale,
  config: CareerGraphConfig,
): EvolutionGraph {
  const skillById = new Map(resume.skills.map((skill) => [skill.id, skill]));
  const experienceById = new Map(resume.experience.map((item) => [item.id, item]));
  const appearances = new Map<string, string[]>();
  const nodes = config.stageIds.flatMap((stageId) => {
    const experience = experienceById.get(stageId);
    if (!experience) throw new Error(`Missing career graph experience: ${stageId}`);

    return experience.skills.flatMap((usage) => {
      if (usage.graphVisible === false) return [];
      const skill = skillById.get(usage.skillId);
      if (!skill) throw new Error(`Unknown skill ${usage.skillId} in experience ${stageId}`);
      const achievement = usage.achievementId
        ? experience.achievements.find(({ id }) => id === usage.achievementId)
        : undefined;
      if (usage.achievementId && !achievement)
        throw new Error(`Unknown achievement ${usage.achievementId} in experience ${stageId}`);
      const skillAppearances = appearances.get(skill.id) ?? [];
      skillAppearances.push(stageId);
      appearances.set(skill.id, skillAppearances);

      return [
        {
          id: nodeId(stageId, skill.id),
          title: skill.title[locale],
          description:
            usage.description?.[locale] ?? skill.description?.[locale] ?? achievement?.text[locale],
          branchId: skill.branchId,
          status: 'mastered' as const,
          acquiredAt: experience.start,
          stageId,
          laneId: skill.category,
          evidence: achievement
            ? [{ title: experience.employer[locale], description: achievement.text[locale] }]
            : undefined,
          metadata: {
            skillId: skill.id,
            experienceId: stageId,
            resumeAnchor: `experience-${stageId}`,
            achievementId: usage.achievementId,
          },
        },
      ];
    });
  });

  const evolutionEdges: EvolutionEdge[] = [];
  for (const [skillId, stageIds] of appearances) {
    for (let index = 1; index < stageIds.length; index += 1) {
      const sourceStage = stageIds[index - 1];
      const targetStage = stageIds[index];
      if (!sourceStage || !targetStage) continue;
      const source = nodeId(sourceStage, skillId);
      const target = nodeId(targetStage, skillId);
      evolutionEdges.push({
        id: `evolution:${source}->${target}`,
        source,
        target,
        type: 'evolution',
      });
    }
  }

  const relationEdges = (
    relations: CareerGraphConfig['related'] | CareerGraphConfig['dependencies'],
    type: 'related' | 'dependency',
  ) =>
    relations.flatMap(({ sourceSkillId, targetSkillId }) =>
      config.stageIds.flatMap((stageId) => {
        const source = nodeId(stageId, sourceSkillId);
        const target = nodeId(stageId, targetSkillId);
        if (!nodes.some(({ id }) => id === source) || !nodes.some(({ id }) => id === target))
          return [];
        return [
          { id: `${type}:${source}->${target}`, source, target, type } satisfies EvolutionEdge,
        ];
      }),
    );

  return {
    schemaVersion: 2,
    id: 'career-evolution',
    title: locale === 'ru' ? 'Эволюция карьеры' : 'Career evolution',
    description:
      locale === 'ru'
        ? 'Подтверждённые компетенции по этапам карьеры.'
        : 'Verified capabilities across career stages.',
    stages: config.stageIds.map((id, order) => {
      const item = experienceById.get(id);
      if (!item) throw new Error(`Missing career graph experience: ${id}`);
      return { id, order, title: item.employer[locale], description: item.overview[locale] };
    }),
    lanes: config.lanes.map((lane) => ({
      id: lane.id,
      coordinate: lane.coordinate,
      title: lane.title[locale],
      color: lane.color,
    })),
    branches: config.branches.map((branch) => ({
      id: branch.id,
      title: branch.title[locale],
      color: branch.color,
    })),
    nodes,
    edges: [
      ...evolutionEdges,
      ...relationEdges(config.related, 'related'),
      ...relationEdges(config.dependencies, 'dependency'),
    ],
  };
}
