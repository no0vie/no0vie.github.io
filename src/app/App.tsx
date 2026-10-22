import React, { useEffect, useState } from 'react';
import {
  availability,
  careerMilestones,
  experience,
  highlights,
  profile,
  projects,
  skillGroups,
  type CareerItem,
  type Locale,
} from '../content';
import { cases } from '../content/cases';
import { copy } from './copy';
import { localePath, pageKind, pdfPath } from './routes';
import { formatAboutForClipboard, formatExperienceForClipboard } from './resume-text';

type Theme = 'system' | 'light' | 'dark';
const themes: Theme[] = ['system', 'light', 'dark'];

function CopyButton({ locale, text }: { locale: Locale; text: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const t = copy[locale];

  async function copyBlock() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
      window.setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('failed');
    }
  }

  const label = status === 'copied' ? t.copied : status === 'failed' ? t.copyFailed : t.copy;
  return (
    <button type="button" className="copy-button" onClick={() => void copyBlock()}>
      {label}
      <span aria-hidden="true"> ⧉</span>
    </button>
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
  locale,
  page,
  enableEvolution = false,
}: {
  locale: Locale;
  page: string;
  enableEvolution?: boolean;
}) {
  const t = copy[locale];
  const kind = pageKind(page, enableEvolution);
  const otherLocale = locale === 'ru' ? 'en' : 'ru';
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (kind === 'evolution')
      void import('./evolution').then(({ enhanceEvolution }) => enhanceEvolution());
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
              href={localePath(otherLocale, kind === 'not-found' ? '' : page)}
              hrefLang={otherLocale}
              lang={otherLocale}
              aria-label={
                otherLocale === 'en' ? 'EN — Switch to English' : 'RU — Переключить на русский'
              }
            >
              {otherLocale === 'en' ? 'EN' : 'RU'}
            </a>
            {enableEvolution && (
              <a
                href={localePath(locale, 'evolution')}
                aria-current={kind === 'evolution' ? 'page' : undefined}
              >
                {t.evolution}
              </a>
            )}
            <ThemeButton locale={locale} />
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="main-content">
        {kind === 'resume' ? (
          <>
            <section className="hero" aria-labelledby="resume-title">
              <p className="eyebrow">{profile.role[locale]}</p>
              <h1 id="resume-title">
                {profile.name[locale]}
                <span className="accent" aria-hidden="true">
                  .
                </span>
              </h1>
              <div className="hero-bottom">
                <div>
                  <p className="hero-context">React / TypeScript / Frontend</p>
                  <p className="availability-status">
                    <span aria-hidden="true">●</span> {availability.label[locale]}
                  </p>
                </div>
                <a className="button primary" href={pdfPath(locale)} download>
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
            <section
              className="resume-section about-section"
              id="about"
              aria-labelledby="about-title"
            >
              <h2 id="about-title">{t.about}</h2>
              <div className="copyable-block">
                <p className="lead">{profile.about[locale]}</p>
                <CopyButton locale={locale} text={formatAboutForClipboard(profile, locale)} />
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
                    key={item.id}
                    aria-labelledby={`${item.id}-title`}
                  >
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
                      {item.achievements.map((item) => (
                        <li key={item.id}>{item.text[locale]}</li>
                      ))}
                    </ul>
                    <ul className="tags" aria-label={t.skills}>
                      {item.technologies.map((technology) => (
                        <li key={technology}>{technology}</li>
                      ))}
                    </ul>
                    <CopyButton locale={locale} text={formatExperienceForClipboard(item, locale)} />
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
            <section className="resume-section" aria-labelledby="contact-title">
              <h2 id="contact-title">{t.contact}</h2>
              <ul className="contact-list">
                {profile.contacts.emails.map((email) => (
                  <li key={email}>
                    <a className="text-link" href={`mailto:${email}`}>
                      {email}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    className="text-link"
                    href={profile.contacts.telegram}
                    rel="noopener noreferrer"
                  >
                    Telegram · @no_0vie <span aria-hidden="true">↗</span>
                  </a>
                </li>
                <li>
                  <a
                    className="text-link"
                    href={profile.contacts.whatsapp}
                    rel="noopener noreferrer"
                  >
                    {t.whatsapp} <span aria-hidden="true">↗</span>
                  </a>
                </li>

                <li>
                  <a className="text-link" href={profile.github} rel="noopener noreferrer">
                    GitHub · no0vie <span aria-hidden="true">↗</span>
                  </a>
                </li>
              </ul>
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
          <section className="standalone-page" aria-labelledby="evolution-title">
            <h1 id="evolution-title">{t.evolution}</h1>
            <div data-evolution-controls hidden role="group" aria-label={t.focusStep}>
              {[...experience].reverse().map((item) => (
                <button key={item.id} type="button" aria-controls={`step-${item.id}`}>
                  {item.employer[locale]}
                </button>
              ))}
            </div>
            <ol className="evolution-timeline">
              {[...experience].reverse().map((item) => {
                const milestone = careerMilestones.find(
                  ({ afterExperienceId }) => afterExperienceId === item.id,
                );
                return (
                  <React.Fragment key={item.id}>
                    <li className="evolution-step" id={`step-${item.id}`} tabIndex={-1}>
                      <h2>{item.employer[locale]}</h2>
                      <p>{item.role[locale]}</p>
                      <p className="dates">
                        <ExperiencePeriod item={item} locale={locale} />
                      </p>
                      <p>{item.overview[locale]}</p>
                      <ul>
                        {item.achievements.map((achievement) => (
                          <li key={achievement.id}>{achievement.text[locale]}</li>
                        ))}
                      </ul>
                    </li>
                    {milestone && (
                      <li className="career-milestone">
                        <h2>{milestone.title[locale]}</h2>
                        <p>{milestone.text[locale]}</p>
                        {milestone.githubUrl && (
                          <a
                            className="text-link"
                            href={milestone.githubUrl}
                            rel="noopener noreferrer"
                          >
                            GitHub · Tic-Tac-Toe <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </li>
                    )}
                  </React.Fragment>
                );
              })}
            </ol>
            <a className="text-link" href={localePath(locale)}>
              {t.back}
            </a>
          </section>
        ) : (
          <section className="standalone-page" aria-labelledby="page-title">
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
          <a href={`mailto:${profile.contacts.emails[0]}`}>{profile.contacts.emails[0]}</a>
          <span> · </span>
          <a href={profile.contacts.telegram} rel="noopener noreferrer">
            Telegram
          </a>
          <span> · </span>
          <a href={profile.contacts.whatsapp} rel="noopener noreferrer">
            {t.whatsapp}
          </a>

          <span> · </span>
          <a href={profile.github} rel="noopener noreferrer">
            GitHub
          </a>
          <p>{t.footer}</p>
        </div>
        <p>
          {t.updated}: <time dateTime={profile.updated}>{profile.updated}</time>
        </p>
      </footer>
    </>
  );
}
