import { validateContent } from './schema';
import { seedContent } from './seed';

export * from './schema';
export * from './skills';

export const { profile, experience, highlights, projects } = validateContent(seedContent);
