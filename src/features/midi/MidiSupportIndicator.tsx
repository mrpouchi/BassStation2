import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { selectInputConnected, selectOutputConnected, useMidiStore } from '@/stores/midiStore';

/** Real connection state of the hardware link, shown in the sidebar. */
export function MidiSupportIndicator() {
  const midi = useMidiStore();
  const connected = selectInputConnected(midi) || selectOutputConnected(midi);
  let label: string;
  let tone: 'neutral' | 'success' | 'warning' = 'neutral';
  if (midi.status === 'unsupported') {
    label = 'Web MIDI unsupported';
    tone = 'warning';
  } else if (midi.status === 'insecure') {
    label = 'MIDI needs HTTPS';
    tone = 'warning';
  } else if (connected) {
    label = midi.inputs.find((p) => p.id === midi.inputId)?.name ?? 'MIDI device connected';
    tone = 'success';
  } else if (midi.status === 'ready') {
    label = 'No device connected';
  } else {
    label = 'Not connected';
  }
  return (
    <Link to="/hardware" style={{ textDecoration: 'none' }} title="Hardware connection">
      <Badge tone={tone} dot>
        {label}
      </Badge>
    </Link>
  );
}
