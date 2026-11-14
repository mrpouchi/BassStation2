import {
  ChallengeIcon,
  DashboardIcon,
  LearnIcon,
  LibraryIcon,
  PlayAlongIcon,
  SynthIcon,
} from './icons';

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', Icon: DashboardIcon, end: true },
  { to: '/learn', label: 'Learn', Icon: LearnIcon, end: false },
  { to: '/synth-lab', label: 'Synth Lab', Icon: SynthIcon, end: false },
  { to: '/challenges', label: 'Challenges', Icon: ChallengeIcon, end: false },
  { to: '/play-along', label: 'Play Along', Icon: PlayAlongIcon, end: false },
  { to: '/library', label: 'Sound Library', Icon: LibraryIcon, end: false },
] as const;
