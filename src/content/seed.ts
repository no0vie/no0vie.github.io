import type { Achievement, Content, Localized } from './schema';

const localized = (ru: string, en: string): Localized => ({ ru, en });
const achievement = (id: string, ru: string, en: string): Achievement => ({
  id,
  text: localized(ru, en),
  evidence: 'confirmed',
  publishable: true,
});

export const mtsArchitectureAchievement = localized(
  'Спроектировал расширяемую архитектуру мастера каскадных кампаний с единым контрактом каналов и изоляцией их форм и бизнес-логики. Добавление нового канала или замена редактора стали занимать 1–2 рабочих дня, включая исправления после тестирования, вместо примерно двухнедельного спринта в прежнем механизме сопоставимой функциональности.',
  'Designed an extensible cascade campaign wizard with a shared channel contract and isolated channel-specific forms and business logic. Adding a channel or replacing an editor took 1–2 working days, including fixes after testing, versus approximately a two-week sprint in the previous implementation of comparable functionality.',
);

export const mtsOutcome = localized(
  'Мастер каскадных кампаний был реализован в согласованные сроки, оправдал ожидания заказчика и показал положительный коммерческий результат.',
  "The cascade campaign wizard was delivered on schedule, met the customer's expectations, and achieved a positive commercial outcome.",
);

export const mtsExtensibilityHighlight = {
  id: 'extensible-architecture',
  heading: localized(
    'Архитектура, рассчитанная на развитие',
    'Architecture designed for extensibility',
  ),
  text: localized(
    'Спроектировал расширяемую архитектуру мастера каскадных кампаний, сократив добавление новых каналов и замену редакторов с примерно двух недель до 1–2 рабочих дней.',
    'Designed an extensible cascade campaign wizard architecture, reducing the effort to add new channels or replace editors from roughly two weeks to 1–2 working days.',
  ),
} as const;

// Source: SPEC.md §7–8 and the repository's pre-existing public index.html.
// Remaining editorial TODOs (not public claims): address experiment outcome and
// AI-assisted testing status. Contacts, English self-assessment and project statuses are owner-approved.
export const seedContent = {
  profile: {
    name: localized('Евгений Новиков', 'Eugene Novikov'),
    role: localized(
      'Старший разработчик ПО (фокус на фронтенде)',
      'Senior Software Engineer (Frontend-focused)',
    ),
    about: localized(
      'Разрабатываю программные продукты с 2015 года — от ПО для информационных табло до крупных веб-платформ. Проектирую расширяемую архитектуру фронтенда, улучшаю продуктовые сценарии и участвую в обеспечении надёжности production-систем. Провожу код-ревью и помогаю коллегам развиваться.',
      'I have been building software since 2015, from digital signage applications to large-scale web platforms. I design extensible frontend architectures, improve product workflows, and help keep production systems reliable. I review code and mentor fellow engineers.',
    ),
    education: localized(
      'Ярославский государственный университет им. П. Г. Демидова. Бакалавр по направлению «Прикладная математика и информатика», 2018. Английский — B1 (самооценка): читаю техническую документацию и уверенно общаюсь по рабочим вопросам.',
      'P. G. Demidov Yaroslavl State University. Bachelor’s degree in Applied Mathematics and Informatics, 2018. English — B1 (self-assessed): I read technical documentation and communicate comfortably on work topics.',
    ),
    github: 'https://github.com/no0vie',
    contacts: {
      emails: ['eugene.malin765@gmail.com', 'evgeniys-nov@yandex.ru'],
      telegram: 'https://t.me/no_0vie',
      whatsapp: 'https://wa.me/qr/XFZZQSNXJCSBL1',
    },
    updated: '2026-10-22',
  },
  availability: {
    status: 'available',
    label: localized('Рассматриваю предложения', 'Open to opportunities'),
    updatedAt: '2026-10-22',
    source: 'manual',
  },
  careerMilestones: [
    {
      id: 'tensor-scholarship',
      afterExperienceId: 'fruct',
      beforeExperienceId: 'tensor',
      title: localized('Переход в Тензор', 'Transition to Tensor'),
      text: localized(
        'В Тензор попал через студенческую стипендиальную программу. К заключительному техническому собеседованию подготовил собственный проект «Крестики-нолики» — один из ранних проектов, сохранившихся на GitHub.',
        'Joined Tensor through its student scholarship programme. Built a Tic-Tac-Toe project for the final technical interview; the early project is still available on GitHub.',
      ),
      githubUrl: 'https://github.com/no0vie/tic-tac-toe',
    },
  ],
  highlights: [
    mtsExtensibilityHighlight,
    {
      id: 'address-cache',
      heading: localized('Снижение нагрузки на адресный сервис', 'Reduced address-service load'),
      text: localized(
        'Участвовал в оптимизации кеширования адресных данных в Memcached, снизившей нагрузку на адресный сервис.',
        'Contributed to Memcached address-data caching improvements that reduced load on the address service.',
      ),
    },
    {
      id: 'production-mentoring',
      heading: localized('Продукт и эксплуатация', 'Product and operations'),
      text: localized(
        'Совмещал продуктовую разработку с дежурствами в продакшене, расследованием инцидентов и наставничеством.',
        'Combined product development with production on-call work, incident investigation, and mentoring.',
      ),
    },
  ],
  experience: [
    {
      id: 'mts',
      employer: localized('МТС Веб Сервисы', 'MTS Web Services'),
      role: localized('Старший разработчик ПО', 'Senior Software Developer'),
      start: '2024-05',
      datePrecision: 'exact',
      overview: localized(
        'Разработка продуктов OMNI и ORP: интерфейсы управления коммуникациями и кампаниями, архитектура фронтенда и инженерные инструменты.',
        'Developing OMNI and ORP: campaign and communications management interfaces, frontend architecture, and engineering tools.',
      ),
      outcome: mtsOutcome,
      links: [
        { label: 'OMNI', url: 'https://omnichannel.mts.ru/' },
        { label: 'ORP', url: 'https://orp.mts.ru/' },
        { label: 'CRM Trends', url: 'https://omnichannel.mts.ru/crmtrends' },
      ],
      achievements: [
        achievement(
          'campaign-wizard',
          mtsArchitectureAchievement.ru,
          mtsArchitectureAchievement.en,
        ),
        achievement(
          'template-editors',
          'Перевёл SMS и MMS на новые редакторы шаблонов без существенной переработки общего сценария мастера.',
          "Migrated SMS and MMS to new template editors without major changes to the wizard's shared workflow.",
        ),
        achievement(
          'validation-feedback',
          'Реализовал ограничения пользовательских сценариев, клиентскую валидацию и преобразование ошибок публичного API в понятные сообщения.',
          'Implemented user-flow constraints, client-side validation, and clear messages for public API errors.',
        ),
        achievement(
          'data-tooling',
          'Использовал Node.js и NestJS для подготовки и преобразования данных; работал над инженерными скриптами и переносимостью развёртывания в Linux.',
          'Used Node.js and NestJS for data preparation and transformation; worked on engineering scripts and Linux deployment portability.',
        ),
        achievement(
          'crm-trends-landing',
          'С использованием ИИ-инструментов разработал лендинг для отраслевого мероприятия за один вечер.',
          'Built a landing page for an industry event in one evening using AI-assisted development tools.',
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
      datePrecision: 'exact',
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
      links: [],
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
      datePrecision: 'exact',
      overview: localized(
        'Разработка и сопровождение корпоративных веб-приложений для автоматизации бизнес- и кадровых процессов.',
        'Developed and maintained enterprise web applications supporting business and HR processes.',
      ),
      achievements: [
        achievement(
          'business-interfaces',
          'Разрабатывал и развивал интерфейсы корпоративных бизнес-приложений на JavaScript/TypeScript и WaSaby.',
          'Built and evolved enterprise application interfaces with JavaScript/TypeScript and WaSaby.',
        ),
        achievement(
          'sql-optimization',
          'Оптимизировал SQL-запросы к PostgreSQL: перерабатывал сложные запросы и подзапросы, создавал индекс для повышения производительности.',
          'Optimized PostgreSQL queries by rewriting complex SQL queries and subqueries and adding an index to improve performance.',
        ),
        achievement(
          'maintenance',
          'Сопровождал существующие приложения, исправлял ошибки и развивал функциональность.',
          'Maintained existing applications, fixed bugs, and delivered new functionality.',
        ),
        achievement(
          'tensor-mentoring',
          'Был одним из кураторов Tensor Hack: помогал начинающим разработчикам с техническими решениями и реализацией проектов.',
          'Served as one of the mentors at Tensor Hack, helping junior developers with technical decisions and project implementation.',
        ),
      ],
      links: [],
      technologies: ['JavaScript', 'TypeScript', 'WaSaby', 'Less', 'Python', 'PostgreSQL', 'SQL'],
      caseStudySlugs: [],
    },
    {
      id: 'fruct',
      employer: localized(
        'Лаборатория FRUCT, Ярославский государственный университет им. П. Г. Демидова',
        'FRUCT Laboratory, P. G. Demidov Yaroslavl State University',
      ),
      role: localized(
        'Разработчик ПО (внештатная почасовая работа)',
        'Software Developer (part-time, hourly paid contractor)',
      ),
      start: '2015-07',
      end: '2016-12',
      datePrecision: 'approximate',
      overview: localized(
        'Разработка систем управления светодиодными информационными табло и несложных веб-интерфейсов для их настройки.',
        'Developed LED information-display control systems and simple web interfaces for configuring them.',
      ),
      achievements: [
        achievement(
          'glass-factory-display',
          'Самостоятельно разработал программное обеспечение для управления информационными табло стекольного завода в Гусь-Хрустальном.',
          'Independently developed software to control information displays for a glass factory in Gus-Khrustalny.',
        ),
        achievement(
          'fuel-sports-displays',
          'Участвовал в разработке решений для информационных табло АЗС и спортивных объектов.',
          'Contributed to information-display solutions for fuel stations and sports venues.',
        ),
        achievement(
          'display-web-interface',
          'Разрабатывал серверную часть на Java и Spring Boot и адаптивные веб-интерфейсы с использованием Foundation.',
          'Developed Java/Spring Boot backend functionality and responsive web interfaces using Foundation.',
        ),
        achievement(
          'aurora-hackathon',
          'Участвовал в хакатоне по созданию приложения для мобильной ОС «Аврора» на C++ и QML.',
          'Participated in a hackathon developing an application for the Aurora mobile operating system using C++ and QML.',
        ),
      ],
      links: [],
      technologies: ['Java', 'Kotlin', 'Spring Boot', 'Foundation'],
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
