import { experience, profile, projects } from '../../content';
import { skillGroups } from '../../content/skills';
import type { CareerItem, Locale, Profile, Project } from '../../content/schema';

export type CvProjectInput = Pick<Project, 'slug' | 'title' | 'summary' | 'public'> & {
  stage?: unknown;
};

interface CoreSkillGroup {
  id: 'frontend' | 'architecture' | 'backend-data' | 'testing-practices';
  label: Record<Locale, string>;
  skills: string[];
}

export interface ProfessionalCv {
  locale: Locale;
  profile: Profile;
  experience: CareerItem[];
  coreSkills: CoreSkillGroup[];
  releasedProjects: CvProjectInput[];
  portfolioUrl: string;
  labels: {
    about: string;
    experience: string;
    coreSkills: string;
    education: string;
    releasedProjects: string;
    portfolio: string;
  };
}

const group = (id: (typeof skillGroups)[number]['id']) =>
  skillGroups.find((item) => item.id === id)!.skills;

const coreSkills: CoreSkillGroup[] = [
  {
    id: 'frontend',
    label: { ru: 'Фронтенд', en: 'Frontend' },
    skills: group('core-current'),
  },
  {
    id: 'architecture',
    label: { ru: 'Архитектура', en: 'Architecture' },
    skills: group('architecture-state'),
  },
  {
    id: 'backend-data',
    label: { ru: 'Бэкенд и данные', en: 'Backend & Data' },
    skills: group('backend-data'),
  },
  {
    id: 'testing-practices',
    label: { ru: 'Тестирование и инженерные практики', en: 'Testing & Engineering Practices' },
    skills: [...group('testing-tooling'), ...group('engineering-practices')],
  },
];

const labels: Record<Locale, ProfessionalCv['labels']> = {
  ru: {
    about: 'О себе',
    experience: 'Опыт работы',
    coreSkills: 'Ключевые компетенции',
    education: 'Образование и языки',
    releasedProjects: 'Завершённые проекты',
    portfolio: 'Подробнее о проектах, профессиональных кейсах и технологиях:',
  },
  en: {
    about: 'About',
    experience: 'Experience',
    coreSkills: 'Core skills',
    education: 'Education and languages',
    releasedProjects: 'Released projects',
    portfolio: 'Explore projects, case studies, and technologies at',
  },
};

export function releasedProjects(items: readonly CvProjectInput[]): CvProjectInput[] {
  return items.filter((item) => item.public && item.stage === 'released');
}

export function createProfessionalCv(
  locale: Locale,
  siteUrl = 'https://no0vie.github.io',
): ProfessionalCv {
  return {
    locale,
    profile,
    experience,
    coreSkills,
    releasedProjects: releasedProjects(projects),
    portfolioUrl: `${siteUrl.replace(/\/$/, '')}/${locale}/`,
    labels: labels[locale],
  };
}
