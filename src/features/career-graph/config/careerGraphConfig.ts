import type { Localized, SkillBranchId, SkillCategory } from '../../../content';

export interface CareerGraphConfig {
  stageIds: readonly ['fruct', 'tensor', 'yandex-market', 'mts-web-services'];
  lanes: readonly { id: SkillCategory; coordinate: number; title: Localized; color: string }[];
  branches: readonly { id: SkillBranchId; title: Localized; color: string }[];
  related: readonly { sourceSkillId: string; targetSkillId: string }[];
  dependencies: readonly { sourceSkillId: string; targetSkillId: string }[];
}

export const careerGraphConfig: CareerGraphConfig = {
  stageIds: ['fruct', 'tensor', 'yandex-market', 'mts-web-services'],
  lanes: [
    { id: 'frontend', coordinate: -1, title: { ru: 'Фронтенд', en: 'Frontend' }, color: '#4f8cff' },
    {
      id: 'management',
      coordinate: 0,
      title: { ru: 'Архитектура и процессы', en: 'Management' },
      color: '#9568ff',
    },
    { id: 'backend', coordinate: 1, title: { ru: 'Бэкенд', en: 'Backend' }, color: '#25a67a' },
  ],
  branches: [
    { id: 'web-ui', title: { ru: 'Веб-интерфейсы', en: 'Web UI' }, color: '#4f8cff' },
    {
      id: 'application-architecture',
      title: { ru: 'Архитектура приложений', en: 'Application Architecture' },
      color: '#9568ff',
    },
    {
      id: 'data-services',
      title: { ru: 'Данные и сервисы', en: 'Data & Services' },
      color: '#25a67a',
    },
    {
      id: 'engineering-practices',
      title: { ru: 'Инженерные практики', en: 'Engineering Practices' },
      color: '#e09231',
    },
  ],
  related: [],
  dependencies: [],
};
