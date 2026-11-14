import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { selectInputConnected, selectOutputConnected, useMidiStore } from '@/stores/midiStore';
import { t } from '@/i18n/t';

/** Real connection state of the hardware link, shown in the sidebar. */
export function MidiSupportIndicator() {
  const midi = useMidiStore();
  const connected = selectInputConnected(midi) || selectOutputConnected(midi);
  let label: string;
  let tone: 'neutral' | 'success' | 'warning' = 'neutral';
  if (midi.status === 'unsupported') {
    label = t('Web MIDI unsupported');
    tone = 'warning';
  } else if (midi.status === 'insecure') {
    label = t('MIDI needs HTTPS');
    tone = 'warning';
  } else if (connected) {
    label = midi.inputs.find((p) => p.id === midi.inputId)?.name ?? t('MIDI device connected');
    tone = 'success';
  } else if (midi.status === 'ready') {
    label = t('No device connected');
  } else {
    label = t('Not connected');
  }
  return (
    <Link to="/hardware" style={{ textDecoration: 'none' }} title={t('Hardware connection')}>
      <Badge tone={tone} dot>
        {label}
      </Badge>
    </Link>
  );
}
