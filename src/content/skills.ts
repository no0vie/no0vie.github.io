import { skillGroupSchema, type SkillGroup } from './schema';

export const skillGroups = [
  {
    id: 'core-current',
    label: { ru: 'Основной стек', en: 'Core and current' },
    skills: ['React', 'TypeScript', 'JavaScript', 'MobX', 'Next.js', 'Ant Design'],
  },
  {
    id: 'architecture-state',
    label: { ru: 'Архитектура и состояние', en: 'Architecture and state' },
    skills: ['Microfrontends', 'Modular monolith', 'Redux', 'Redux-Observable', 'Vuex'],
  },
  {
    id: 'testing-tooling',
    label: { ru: 'Тестирование и инструменты', en: 'Testing and tooling' },
    skills: ['Playwright', 'Jest', 'Testament', 'Vite', 'Webpack', 'Grafana', 'Apiary'],
  },
  {
    id: 'backend-data',
    label: { ru: 'Бэкенд и данные', en: 'Backend and data' },
    skills: ['Node.js', 'NestJS', 'Python', 'PostgreSQL', 'SQL', 'Memcached'],
  },
  {
    id: 'prior-specialized',
    label: { ru: 'Предыдущий специализированный опыт', en: 'Prior specialized experience' },
    skills: ['WaSaby', 'Less', 'Vue 3', 'Vue Router'],
  },
] satisfies SkillGroup[];

skillGroups.forEach((group) => skillGroupSchema.parse(group));
