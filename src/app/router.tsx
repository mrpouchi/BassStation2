import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { ChallengePage } from '@/features/challenges/ChallengePage';
import { ChallengesPage } from '@/features/challenges/ChallengesPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { LearnPage } from '@/features/learn/LearnPage';
import { LessonPage } from '@/features/learn/LessonPage';
import { HardwarePage } from '@/features/midi/HardwarePage';
import { PlayAlongPage } from '@/features/play-along/PlayAlongPage';
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
      { path: 'learn/:chapterId/:lessonId', element: <LessonPage /> },
      { path: 'synth-lab', element: <SynthLabPage /> },
      { path: 'challenges', element: <ChallengesPage /> },
      { path: 'challenges/:challengeId', element: <ChallengePage /> },
      { path: 'play-along', element: <PlayAlongPage /> },
      { path: 'library', element: <SoundLibraryPage /> },
      { path: 'hardware', element: <HardwarePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const createAppRouter = () => createBrowserRouter(routes);
