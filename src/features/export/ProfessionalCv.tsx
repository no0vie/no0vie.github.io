import React from 'react';
import type { CareerItem, Locale } from '../../content';
import { basePath, localePath } from '../../app/routes';
import { BrandMark } from '../../app/BrandMark';
import { createProfessionalCv } from './professional-cv';

function period(item: CareerItem, locale: Locale): string {
  if (item.datePrecision === 'approximate' && item.end)
    return `${item.start.slice(0, 4)}–${item.end.slice(0, 4)}`;
  const format = (value: string) =>
    new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(`${value}-01T00:00:00Z`),
    );
  return `${format(item.start)} — ${item.end ? format(item.end) : locale === 'ru' ? 'по настоящее время' : 'Present'}`;
}

export function ProfessionalCv({ locale, siteUrl }: { locale: Locale; siteUrl?: string }) {
  const cv = createProfessionalCv(locale, siteUrl);
  const contacts = [
    { href: `mailto:${cv.profile.contacts.emails[0]}`, label: cv.profile.contacts.emails[0] },
    { href: `mailto:${cv.profile.contacts.emails[1]}`, label: cv.profile.contacts.emails[1] },
    { href: cv.profile.contacts.telegram, label: cv.profile.contacts.telegram },
    { href: cv.profile.contacts.whatsapp, label: cv.profile.contacts.whatsapp },
    { href: cv.profile.github, label: cv.profile.github },
  ];

  return (
    <main className="professional-cv" data-locale={locale}>
      <header className="cv-header">
        <div>
          <p className="cv-role">{cv.profile.role[locale]}</p>
          <h1>
            {cv.profile.name[locale]}
            <span className="cv-accent" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="cv-direction">React / TypeScript / Frontend</p>
        </div>
        <BrandMark className="cv-brand-mark" />
      </header>

      <ul className="cv-contacts" aria-label={locale === 'ru' ? 'Контакты' : 'Contacts'}>
        {contacts.map((contact) => (
          <li key={contact.href}>
            <a href={contact.href}>{contact.label}</a>
          </li>
        ))}
        <li>
          <a href={cv.portfolioUrl}>{cv.portfolioUrl}</a>
        </li>
      </ul>

      <section className="cv-profile" aria-labelledby="cv-about">
        <img
          className="cv-portrait"
          src={basePath('profile.jpg')}
          alt={locale === 'ru' ? 'Портрет Евгения Новикова' : 'Portrait of Eugene Novikov'}
        />
        <div>
          <h2 id="cv-about">{cv.labels.about}</h2>
          <p>{cv.profile.about[locale]}</p>
        </div>
      </section>

      <section className="cv-section" aria-labelledby="cv-experience">
        <h2 id="cv-experience">{cv.labels.experience}</h2>
        <div className="cv-experience-list">
          {cv.experience.map((item) => (
            <article className="cv-experience" key={item.id}>
              <header className="cv-experience-heading">
                <div>
                  <p className="cv-employer">{item.employer[locale]}</p>
                  <h3>{item.role[locale]}</h3>
                </div>
                <p className="cv-period">{period(item, locale)}</p>
              </header>
              <p className="cv-overview">{item.overview[locale]}</p>
              <ul className="cv-achievements">
                {item.achievements.map((achievement) => (
                  <li key={achievement.id}>{achievement.text[locale]}</li>
                ))}
              </ul>
              {item.outcome && <p className="cv-outcome">{item.outcome[locale]}</p>}
              {item.links.length > 0 && (
                <p className="cv-work-links">
                  {item.links.map((link, index) => (
                    <React.Fragment key={link.url}>
                      {index > 0 && <span aria-hidden="true"> · </span>}
                      <a href={link.url}>{link.label}</a>
                    </React.Fragment>
                  ))}
                </p>
              )}
              <p className="cv-technologies">{item.technologies.join(' · ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cv-section" aria-labelledby="cv-skills">
        <h2 id="cv-skills">{cv.labels.coreSkills}</h2>
        <dl className="cv-skills">
          {cv.coreSkills.map((group) => (
            <div key={group.id}>
              <dt>{group.label[locale]}</dt>
              <dd>{group.skills.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="cv-section" aria-labelledby="cv-education">
        <h2 id="cv-education">{cv.labels.education}</h2>
        <p>{cv.profile.education[locale]}</p>
      </section>

      {cv.releasedProjects.length > 0 && (
        <section className="cv-section" aria-labelledby="cv-projects">
          <h2 id="cv-projects">{cv.labels.releasedProjects}</h2>
          <ul className="cv-projects">
            {cv.releasedProjects.map((project) => (
              <li key={project.slug}>
                <a href={localePath(locale, 'projects')}>{project.title[locale]}</a>
                {' — '}
                {project.summary[locale].split('.')[0]}.
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="cv-portfolio-link">
        {cv.labels.portfolio} <a href={cv.portfolioUrl}>{cv.portfolioUrl}</a>
      </p>
    </main>
  );
}
