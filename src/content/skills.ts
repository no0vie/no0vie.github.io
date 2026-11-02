import { resumeSkillSchema, skillGroupSchema, type ResumeSkill, type SkillGroup } from './schema';

export const careerSkills = [
  {
    id: 'qml-cpp',
    category: 'frontend',
    branchId: 'web-ui',
    title: { ru: 'QML/C++', en: 'QML/C++' },
  },
  {
    id: 'web-ui',
    category: 'frontend',
    branchId: 'web-ui',
    title: { ru: 'Веб-интерфейсы', en: 'Web UI' },
  },
  {
    id: 'spring-boot',
    category: 'backend',
    branchId: 'data-services',
    title: { ru: 'Spring Boot', en: 'Spring Boot' },
  },
  {
    id: 'typescript',
    category: 'frontend',
    branchId: 'web-ui',
    title: { ru: 'TypeScript', en: 'TypeScript' },
  },
  {
    id: 'postgresql',
    category: 'backend',
    branchId: 'data-services',
    title: { ru: 'PostgreSQL', en: 'PostgreSQL' },
  },
  {
    id: 'sql-optimization',
    category: 'backend',
    branchId: 'data-services',
    title: { ru: 'Оптимизация SQL', en: 'SQL optimization' },
  },
  {
    id: 'mentoring',
    category: 'management',
    branchId: 'engineering-practices',
    title: { ru: 'Наставничество', en: 'Mentoring' },
  },
  { id: 'react', category: 'frontend', branchId: 'web-ui', title: { ru: 'React', en: 'React' } },
  {
    id: 'microfrontends',
    category: 'management',
    branchId: 'application-architecture',
    title: { ru: 'Микрофронтенды', en: 'Microfrontends' },
  },
  {
    id: 'frontend-performance',
    category: 'frontend',
    branchId: 'engineering-practices',
    title: { ru: 'Производительность фронтенда', en: 'Frontend performance' },
  },
  {
    id: 'caching',
    category: 'backend',
    branchId: 'data-services',
    title: { ru: 'Кеширование', en: 'Caching' },
  },
  {
    id: 'monitoring',
    category: 'management',
    branchId: 'engineering-practices',
    title: { ru: 'Мониторинг production', en: 'Production monitoring' },
  },
  {
    id: 'ab-testing',
    category: 'management',
    branchId: 'engineering-practices',
    title: { ru: 'A/B-тестирование', en: 'A/B testing' },
  },
  {
    id: 'modular-frontend',
    category: 'management',
    branchId: 'application-architecture',
    title: { ru: 'Модульная архитектура фронтенда', en: 'Modular frontend architecture' },
  },
  {
    id: 'cascade-editor',
    category: 'frontend',
    branchId: 'application-architecture',
    title: { ru: 'Редактор каскадных кампаний', en: 'Cascade campaign editor' },
  },
  {
    id: 'api-design',
    category: 'backend',
    branchId: 'data-services',
    title: { ru: 'Проектирование API', en: 'API design' },
  },
  {
    id: 'ux-validation',
    category: 'frontend',
    branchId: 'web-ui',
    title: { ru: 'UX и валидация', en: 'UX validation' },
  },
  {
    id: 'nestjs-bff',
    category: 'backend',
    branchId: 'data-services',
    title: { ru: 'NestJS / BFF', en: 'NestJS / BFF' },
  },
  {
    id: 'architecture-tradeoffs',
    category: 'management',
    branchId: 'application-architecture',
    title: { ru: 'Архитектурные компромиссы', en: 'Architecture trade-offs' },
  },
] satisfies ResumeSkill[];

careerSkills.forEach((skill) => resumeSkillSchema.parse(skill));

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
