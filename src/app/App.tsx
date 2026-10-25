import React, { useEffect, useRef, useState } from 'react';
import {
  availability,
  experience,
  highlights,
  profile,
  projects,
  skillGroups,
  type CareerItem,
  type Locale,
} from '../content';
import { cases } from '../content/cases';
import { notePath } from '../content/notes';
import { copy } from './copy';
import { basePath, localePath, pageKind, pdfFileName, pdfPath } from './routes';
import { CopyButton } from './copy-tools';
import { formatAboutForClipboard, formatExperienceForClipboard } from './resume-text';
import { EvolutionPage } from './EvolutionPage';
import { NotesPage } from './NotesPage';
import { InterviewPage, interviewPath } from '../features/interview/InterviewPage';

type Theme = 'system' | 'light' | 'dark';

function BookIcon() {
  return (
    <span className="book-icon" aria-hidden="true">
      ▤
    </span>
  );
}
const themes: Theme[] = ['system', 'light', 'dark'];

function OrbitIcon() {
  return (
    <svg className="orbit-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle className="orbit-core" cx="12" cy="12" r="1.8" />
      <g className="orbit-ring orbit-ring-one">
        <ellipse cx="12" cy="12" rx="9" ry="4.5" />
        <circle cx="20.4" cy="10.4" r="1" />
      </g>
      <g className="orbit-ring orbit-ring-two">
        <ellipse cx="12" cy="12" rx="4.5" ry="9" transform="rotate(38 12 12)" />
        <circle cx="7.2" cy="5.6" r="0.85" />
      </g>
    </svg>
  );
}

function ProfilePortrait({
  locale,
  onTripleActivate,
}: {
  locale: Locale;
  onTripleActivate: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const activationCount = useRef(0);
  const resetTimer = useRef<number | undefined>(undefined);
  const longPressTimer = useRef<number | undefined>(undefined);
  const ignoreNextClick = useRef(false);
  const alt = locale === 'ru' ? 'Портрет Евгения Новикова' : 'Portrait of Eugene Novikov';
  const copyModeHint =
    locale === 'ru'
      ? 'Трижды нажмите, удерживайте на сенсорном экране или нажмите Shift+Enter для режима копирования'
      : 'Activate three times, touch and hold, or press Shift+Enter for copy mode';

  useEffect(
    () => () => {
      if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current);
      if (longPressTimer.current !== undefined) window.clearTimeout(longPressTimer.current);
    },
    [],
  );

  function activate() {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false;
      return;
    }
    activationCount.current += 1;
    if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current);
    if (activationCount.current === 3) {
      activationCount.current = 0;
      resetTimer.current = undefined;
      onTripleActivate();
      return;
    }
    resetTimer.current = window.setTimeout(() => {
      activationCount.current = 0;
      resetTimer.current = undefined;
    }, 1_500);
  }

  function clearLongPress() {
    if (longPressTimer.current !== undefined) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = undefined;
  }

  return (
    <button
      type="button"
      className="profile-portrait"
      aria-label={alt}
      title={copyModeHint}
      onClick={activate}
      onKeyDown={(event) => {
        if (event.shiftKey && event.key === 'Enter') {
          event.preventDefault();
          onTripleActivate();
        }
      }}
      onPointerDown={(event) => {
        if (event.pointerType === 'mouse') return;
        clearLongPress();
        longPressTimer.current = window.setTimeout(() => {
          ignoreNextClick.current = true;
          longPressTimer.current = undefined;
          onTripleActivate();
        }, 700);
      }}
      onPointerUp={clearLongPress}
      onPointerCancel={clearLongPress}
      onPointerLeave={clearLongPress}
    >
      {failed ? (
        <span className="profile-initials" role="img" aria-label={alt}>
          {locale === 'ru' ? 'ЕН' : 'EN'}
        </span>
      ) : (
        <img
          src={basePath('profile.jpg')}
          width="640"
          height="640"
          alt={alt}
          onError={() => setFailed(true)}
        />
      )}
    </button>
  );
}

function ContactIcon({ service }: { service: 'email' | 'telegram' | 'whatsapp' | 'github' }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      {service === 'email' ? (
        <path d="M3.5 6.5h17v11h-17zM4 7l8 6 8-6" />
      ) : service === 'telegram' ? (
        <path d="M3 11.5 21 4l-3.5 16-6-5-3 3 .5-4 8-7-10 6z" />
      ) : service === 'whatsapp' ? (
        <path d="M12 3a8.5 8.5 0 0 0-7.3 12.9L4 21l5-1.4A8.5 8.5 0 1 0 12 3zm-3 5.5c.5 3 2.5 5 5.5 6l1.5-1 2 1.5c-.5 2-2 2.5-3.5 2-4-1-6.5-3.5-7.5-7.5-.5-1.5 0-3 2-3.5l1.5 2z" />
      ) : (
        <path d="M12 3a9 9 0 0 0-3 17.5v-2c-2 .4-2.5-.8-2.5-.8-.3-.9-.8-1.1-.8-1.1-.7-.5 0-.5 0-.5.8 0 1.2.8 1.2.8.7 1.2 1.8.9 2.2.7.1-.5.3-.9.5-1.1-1.7-.2-3.5-.9-3.5-4a3.2 3.2 0 0 1 .8-2.2c-.1-.2-.4-1 .1-2.2 0 0 .7-.2 2.3.8a8 8 0 0 1 4.2 0c1.6-1 2.3-.8 2.3-.8.5 1.2.2 2 .1 2.2.6.6.8 1.4.8 2.2 0 3.1-1.8 3.8-3.5 4 .3.2.5.7.5 1.4v2.6A9 9 0 0 0 12 3z" />
      )}
    </svg>
  );
}

function ContactLinks({ locale }: { locale: Locale }) {
  const links = [
    { label: 'Gmail', href: `mailto:${profile.contacts.emails[0]}`, icon: 'email' },
    {
      label: locale === 'ru' ? 'Яндекс Почта' : 'Yandex Mail',
      href: `mailto:${profile.contacts.emails[1]}`,
      icon: 'email',
    },
    { label: 'Telegram', href: profile.contacts.telegram, icon: 'telegram' },
    { label: 'WhatsApp', href: profile.contacts.whatsapp, icon: 'whatsapp' },
    { label: 'GitHub', href: profile.github, icon: 'github' },
  ] as const;

  return (
    <div className="profile-contacts" id="contacts" aria-labelledby="contacts-title">
      <h3 id="contacts-title" className="visually-hidden">
        {copy[locale].contact}
      </h3>
      <ul className="contact-chips">
        {links.map((link) => (
          <li key={link.label}>
            <a
              className="contact-chip"
              href={link.href}
              rel={link.href.startsWith('https://') ? 'noopener noreferrer' : undefined}
            >
              <ContactIcon service={link.icon} />
              <span>{link.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCards({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const stageLabel = {
    released: t.released,
    'in-progress': t.inProgress,
    concept: t.concept,
  } as const;
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <article className="project-card" key={project.slug}>
          <div className="project-heading">
            <h3>{project.title[locale]}</h3>
            <span className={`stage stage-${project.stage}`}>{stageLabel[project.stage]}</span>
          </div>
          <p>{project.summary[locale]}</p>
          {project.tech.length > 0 && (
            <ul className="tags" aria-label={t.skills}>
              {project.tech.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          )}
          {project.githubUrl && (
            <a className="text-link" href={project.githubUrl} rel="noopener noreferrer">
              {t.github} <span aria-hidden="true">↗</span>
            </a>
          )}
        </article>
      ))}
    </div>
  );
}

function ThemeButton({ locale }: { locale: Locale }) {
  const [theme, setTheme] = useState<Theme>('system');
  const t = copy[locale];
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      // Hydration must initially match SSR; synchronize the persisted external value afterward.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === 'light' || saved === 'dark') setTheme(saved);
    } catch {
      /* Theme selection still works when storage is unavailable. */
    }
    const frame = window.requestAnimationFrame(() =>
      document.documentElement.classList.add('theme-transitions-ready'),
    );
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function cycleTheme() {
    const next = themes[(themes.indexOf(theme) + 1) % themes.length] ?? 'system';
    setTheme(next);
    if (next === 'system') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* Keep the in-memory choice in privacy-restricted browsers. */
    }
  }

  return (
    <button
      type="button"
      className="theme-button"
      onClick={cycleTheme}
      aria-label={`${t.theme}: ${t[theme]}`}
    >
      <span aria-hidden="true">◐</span> {t.theme}: {t[theme]}
    </button>
  );
}

function month(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}-01T00:00:00Z`));
}

function ExperiencePeriod({ item, locale }: { item: CareerItem; locale: Locale }) {
  if (item.datePrecision === 'approximate' && item.end) {
    return (
      <>
        <time dateTime={item.start}>{item.start.slice(0, 4)}</time>–
        <time dateTime={item.end}>{item.end.slice(0, 4)}</time>
      </>
    );
  }
  return (
    <>
      <time dateTime={item.start}>{month(item.start, locale)}</time>
      <span aria-hidden="true"> — </span>
      {item.end ? <time dateTime={item.end}>{month(item.end, locale)}</time> : copy[locale].present}
    </>
  );
}

export function App({
  locale: initialLocale,
  page,
  enableEvolution = false,
}: {
  locale: Locale;
  page: string;
  enableEvolution?: boolean;
}) {
  const kind = pageKind(page, enableEvolution);
  const [locale, setLocale] = useState(initialLocale);
  const t = copy[locale];
  const otherLocale = locale === 'ru' ? 'en' : 'ru';
  const [menuOpen, setMenuOpen] = useState(false);
  const [copyMode, setCopyMode] = useState(false);
  useEffect(() => {
    if (kind === 'evolution')
      void import('./evolution').then(({ enhanceEvolution }) => enhanceEvolution());
    if (kind === 'notes' || kind === 'note') {
      const requestedLocale = new URLSearchParams(window.location.search).get('lang');
      if (requestedLocale === 'ru' || requestedLocale === 'en') {
        const timer = window.setTimeout(() => setLocale(requestedLocale), 0);
        return () => window.clearTimeout(timer);
      }
    }
    return undefined;
  }, [kind]);

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href={localePath(locale)}>
            <span className="monogram" aria-hidden="true">
              en.
            </span>
            <span>
              {profile.name[locale]}
              <small>{profile.role[locale]}</small>
            </span>
          </a>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {t.menu} <span aria-hidden="true">{menuOpen ? '−' : '+'}</span>
          </button>
          <nav
            id="site-navigation"
            className={`site-navigation${menuOpen ? ' is-open' : ''}`}
            aria-label={t.navigation}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setMenuOpen(false);
                event.currentTarget.parentElement
                  ?.querySelector<HTMLButtonElement>('.menu-button')
                  ?.focus();
              }
            }}
          >
            <a href={localePath(locale)} aria-current={kind === 'resume' ? 'page' : undefined}>
              {t.resume}
            </a>
            <a
              href={localePath(locale, 'projects')}
              aria-current={kind === 'projects' ? 'page' : undefined}
            >
              {t.projects}
            </a>
            <a
              href={interviewPath(locale)}
              aria-current={
                kind === 'interview' || kind === 'interview-exercise' ? 'page' : undefined
              }
            >
              {locale === 'ru' ? 'Интервью' : 'Interview Lab'}
            </a>
            <a
              className="notes-link"
              href={notePath(locale)}
              aria-current={kind === 'notes' || kind === 'note' ? 'page' : undefined}
            >
              <BookIcon />
              <span>{locale === 'ru' ? 'Заметки' : 'Notes'}</span>
            </a>
            {enableEvolution && (
              <a
                className="evolution-link"
                href={localePath(locale, 'evolution')}
                aria-label={`Evolution — ${t.openEvolution}`}
                title={t.openEvolution}
                aria-current={kind === 'evolution' ? 'page' : undefined}
              >
                <OrbitIcon />
                <span>Evolution</span>
              </a>
            )}
            <a
              href={
                kind === 'notes' || kind === 'note'
                  ? notePath(
                      otherLocale,
                      kind === 'note' ? page.replace(/^notes\//, '') : undefined,
                    )
                  : kind === 'interview' || kind === 'interview-exercise'
                    ? interviewPath(
                        otherLocale,
                        kind === 'interview-exercise'
                          ? page.replace(/^interview\//, '')
                          : undefined,
                      )
                    : localePath(otherLocale, kind === 'not-found' ? '' : page)
              }
              hrefLang={otherLocale}
              lang={otherLocale}
              aria-label={
                otherLocale === 'en' ? 'EN — Switch to English' : 'RU — Переключить на русский'
              }
            >
              {otherLocale === 'en' ? 'EN' : 'RU'}
            </a>
            <ThemeButton locale={locale} />
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="main-content">
        {kind === 'resume' ? (
          <>
            <section className="hero" aria-labelledby="resume-title">
              <p className="eyebrow">{profile.role[locale]}</p>
              <div className="hero-title-row">
                <h1 id="resume-title">
                  {profile.name[locale]}
                  <span className="accent" aria-hidden="true">
                    .
                  </span>
                </h1>
                <p
                  className="availability-status"
                  data-animated={availability.status === 'available' ? 'true' : undefined}
                >
                  <span className="availability-dot" aria-hidden="true">
                    ●
                  </span>
                  <span className="availability-label">{availability.label[locale]}</span>
                </p>
              </div>
              <div className="hero-bottom">
                <div>
                  <p className="hero-context">React / TypeScript / Frontend</p>
                </div>
                <a className="button primary" href={pdfPath(locale)} download={pdfFileName(locale)}>
                  {t.download}
                  <span aria-hidden="true"> ↓</span>
                </a>
              </div>
            </section>
            <nav className="section-navigation" aria-label={t.resume}>
              {(['about', 'experience', 'cases', 'projects', 'skills', 'education'] as const).map(
                (section) => (
                  <a key={section} href={`#${section}`}>
                    {t[section]}
                  </a>
                ),
              )}
            </nav>
            <section className="profile-section" id="about" aria-labelledby="about-title">
              <ProfilePortrait
                locale={locale}
                onTripleActivate={() => setCopyMode((active) => !active)}
              />
              <div className="profile-content">
                <h2 id="about-title">{t.about}</h2>
                <div className="copyable-section copyable-block">
                  <p className="lead">{profile.about[locale]}</p>
                  {copyMode && (
                    <CopyButton
                      locale={locale}
                      text={formatAboutForClipboard(profile, locale)}
                      targetLabel={t.copyAbout}
                    />
                  )}
                </div>
                <ContactLinks locale={locale} />
              </div>
            </section>
            <section className="highlights-section" aria-labelledby="highlights-title">
              <h2 id="highlights-title">{t.highlights}</h2>
              <ol className="highlights">
                {highlights.map((item, index) => (
                  <li key={item.id}>
                    <span className="highlight-number" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <div>
                      <h3>{item.heading[locale]}</h3>
                      <p>{item.text[locale]}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
            <section className="resume-section" id="experience" aria-labelledby="experience-title">
              <h2 id="experience-title">{t.experience}</h2>
              <div className="experience-list">
                {experience.map((item) => (
                  <article
                    className="experience-card"
                    id={`experience-${item.id}`}
                    key={item.id}
                    aria-labelledby={`${item.id}-title`}
                  >
                    {copyMode && (
                      <CopyButton
                        locale={locale}
                        text={formatExperienceForClipboard(item, locale)}
                        targetLabel={t.copyExperience}
                      />
                    )}
                    <div className="experience-heading">
                      <div>
                        <p className="employer">{item.employer[locale]}</p>
                        <h3 id={`${item.id}-title`}>{item.role[locale]}</h3>
                      </div>
                      <p className="dates">
                        <ExperiencePeriod item={item} locale={locale} />
                      </p>
                    </div>
                    <p className="overview">{item.overview[locale]}</p>
                    <ul className="achievements">
                      {item.achievements.map((achievement) => (
                        <li key={achievement.id}>{achievement.text[locale]}</li>
                      ))}
                    </ul>
                    {item.outcome && <p className="overview">{item.outcome[locale]}</p>}
                    {item.links.length > 0 && (
                      <p
                        aria-label={
                          locale === 'ru'
                            ? `Ссылки на продукты и работы: ${item.employer[locale]}`
                            : `Product and related work links: ${item.employer[locale]}`
                        }
                      >
                        {item.links.map((link, index) => (
                          <React.Fragment key={link.url}>
                            {index > 0 && <span aria-hidden="true"> · </span>}
                            <a className="text-link" href={link.url} rel="noopener noreferrer">
                              {link.label} <span aria-hidden="true">↗</span>
                            </a>
                          </React.Fragment>
                        ))}
                      </p>
                    )}
                    <ul className="tags" aria-label={t.skills}>
                      {item.technologies.map((technology) => (
                        <li key={technology}>{technology}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
            <section className="resume-section" id="cases" aria-labelledby="cases-title">
              <h2 id="cases-title">{t.cases}</h2>
              <div>
                {cases.map((item) => (
                  <article key={item.slug}>
                    <h3>
                      <a className="text-link" href={localePath(locale, `cases/${item.slug}`)}>
                        {item.title[locale]}
                      </a>
                    </h3>
                    <p>{item.summary[locale]}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="resume-section" id="projects" aria-labelledby="projects-title">
              <h2 id="projects-title">{t.projects}</h2>
              <div>
                <ProjectCards locale={locale} />
                <a className="text-link all-projects-link" href={localePath(locale, 'projects')}>
                  {t.projectsDetail}
                </a>
              </div>
            </section>
            <section className="resume-section" id="skills" aria-labelledby="skills-title">
              <h2 id="skills-title">{t.skills}</h2>
              <div className="skill-groups">
                {skillGroups.map((group) => (
                  <section key={group.id}>
                    <h3>{group.label[locale]}</h3>
                    <ul className="tags skills-list">
                      {group.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </section>
            <section className="resume-section" id="education" aria-labelledby="education-title">
              <h2 id="education-title">{t.education}</h2>
              <p className="education-copy">{profile.education[locale]}</p>
            </section>
          </>
        ) : kind === 'case' ? (
          <article className="standalone-page">
            {cases
              .filter((item) => page === `cases/${item.slug}`)
              .map((item) => (
                <React.Fragment key={item.slug}>
                  <p className="eyebrow">{t.cases}</p>
                  <h1>{item.title[locale]}</h1>
                  <p className="overview">{item.summary[locale]}</p>
                  {Object.entries(item.sections).map(([id, text]) => (
                    <section
                      className="resume-section"
                      id={id}
                      key={id}
                      aria-labelledby={`${id}-title`}
                    >
                      <h2 id={`${id}-title`}>{t[id as keyof typeof item.sections]}</h2>
                      <p>{text[locale]}</p>
                    </section>
                  ))}
                </React.Fragment>
              ))}
            <a className="text-link" href={localePath(locale)}>
              {t.back}
            </a>
          </article>
        ) : kind === 'evolution' ? (
          <EvolutionPage locale={locale} />
        ) : kind === 'notes' || kind === 'note' ? (
          <NotesPage
            locale={locale}
            slug={kind === 'note' ? page.replace(/^notes\//, '') : undefined}
          />
        ) : kind === 'interview' || kind === 'interview-exercise' ? (
          <InterviewPage
            locale={locale}
            slug={kind === 'interview-exercise' ? page.replace(/^interview\//, '') : undefined}
          />
        ) : (
          <section
            className={`standalone-page${kind === 'projects' ? ' projects-page' : ''}`}
            aria-labelledby="page-title"
          >
            <p className="eyebrow">{kind === 'projects' ? t.projectsDetail : '404'}</p>
            <h1 id="page-title">{kind === 'projects' ? t.projects : t.notFound}</h1>
            {kind === 'projects' ? (
              <>
                <p className="projects-intro">{t.emptyDetail}</p>
                <ProjectCards locale={locale} />
              </>
            ) : (
              <div className="empty-state">
                <p>{t.notFoundDetail}</p>
              </div>
            )}
            <a className="button" href={localePath(locale)}>
              {t.back} <span aria-hidden="true">→</span>
            </a>
          </section>
        )}
      </main>
      <footer className="site-footer">
        <div>
          <span>{profile.name[locale]} · </span>
          <a
            className="footer-contact-link"
            href={kind === 'resume' ? '#contacts' : `${localePath(locale)}#contacts`}
          >
            {t.contact}
          </a>
          <p>{t.footer}</p>
          <p className="footer-attribution">{t.attribution}</p>
        </div>
        <p>
          {t.updated}: <time dateTime={profile.updated}>{profile.updated}</time>
        </p>
      </footer>
    </>
  );
}
