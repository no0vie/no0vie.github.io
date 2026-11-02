import { validateContent } from './schema';
import { seedContent } from './seed';

export * from './schema';
export * from './skills';

export const resumeData = validateContent(seedContent);
export const { profile, availability, careerMilestones, experience, highlights, projects, skills } =
  resumeData;
