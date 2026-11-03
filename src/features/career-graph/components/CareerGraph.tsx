import { createPlaybackPlan, snapshotAt } from '@no0vie/brnchly-core';

import { GraphRenderer } from '@no0vie/brnchly-react';
import '@no0vie/brnchly-react/styles.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { GraphRendererHandle } from '@no0vie/brnchly-react';
import { resumeData, type Locale } from '../../../content';
import { buildCareerGraph } from '../adapter/buildCareerGraph';
import { careerGraphConfig } from '../config/careerGraphConfig';

const labels = {
  ru: {
    fit: 'Показать весь граф',
    play: 'Воспроизвести развитие',
    pause: 'Пауза',
  },
  en: {
    fit: 'Fit graph to view',
    play: 'Play evolution',
    pause: 'Pause',
  },
} as const;

export function CareerGraph({ locale }: { locale: Locale }) {
  const graph = useMemo(() => buildCareerGraph(resumeData, locale, careerGraphConfig), [locale]);
  const renderer = useRef<GraphRendererHandle>(null);
  const rendererRoot = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(1);
  const [playing, setPlaying] = useState(false);
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const plan = useMemo(
    () =>
      createPlaybackPlan(graph, {
        stageDuration: reducedMotion ? 0 : 1200,
        transitionDuration: reducedMotion ? 0 : 250,
        speed: 1,
        autoplay: false,
        cameraMode: 'static',
      }),
    [graph, reducedMotion],
  );
  const snapshot = useMemo(() => snapshotAt(plan, { progress }), [plan, progress]);

  const t = labels[locale];

  useEffect(() => {
    document.documentElement.classList.add('career-graph-ready');
    return () => document.documentElement.classList.remove('career-graph-ready');
  }, []);

  useEffect(() => {
    const root = rendererRoot.current;
    if (!root) return;
    const synchronizeNodeNames = () => {
      for (const button of root.querySelectorAll<HTMLButtonElement>(
        '[data-node-id] > .universal-node',
      )) {
        button.removeAttribute('aria-label');
      }
    };
    synchronizeNodeNames();
    const observer = new MutationObserver(synchronizeNodeNames);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [graph]);

  useEffect(() => {
    if (!playing) return;
    if (reducedMotion) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const duration = Math.max(plan.duration, 1);
      const delta = (now - previous) / duration;
      previous = now;
      setProgress((current) => {
        const next = Math.min(1, current + delta);
        if (next >= 1) setPlaying(false);
        return next;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [plan.duration, playing, reducedMotion]);

  const pauseForInteraction = () => setPlaying(false);

  const showAll = progress >= 1;
  return (
    <section className="career-graph" aria-labelledby="career-graph-title">
      <div className="career-graph-heading">
        <h2 id="career-graph-title">{graph.title}</h2>
        <div className="career-graph-controls" aria-label={graph.title}>
          <button
            type="button"
            onClick={() => renderer.current?.fitToView({ duration: reducedMotion ? 0 : 200 })}
          >
            {t.fit}
          </button>
          <button
            type="button"
            aria-pressed={playing}
            onClick={() => {
              if (playing) {
                setPlaying(false);
                return;
              }
              if (reducedMotion) {
                setProgress(1);
                return;
              }
              if (progress >= 1) setProgress(0);
              setPlaying(true);
            }}
          >
            {playing ? t.pause : t.play}
          </button>
        </div>
      </div>
      <div ref={rendererRoot} className="career-graph-renderer">
        <GraphRenderer
          ref={renderer}
          graph={graph}
          layout="stage-lane"
          readonly
          editingEnabled={false}
          onNodeClick={pauseForInteraction}
          onManualCameraInteraction={pauseForInteraction}
          visibleNodeIds={showAll ? undefined : new Set(snapshot.visibleNodeIds)}
          visibleEdgeIds={showAll ? undefined : new Set(snapshot.visibleEdgeIds)}
          newNodeIds={new Set(snapshot.newlyVisibleNodeIds)}
          activeStageId={snapshot.activeStageId}
        />
      </div>
    </section>
  );
}
