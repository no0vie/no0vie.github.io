import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/global.css';

const root = document.getElementById('root');
if (root) {
  const locale = document.documentElement.lang === 'en' ? 'en' : 'ru';
  const page = document.body.dataset.page ?? '';
  const enableEvolution = document.body.dataset.evolution === 'true';
  const props = { locale, page, enableEvolution } as const;

  if (page === 'interview' || page.startsWith('interview/')) {
    void import('./features/interview/InterviewPage').then(({ InterviewPage }) => {
      hydrateRoot(root, <App {...props} interviewComponent={InterviewPage} />);
    });
  } else {
    hydrateRoot(root, <App {...props} />);
  }
}
