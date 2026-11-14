import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createAppRouter } from '@/app/router';
import '@/i18n';
import { detectLocale, useLocaleStore } from '@/i18n/locale';
import { initPersistence } from '@/services/persistence';
import '@/styles/global.css';

const router = createAppRouter();
void initPersistence();

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

const render = () =>
  createRoot(root).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  );

// Browser language first (a saved choice replaces it once storage has loaded).
// French content loads lazily, so wait for it to avoid a flash of English.
useLocaleStore.getState().setLocale(detectLocale(navigator.languages)).then(render, render);
