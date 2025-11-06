import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@components/app/app';

import { ErrorBoundary } from './components/error-boundaries/error-boundary';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
