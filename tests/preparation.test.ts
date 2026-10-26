import { describe, expect, it } from 'vitest';
import {
  learningPaths,
  preparationTopics,
  preparationTopicSchema,
  resolveExerciseNavigation,
} from '../src/content/preparation';
import { interviewExercises } from '../src/content/interview';
import { preparationTopicSlugs } from '../src/content/preparation-manifest';

describe('Interview Preparation content model', () => {
  it('validates unique bilingual topics and all typed relations', () => {
    expect(preparationTopics.length).toBeGreaterThanOrEqual(9);
    for (const topic of preparationTopics) {
      expect(preparationTopicSchema.parse(topic)).toEqual(topic);
      expect(topic.title.ru).not.toBe('');
      expect(topic.title.en).not.toBe('');
      expect(topic.theory.shortAnswer.ru).not.toBe('');
      expect(topic.theory.shortAnswer.en).not.toBe('');
      for (const exerciseId of topic.practiceIds) {
        expect(interviewExercises.some(({ id }) => id === exerciseId)).toBe(true);
      }
    }
    expect(new Set(preparationTopics.map(({ id }) => id)).size).toBe(preparationTopics.length);
    expect(new Set(preparationTopics.map(({ slug }) => slug)).size).toBe(preparationTopics.length);
    expect(preparationTopics.map(({ slug }) => slug)).toEqual([...preparationTopicSlugs]);
  });

  it('provides five senior paths and a non-evaluative weak-spots recovery path', () => {
    expect(learningPaths.map(({ id }) => id)).toEqual([
      'senior-javascript-browser',
      'senior-react-frontend',
      'senior-node-backend',
      'senior-system-design',
      'senior-fullstack',
      'weak-spots',
    ]);
    for (const path of learningPaths) {
      expect(path.topicIds.length).toBeGreaterThan(0);
      expect(path.estimatedMinutes).toBeGreaterThan(0);
    }
  });
});

describe('exercise set navigation', () => {
  it('uses a selected learning path when it contains the exercise', () => {
    const navigation = resolveExerciseNavigation('event-loop-execution-order', {
      pathId: 'senior-javascript-browser',
    });
    expect(navigation.context).toBe('senior-javascript-browser');
    expect(navigation.position).toBe(1);
    expect(navigation.previous).toBeUndefined();
    expect(navigation.next).toBeDefined();
  });

  it('falls back to stable catalog order for a direct URL', () => {
    const navigation = resolveExerciseNavigation('implement-promise-all');
    expect(navigation.position).toBe(2);
    expect(navigation.total).toBe(interviewExercises.length);
    expect(navigation.previous?.slug).toBe('event-loop-execution-order');
    expect(navigation.next?.slug).toBe('concurrency-limiter');
  });
});
