import type { Achievement, Content, Localized } from './schema';

const localized = (ru: string, en: string): Localized => ({ ru, en });
const achievement = (id: string, ru: string, en: string): Achievement => ({
  id,
  text: localized(ru, en),
  evidence: 'confirmed',
  publishable: true,
});

// Source: SPEC.md §7–8 and the repository's pre-existing public index.html.
// Remaining editorial TODOs (not public claims): address experiment outcome and
// AI-assisted testing status. Contacts, English self-assessment and project statuses are owner-approved.
export const seedContent = {
  profile: {
    name: localized('Евгений Новиков', 'Eugene Novikov'),
    role: localized('Старший разработчик ПО', 'Senior Software Developer'),
    about: localized(
      'Разрабатываю программные продукты с 2017 года: от корпоративных бизнес-приложений до оформления заказов и платформ управления коммуникациями. Беру ответственность за архитектуру фронтенда и продуктовые сценарии, участвую в дежурствах и расследовании инцидентов, провожу ревью кода и помогаю коллегам расти.',
      'I have built software products since 2017, from corporate business applications to checkout and communication-management platforms. I take ownership of frontend architecture and product flows, participate in production on-call and incident investigation, review code, and mentor colleagues.',
    ),
    education: localized(
      'Ярославский государственный университет им. П. Г. Демидова. Бакалавр по направлению «Прикладная математика и информатика», 2018. Английский — B1 (самооценка): читаю техническую документацию и уверенно общаюсь по рабочим вопросам.',
      'P. G. Demidov Yaroslavl State University. Bachelor’s degree in Applied Mathematics and Informatics, 2018. English — B1 (self-assessed): I read technical documentation and communicate comfortably on work topics.',
    ),
    github: 'https://github.com/no0vie',

    availability: localized('Рассматриваю предложения', 'Open to opportunities'),
    contacts: {
      emails: ['eugene.malin765@gmail.com', 'evgeniys-nov@yandex.ru'],
      telegram: 'https://t.me/no_0vie',
      whatsapp: 'https://wa.me/qr/XFZZQSNXJCSBL1',
    },
    updated: '2026-10-22',
  },
  highlights: [
    localized(
      'Спроектировал расширяемый мастер каскадных кампаний: подключение нового канала или замена формы обычно занимали 1–2 рабочих дня с учётом исправлений после тестирования.',
      'Designed an extensible cascade campaign wizard where adding a channel or replacing a form typically took 1–2 working days, including post-test fixes.',
    ),
    localized(
      'Участвовал в оптимизации кеширования адресных данных в Memcached, снизившей нагрузку на адресный сервис.',
      'Contributed to Memcached address-data caching improvements that reduced load on the address service.',
    ),
    localized(
      'Совмещал продуктовую разработку с дежурствами в продакшене, расследованием инцидентов и наставничеством.',
      'Combined product development with production on-call work, incident investigation, and mentoring.',
    ),
  ],
  experience: [
    {
      id: 'mts',
      employer: localized('МТС Web Services', 'MTS Web Services'),
      role: localized('Старший разработчик ПО', 'Senior Software Developer'),
      start: '2024-05',
      overview: localized(
        'Разработка продуктов OMNI и ORP: интерфейсы управления кампаниями, архитектура фронтенда и инженерные инструменты.',
        'Development for OMNI and ORP: campaign management interfaces, frontend architecture, and engineering tools.',
      ),
      achievements: [
        achievement(
          'campaign-wizard',
          'Отвечал за значительную часть архитектуры и реализации фронтенда мастера каскадных кампаний. На старте мастер поддерживал SMS, MMS и электронную почту.',
          'Owned a substantial part of the frontend architecture and implementation of a cascade campaign wizard, supporting SMS, MMS, and email at launch.',
        ),
        achievement(
          'channel-contract',
          'Выделил общий контракт каналов, изолировав состояние, формы и бизнес-правила каждого канала для расширения мастера.',
          'Established a shared channel contract with isolated per-channel state, forms, and business rules to support extension of the wizard.',
        ),
        achievement(
          'extension-cycle',
          'Подключение нового канала или замена формы обычно занимали 1–2 рабочих дня с учётом исправлений после тестирования.',
          'Adding a new channel or replacing a form typically took 1–2 working days, including post-test fixes.',
        ),
        achievement(
          'template-editors',
          'Перевёл SMS и MMS на новые редакторы шаблонов без существенной переработки архитектуры мастера.',
          'Migrated SMS and MMS to newer template editors without major changes to the wizard architecture.',
        ),
        achievement(
          'validation-feedback',
          'Реализовал ограничения пользовательских сценариев, клиентскую валидацию и преобразование ошибок публичного API в понятные сообщения.',
          'Implemented interaction constraints, client-side validation, and human-readable feedback for public API errors.',
        ),
        achievement(
          'data-tooling',
          'Использовал Node.js и NestJS для подготовки и преобразования данных; работал над инженерными скриптами и переносимостью развёртывания в Linux.',
          'Used Node.js and NestJS for data preparation and transformation, and worked on engineering scripts and Linux deployment portability.',
        ),
      ],
      technologies: [
        'React',
        'TypeScript',
        'MobX',
        'NestJS',
        'Next.js',
        'Jest',
        'Playwright',
        'Webpack',
        'Ant Design',
      ],
      caseStudySlugs: ['campaign-wizard'],
    },
    {
      id: 'yandex',
      employer: localized('Яндекс Маркет', 'Yandex Market'),
      role: localized('Разработчик интерфейсов', 'Interface Developer'),
      start: '2021-03',
      end: '2024-05',
      overview: localized(
        'Продуктовая разработка корзины, оформления заказа и управления адресами, включая эксплуатацию сервисов и развитие фронтенд-архитектуры.',
        'Product development for cart, checkout, and address management, alongside production operations and frontend architecture work.',
      ),
      achievements: [
        achievement(
          'checkout-addresses',
          'Разрабатывал интерфейсы корзины, оформления заказа и панели управления адресами пользователей.',
          'Developed cart and checkout interfaces and user address management panels.',
        ),
        achievement(
          'production-on-call',
          'Во время дежурств отслеживал состояние сервисов в Grafana, расследовал инциденты и аномальный трафик, взаимодействовал с командой безопасности; применял ограничение запросов и масштабирование инстансов, когда это требовалось.',
          'Monitored service health in Grafana during production on-call shifts, investigated incidents and anomalous traffic, and coordinated with security; applied throttling and instance scaling where appropriate.',
        ),
        achievement(
          'microfrontends',
          'Участвовал в становлении и развитии микрофронтенд-архитектуры.',
          'Contributed to the introduction and evolution of microfrontend architecture.',
        ),
        achievement(
          'address-cache',
          'Участвовал в оптимизации кеширования адресных данных в Memcached: нагрузка на адресный сервис снизилась, влияние на метрики рендеринга страниц было положительным, но умеренным.',
          'Contributed to Memcached address-data caching improvements that reduced address service load, with a positive but modest effect on frontend page-render metrics.',
        ),
        achievement(
          'map-preloading',
          'Работал над предварительной загрузкой карты на фронтенде для повышения отзывчивости сценариев работы с адресами.',
          'Worked on frontend map preloading to improve responsiveness in address flows.',
        ),
        achievement(
          'ab-experiments',
          'Участвовал в продуктовых A/B-экспериментах.',
          'Participated in product A/B experiments.',
        ),
        achievement(
          'reviews-mentoring',
          'Регулярно проводил ревью кода, участвовал в релизах, наставничестве и адаптации новых коллег.',
          'Regularly reviewed code and contributed to releases, mentoring, and onboarding.',
        ),
      ],
      technologies: [
        'React',
        'TypeScript',
        'Redux',
        'Redux-Observable',
        'Memcached',
        'Jest',
        'Testament',
        'Webpack',
        'Grafana',
        'Apiary',
      ],
      caseStudySlugs: [],
    },
    {
      id: 'tensor',
      employer: localized('Тензор', 'Tensor'),
      role: localized('Инженер-программист', 'Software Engineer'),
      start: '2017-01',
      end: '2021-03',
      overview: localized(
        'Разработка и сопровождение бизнес-приложений для корпоративных и кадровых процессов.',
        'Development and maintenance of business applications for corporate and HR workflows.',
      ),
      achievements: [
        achievement(
          'business-interfaces',
          'Разрабатывал интерфейсы бизнес-приложений для корпоративных и кадровых процессов.',
          'Developed business application interfaces for corporate and HR workflows.',
        ),
        achievement(
          'maintenance',
          'Сопровождал существующие бизнес-приложения.',
          'Maintained existing business applications.',
        ),
        achievement(
          'tensor-mentoring',
          'Помогал начинающим разработчикам, в том числе в рамках Tensor Hack.',
          'Mentored beginner developers, including through Tensor Hack.',
        ),
      ],
      technologies: ['JavaScript', 'TypeScript', 'WaSaby', 'Less', 'Python', 'PostgreSQL', 'SQL'],
      caseStudySlugs: [],
    },
  ],
  projects: [
    {
      slug: 'pantry',
      title: localized('Pantry', 'Pantry'),
      summary: localized(
        'Разработка публичной версии приложения для рецептов и списка покупок завершена; в планах — развитие проекта в платформу.',
        'The public version is complete; evolving this recipe and grocery-list application into a platform is planned.',
      ),
      stage: 'released',
      tech: ['React', 'TypeScript', 'Vite', 'MobX', 'Ant Design', 'Playwright'],
      githubUrl: 'https://github.com/no0vie/pantry',
      public: true,
    },
    {
      slug: 'magic-ball',
      title: localized('Magic Ball', 'Magic Ball'),
      summary: localized(
        'Основные сценарии реализованы; полная приёмка во всех браузерах ещё не завершена.',
        'The main scenarios are implemented; full cross-browser acceptance is not yet complete.',
      ),
      stage: 'in-progress',
      tech: ['Vue 3', 'JavaScript', 'Vuex', 'Vue Router', 'Vite', 'Playwright'],
      githubUrl: 'https://github.com/no0vie/magic-ball',
      public: true,
    },
    {
      slug: 'riply',
      title: localized('Riply', 'Riply'),
      summary: localized(
        'Концепция будущего Telegram-бота об игре с рыбалкой; разработка ещё не начата.',
        'A concept for a future fishing-game Telegram bot; implementation has not started.',
      ),
      stage: 'concept',
      tech: [],
      public: true,
    },
    {
      slug: 'cave-escaper',
      title: localized('Cave Escaper', 'Cave Escaper'),
      summary: localized(
        'Концепция будущего игрового Telegram-бота о побеге из пещеры; разработка ещё не начата.',
        'A concept for a future Telegram game bot about escaping a cave; implementation has not started.',
      ),
      stage: 'concept',
      tech: [],
      public: true,
    },
  ],
} satisfies Content;
