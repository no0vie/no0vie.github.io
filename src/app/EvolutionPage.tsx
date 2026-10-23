import type { CSSProperties } from 'react';
import { careerMilestones, type Locale } from '../content';
import { copy } from './copy';
import { getEvolutionStages, type EvolutionStage } from './evolution-data';
import { localePath } from './routes';

function period(stage: EvolutionStage, locale: Locale): string {
  if (stage.datePrecision === 'approximate' && stage.end)
    return `${stage.start.slice(0, 4)}–${stage.end.slice(0, 4)}`;
  const format = (value: string) =>
    new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
      new Date(`${value}-01T00:00:00Z`),
    );
  return `${format(stage.start)} — ${stage.end ? format(stage.end) : copy[locale].present}`;
}

function RouteArt() {
  return (
    <svg className="evolution-route-art" viewBox="0 0 760 430" aria-hidden="true" focusable="false">
      <path
        className="evolution-route-shadow"
        d="M82 344 C168 316 130 205 245 238 S342 362 430 269 S522 100 682 88"
      />
      <path
        className="evolution-route-line"
        pathLength="1"
        d="M82 344 C168 316 130 205 245 238 S342 362 430 269 S522 100 682 88"
      />
      <g className="evolution-swallow" transform="translate(667 69)">
        <path d="M0 15c9-12 19-13 30-7-8 1-13 4-17 9 7-2 13-1 20 3-13 1-23-1-30-7-5 3-10 5-16 5 5-3 9-7 13-12z" />
      </g>
    </svg>
  );
}

export function EvolutionPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const stages = getEvolutionStages(locale);
  const milestone = careerMilestones[0];

  return (
    <article className="evolution-page" aria-labelledby="evolution-title" data-evolution-map>
      <header className="evolution-intro">
        <div>
          <p className="eyebrow">{t.evolutionLabel}</p>
          <h1 id="evolution-title">{t.evolutionTitle}</h1>
          <p className="evolution-lead">{t.evolutionIntro}</p>
        </div>
        <a className="text-link evolution-back" href={localePath(locale)}>
          <span aria-hidden="true">← </span>
          {t.back}
        </a>
      </header>

      <div className="evolution-layout">
        <section className="evolution-map" aria-labelledby="journey-map-title">
          <h2 id="journey-map-title" className="visually-hidden">
            {t.focusStep}
          </h2>
          <RouteArt />
          <div className="evolution-tabs" role="tablist" aria-label={t.focusStep}>
            {stages.map((stage, index) => (
              <button
                className="evolution-node"
                style={{ '--stage-index': index } as CSSProperties}
                key={stage.id}
                id={`stage-tab-${stage.id}`}
                type="button"
                role="tab"
                aria-selected={index === 0}
                aria-controls={`stage-panel-${stage.id}`}
                tabIndex={index === 0 ? 0 : -1}
                data-stage-id={stage.id}
              >
                <span className="evolution-node-index" aria-hidden="true">
                  0{index + 1}
                </span>
                <span className="evolution-node-copy">
                  <strong>{stage.employer}</strong>
                  <small>{period(stage, locale)}</small>
                </span>
              </button>
            ))}
          </div>
          {milestone && (
            <aside className="evolution-milestone" aria-label={milestone.title[locale]}>
              <span aria-hidden="true">◇</span>
              <div>
                <strong>{milestone.title[locale]}</strong>
                <p>{milestone.text[locale]}</p>
                {milestone.githubUrl && (
                  <a href={milestone.githubUrl} rel="noopener noreferrer">
                    GitHub · Tic-Tac-Toe ↗
                  </a>
                )}
              </div>
            </aside>
          )}
        </section>

        <section className="evolution-details" aria-label={t.stageDetails}>
          <p className="visually-hidden" aria-live="polite" data-evolution-live />
          {stages.map((stage, index) => (
            <div
              className="evolution-panel"
              id={`stage-panel-${stage.id}`}
              key={stage.id}
              role="tabpanel"
              aria-labelledby={`stage-tab-${stage.id}`}
              tabIndex={0}
              data-stage-panel={stage.id}
            >
              <p className="evolution-counter">{String(index + 1).padStart(2, '0')} / 04</p>
              <p className="dates">{period(stage, locale)}</p>
              <h2>{stage.employer}</h2>
              <p className="evolution-role">{stage.role}</p>
              <p>{stage.summary}</p>
              <h3>{t.capabilities}</h3>
              <ul className="evolution-capabilities">
                {stage.capabilities.map((capability) => (
                  <li key={capability}>{capability}</li>
                ))}
              </ul>
              <h3>{t.stageHighlights}</h3>
              <ul className="evolution-highlights">
                {stage.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <ul className="tags" aria-label={t.skills}>
                {stage.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
              <a className="text-link" href={`${localePath(locale)}#${stage.resumeAnchor}`}>
                {t.viewInResume} →
              </a>
            </div>
          ))}
          <div className="evolution-pager" data-evolution-pager hidden>
            <button type="button" data-evolution-previous>
              ← {t.previous}
            </button>
            <button type="button" data-evolution-next>
              {t.next} →
            </button>
          </div>
        </section>
      </div>
    </article>
  );
}
