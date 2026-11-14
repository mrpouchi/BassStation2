import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';

export function ChallengesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Challenges"
        title="Practice by doing"
        description="Identify controls, recreate sounds, troubleshoot patches and read waveforms. Feedback explains why, and you are never locked out."
      />
      <EmptyState
        title="No challenges yet"
        actions={<ButtonLink to="/synth-lab">Explore Synth Lab meanwhile</ButtonLink>}
      >
        Challenges build on the Synth Lab Hardware View and the visualizers. They arrive after the
        Learn milestone.
      </EmptyState>
    </>
  );
}
