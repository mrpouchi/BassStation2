import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { ChallengesPage } from '@/features/challenges/ChallengesPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { LearnPage } from '@/features/learn/LearnPage';
import { SoundLibraryPage } from '@/features/sound-library/SoundLibraryPage';
import { SynthLabPage } from '@/features/synth-lab/SynthLabPage';
import { AppShell } from './AppShell';
import { NotFoundPage } from './NotFoundPage';

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'learn', element: <LearnPage /> },
      { path: 'synth-lab', element: <SynthLabPage /> },
      { path: 'challenges', element: <ChallengesPage /> },
      { path: 'library', element: <SoundLibraryPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const createAppRouter = () => createBrowserRouter(routes);
