import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';

export function SoundLibraryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sound Library"
        title="Your presets"
        description="Save, name, describe, compare and organise your own sounds, and load them back into Synth Lab."
      />
      <EmptyState title="Preset saving is not available yet">
        Your current Synth Lab settings are already kept automatically on this device. Named
        presets, comparison and import/export arrive in the Sound Library milestone. Hardware SysEx
        patch transfer will only ship once the patch format has been verified.
      </EmptyState>
    </>
  );
}
