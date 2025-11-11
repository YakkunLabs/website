import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import App from './App';
import './styles/tailwind.css';

function getBasename() {
  const rawBase = import.meta.env.BASE_URL;
  if (rawBase && rawBase !== '/' && rawBase !== './') {
    return rawBase;
  }

  const isGitHubPages = window.location.hostname.endsWith('github.io');
  if (isGitHubPages) {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const repoSegment = segments.at(0);
    if (repoSegment) {
      return `/${repoSegment}/`;
    }
  }

  return '/';
}

const basename = getBasename();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  </React.StrictMode>,
);

