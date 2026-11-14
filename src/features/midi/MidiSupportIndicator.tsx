import { useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
import { detectWebMidiSupport, WEB_MIDI_SUPPORT_TEXT } from '@/engine/midi/support';

export function MidiSupportIndicator() {
  const support = useMemo(() => detectWebMidiSupport(), []);
  const text = WEB_MIDI_SUPPORT_TEXT[support];
  return (
    <Badge tone={support === 'available' ? 'neutral' : 'warning'} dot title={text.detail}>
      {text.label}
    </Badge>
  );
}
