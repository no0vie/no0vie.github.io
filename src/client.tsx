import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/global.css';

const root = document.getElementById('root');
if (root) {
  const locale = document.documentElement.lang === 'en' ? 'en' : 'ru';
  hydrateRoot(
    root,
    <App
      locale={locale}
      page={document.body.dataset.page ?? ''}
      enableEvolution={document.body.dataset.evolution === 'true'}
    />,
  );
}
