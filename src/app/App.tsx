import React, { useEffect, useRef, useState } from 'react';
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
import { basePath, localePath, pageKind, pdfFileName, pdfPath } from './routes';
import { CopyableSection } from './copy-tools';
import {
  formatAboutForClipboard,
  formatAchievementForClipboard,
  formatCaseSectionForClipboard,
  formatCaseSummaryForClipboard,
  formatExperienceForClipboard,
  formatExperienceSummaryForClipboard,
  formatHighlightForClipboard,
  formatProjectForClipboard,
} from './resume-text';

type Theme = 'system' | 'light' | 'dark';
const themes: Theme[] = ['system', 'light', 'dark'];

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
  const alt = locale === 'ru' ? 'Портрет Евгения Новикова' : 'Portrait of Eugene Novikov';

  useEffect(
    () => () => {
      if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  function activate() {
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

  return (
    <button type="button" className="profile-portrait" aria-label={alt} onClick={activate}>
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

function ProjectCards({ locale, editMode }: { locale: Locale; editMode: boolean }) {
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
          <CopyableSection
            editMode={editMode}
            locale={locale}
            text={formatProjectForClipboard(project, locale)}
            targetLabel={`${t.copyProject}: ${project.title[locale]}`}
          >
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
          </CopyableSection>
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
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setEditMode(new URLSearchParams(window.location.search).get('edit') === '1');
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
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
              <ProfilePortrait locale={locale} onTripleActivate={() => setEditMode(true)} />
              <div className="profile-content">
                <h2 id="about-title">{t.about}</h2>
                <CopyableSection
                  className="copyable-block"
                  editMode={editMode}
                  locale={locale}
                  text={formatAboutForClipboard(profile, locale)}
                  targetLabel={t.copyAbout}
                >
                  <p className="lead">{profile.about[locale]}</p>
                </CopyableSection>
                <ContactLinks locale={locale} />
              </div>
            </section>
            <section className="highlights-section" aria-labelledby="highlights-title">
              <h2 id="highlights-title">{t.highlights}</h2>
              <ol className="highlights">
                {highlights.map((item, index) => (
                  <li key={item.id}>
                    <CopyableSection
                      editMode={editMode}
                      locale={locale}
                      text={formatHighlightForClipboard(item, locale)}
                      targetLabel={`${t.copyHighlight}: ${item.heading[locale]}`}
                    >
                      <span className="highlight-number" aria-hidden="true">
                        0{index + 1}
                      </span>
                      <div>
                        <h3>{item.heading[locale]}</h3>
                        <p>{item.text[locale]}</p>
                      </div>
                    </CopyableSection>
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
                    <CopyableSection
                      editMode={editMode}
                      locale={locale}
                      text={formatExperienceSummaryForClipboard(item, locale)}
                      targetLabel={`${t.copyExperienceSummary}: ${item.employer[locale]}`}
                    >
                      <p className="overview">{item.overview[locale]}</p>
                    </CopyableSection>
                    <ul className="achievements">
                      {item.achievements.map((achievement) => (
                        <li key={achievement.id}>
                          <CopyableSection
                            editMode={editMode}
                            locale={locale}
                            text={formatAchievementForClipboard(achievement, locale)}
                            targetLabel={`${t.copyAchievement}: ${item.employer[locale]}`}
                          >
                            {achievement.text[locale]}
                          </CopyableSection>
                        </li>
                      ))}
                    </ul>
                    <ul className="tags" aria-label={t.skills}>
                      {item.technologies.map((technology) => (
                        <li key={technology}>{technology}</li>
                      ))}
                    </ul>
                    <CopyableSection
                      className="full-experience-copy"
                      editMode={editMode}
                      locale={locale}
                      text={formatExperienceForClipboard(item, locale)}
                      targetLabel={`${t.copyFullExperience}: ${item.employer[locale]}`}
                    >
                      <span className="visually-hidden">{item.employer[locale]}</span>
                    </CopyableSection>
                  </article>
                ))}
              </div>
            </section>
            <section className="resume-section" id="cases" aria-labelledby="cases-title">
              <h2 id="cases-title">{t.cases}</h2>
              <div>
                {cases.map((item) => (
                  <article key={item.slug}>
                    <CopyableSection
                      editMode={editMode}
                      locale={locale}
                      text={formatCaseSummaryForClipboard(item, locale)}
                      targetLabel={`${t.copyCase}: ${item.title[locale]}`}
                    >
                      <h3>
                        <a className="text-link" href={localePath(locale, `cases/${item.slug}`)}>
                          {item.title[locale]}
                        </a>
                      </h3>
                      <p>{item.summary[locale]}</p>
                    </CopyableSection>
                  </article>
                ))}
              </div>
            </section>
            <section className="resume-section" id="projects" aria-labelledby="projects-title">
              <h2 id="projects-title">{t.projects}</h2>
              <div>
                <ProjectCards locale={locale} editMode={editMode} />
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
                  <CopyableSection
                    editMode={editMode}
                    locale={locale}
                    text={formatCaseSummaryForClipboard(item, locale)}
                    targetLabel={`${t.copyCase}: ${item.title[locale]}`}
                  >
                    <p className="overview">{item.summary[locale]}</p>
                  </CopyableSection>
                  {Object.entries(item.sections).map(([id, text]) => (
                    <section
                      className="resume-section"
                      id={id}
                      key={id}
                      aria-labelledby={`${id}-title`}
                    >
                      <h2 id={`${id}-title`}>{t[id as keyof typeof item.sections]}</h2>
                      <CopyableSection
                        editMode={editMode}
                        locale={locale}
                        text={formatCaseSectionForClipboard(
                          item,
                          id as keyof typeof item.sections,
                          locale,
                        )}
                        targetLabel={`${t.copyCaseSection}: ${t[id as keyof typeof item.sections]}`}
                      >
                        <p>{text[locale]}</p>
                      </CopyableSection>
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
                <ProjectCards locale={locale} editMode={editMode} />
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
        </div>
        <p>
          {t.updated}: <time dateTime={profile.updated}>{profile.updated}</time>
        </p>
      </footer>
    </>
  );
}
