import { validateEvolutionGraph } from '@no0vie/brnchly-core';
import { describe, expect, it } from 'vitest';
import { buildCareerGraph } from '../src/features/career-graph/adapter/buildCareerGraph';
import { careerGraphConfig } from '../src/features/career-graph/config/careerGraphConfig';
import { resumeData } from '../src/content';
import type { ResumeData, ResumeSkill } from '../src/content';

const topology = (graph: ReturnType<typeof buildCareerGraph>) => ({
  stages: graph.stages?.map(({ id, order }) => ({ id, order })),
  lanes: graph.lanes?.map(({ id, coordinate }) => ({ id, coordinate })),
  branches: graph.branches.map(({ id }) => id),
  nodes: graph.nodes.map(({ id, branchId, stageId, laneId }) => ({
    id,
    branchId,
    stageId,
    laneId,
  })),
  edges: graph.edges,
});

describe('buildCareerGraph', () => {
  it('builds a valid deterministic v2 graph with the configured stages and lanes', () => {
    const first = buildCareerGraph(resumeData, 'en', careerGraphConfig);
    const second = buildCareerGraph(resumeData, 'en', careerGraphConfig);

    expect(first).toEqual(second);
    expect(first.schemaVersion).toBe(2);
    expect(first.stages?.map(({ id }) => id)).toEqual([
      'fruct',
      'tensor',
      'yandex-market',
      'mts-web-services',
    ]);
    expect(first.lanes?.map(({ id, coordinate }) => ({ id, coordinate }))).toEqual([
      { id: 'frontend', coordinate: -1 },
      { id: 'management', coordinate: 0 },
      { id: 'backend', coordinate: 1 },
    ]);
    expect(validateEvolutionGraph(first)).toEqual({ valid: true, issues: [] });
  });

  it('uses stable stage-specific node IDs and creates evolution edges only between confirmed appearances', () => {
    const graph = buildCareerGraph(resumeData, 'en', careerGraphConfig);

    expect(graph.nodes).toContainEqual(
      expect.objectContaining({ id: 'tensor:typescript', stageId: 'tensor' }),
    );
    expect(graph.nodes).toContainEqual(
      expect.objectContaining({ id: 'yandex-market:typescript', stageId: 'yandex-market' }),
    );
    expect(graph.edges).toContainEqual({
      id: 'evolution:tensor:typescript->yandex-market:typescript',
      source: 'tensor:typescript',
      target: 'yandex-market:typescript',
      type: 'evolution',
    });
    expect(new Set(graph.nodes.map(({ id }) => id)).size).toBe(graph.nodes.length);
    expect(new Set(graph.edges.map(({ id }) => id)).size).toBe(graph.edges.length);
  });

  it('keeps RU and EN topology identical', () => {
    const ru = buildCareerGraph(resumeData, 'ru', careerGraphConfig);
    const en = buildCareerGraph(resumeData, 'en', careerGraphConfig);

    expect(topology(ru)).toEqual(topology(en));
    expect(ru.nodes.map(({ title }) => title)).not.toEqual(en.nodes.map(({ title }) => title));
  });

  it('propagates skill usage changes without manual graph edits and does not mutate resume data', () => {
    const skill: ResumeSkill = {
      id: 'test-propagation',
      category: 'frontend',
      branchId: 'engineering-practices',
      title: { ru: 'Тест распространения', en: 'Propagation test' },
    };
    const input: ResumeData = structuredClone(resumeData);
    input.skills.push(skill);
    input.experience.find(({ id }) => id === 'tensor')?.skills.push({ skillId: skill.id });
    const before = structuredClone(input);

    const tensorOnly = buildCareerGraph(input, 'en', careerGraphConfig);
    expect(tensorOnly.nodes.map(({ id }) => id)).toContain('tensor:test-propagation');
    expect(input).toEqual(before);

    input.experience
      .find(({ id }) => id === 'mts-web-services')
      ?.skills.push({ skillId: skill.id });
    const continued = buildCareerGraph(input, 'en', careerGraphConfig);
    expect(continued.nodes.map(({ id }) => id)).toEqual(
      expect.arrayContaining(['tensor:test-propagation', 'mts-web-services:test-propagation']),
    );
    expect(continued.edges).toContainEqual({
      id: 'evolution:tensor:test-propagation->mts-web-services:test-propagation',
      source: 'tensor:test-propagation',
      target: 'mts-web-services:test-propagation',
      type: 'evolution',
    });

    input.experience.find(({ id }) => id === 'tensor')!.skills = [];
    const mtsOnly = buildCareerGraph(input, 'en', careerGraphConfig);
    expect(mtsOnly.nodes.map(({ id }) => id)).not.toContain('tensor:test-propagation');
    expect(mtsOnly.edges.some(({ id }) => id.includes('test-propagation'))).toBe(false);
  });
});
