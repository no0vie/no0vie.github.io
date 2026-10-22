import { validateContent } from './schema';
import { seedContent } from './seed';

export * from './schema';
export * from './skills';

export const { profile, availability, careerMilestones, experience, highlights, projects } =
  validateContent(seedContent);
