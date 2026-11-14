import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useSynthStore } from '@/stores/synthStore';
import { ControlsTab } from './ControlsTab';
import { OnKeyTab } from './OnKeyTab';
import { ParameterInspector } from './ParameterInspector';
import { ParametersTab } from './ParametersTab';
import styles from './SynthLabPage.module.css';

type Tab = 'parameters' | 'controls' | 'on-key';
const TABS: { value: Tab; label: string }[] = [
  { value: 'parameters', label: 'Parameters' },
  { value: 'controls', label: 'Panel controls' },
  { value: 'on-key', label: 'On-Key functions' },
];

function isTab(v: string | null): v is Tab {
  return TABS.some((t) => t.value === v);
}

export function SynthLabPage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('view');
  const tab: Tab = isTab(raw) ? raw : 'parameters';
  const resetToInit = useSynthStore((s) => s.resetToInit);

  return (
    <>
      <PageHeader
        eyebrow="Synth Lab"
        title="Bass Station II reference"
        description="Every documented parameter and control from the official v5.0 manual, sharing one live state. The interactive Hardware View and Learning View are built on this registry."
        actions={
          <Button variant="secondary" onClick={resetToInit}>
            Reset to Init Patch
          </Button>
        }
      />
      <div className={styles.toolbar}>
        <SegmentedControl
          label="Reference view"
          options={TABS}
          value={tab}
          onChange={(v) => setParams({ view: v }, { replace: true })}
        />
      </div>
      <div className={styles.layout}>
        <div>
          {tab === 'parameters' && <ParametersTab />}
          {tab === 'controls' && <ControlsTab />}
          {tab === 'on-key' && <OnKeyTab />}
        </div>
        <div className={styles.side}>
          <ParameterInspector />
        </div>
      </div>
    </>
  );
}
