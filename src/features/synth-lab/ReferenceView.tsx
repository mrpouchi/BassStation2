import { useSearchParams } from 'react-router-dom';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ControlsTab } from './ControlsTab';
import { OnKeyTab } from './OnKeyTab';
import { ParametersTab } from './ParametersTab';
import { t } from '@/i18n/t';

type Ref = 'parameters' | 'controls' | 'on-key';
const REFS: { value: Ref; label: string }[] = [
  { value: 'parameters', label: 'Parameters' },
  { value: 'controls', label: 'Panel controls' },
  { value: 'on-key', label: 'On-Key functions' },
];

export function ReferenceView() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('ref');
  const ref: Ref = REFS.some((r) => r.value === raw) ? (raw as Ref) : 'parameters';
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <SegmentedControl
          label={t('Reference section')}
          options={REFS.map((r) => ({ ...r, label: t(r.label) }))}
          value={ref}
          onChange={(v) => setParams({ view: 'reference', ref: v }, { replace: true })}
        />
      </div>
      {ref === 'parameters' && <ParametersTab />}
      {ref === 'controls' && <ControlsTab />}
      {ref === 'on-key' && <OnKeyTab />}
    </>
  );
}
