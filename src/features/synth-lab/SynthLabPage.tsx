import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { HardwarePanel } from '@/components/synthesizer/HardwarePanel';
import { VisualizerGrid } from '@/components/visualizers/VisualizerGrid';
import { useHardwareUiStore } from '@/stores/hardwareUiStore';
import { useSynthStore } from '@/stores/synthStore';
import { UnknownValuePrompts } from '@/features/midi/LearnSwitchValues';
import { LearningView } from './LearningView';
import { ParameterInspector } from './ParameterInspector';
import { ReferenceView } from './ReferenceView';
import styles from './SynthLabPage.module.css';
import { t } from '@/i18n/t';

type View = 'hardware' | 'learning' | 'reference';
const VIEWS: { value: View; label: string }[] = [
  { value: 'hardware', label: 'Hardware View' },
  { value: 'learning', label: 'Learning View' },
  { value: 'reference', label: 'Reference' },
];

// Old links (?view=controls / ?view=on-key) map onto the reference sub-tabs.
const LEGACY: Record<string, string> = {
  parameters: 'parameters',
  controls: 'controls',
  'on-key': 'on-key',
};

export function SynthLabPage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('view') ?? 'hardware';
  const legacyRef = LEGACY[raw];
  const view: View = legacyRef
    ? 'reference'
    : VIEWS.some((v) => v.value === raw)
      ? (raw as View)
      : 'hardware';
  if (legacyRef && params.get('ref') !== legacyRef) {
    queueMicrotask(() => setParams({ view: 'reference', ref: legacyRef }, { replace: true }));
  }
  const resetToInit = useSynthStore((s) => s.resetToInit);
  const functionActive = useHardwareUiStore((s) => s.functionActive);

  return (
    <>
      <PageHeader
        eyebrow={t('Synth Lab')}
        title="Bass Station II"
        description={t(
          'Turn any control and see what it does. All three views share one live parameter state. Visual only: the app makes no sound.',
        )}
        actions={
          <Button variant="secondary" onClick={resetToInit}>
            {t('Reset to Init Patch')}
          </Button>
        }
      />
      <div className={styles.toolbar}>
        <SegmentedControl
          label={t('Synth Lab view')}
          options={VIEWS.map((v) => ({ ...v, label: t(v.label) }))}
          value={view}
          onChange={(v) => setParams({ view: v }, { replace: true })}
        />
        {view === 'hardware' && (
          <span className={styles.count}>
            {functionActive
              ? t(
                  'Function mode: press a key for its On-Key function, press it again for extended ones, use ◀ ▶ to change the value.',
                )
              : t(
                  'Drag knobs and faders vertically (Shift = fine). Double-click resets. Scroll or use the arrow keys to adjust.',
                )}
          </span>
        )}
      </div>

      <UnknownValuePrompts />

      {view === 'hardware' && (
        <div style={{ marginBottom: 20 }}>
          <HardwarePanel />
        </div>
      )}

      <div className={styles.layout}>
        <div>
          {view === 'hardware' && <VisualizerGrid />}
          {view === 'learning' && <LearningView />}
          {view === 'reference' && <ReferenceView />}
        </div>
        <div className={styles.side}>
          <ParameterInspector />
        </div>
      </div>
    </>
  );
}
