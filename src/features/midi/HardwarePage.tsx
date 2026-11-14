import { useMemo, useState } from 'react';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { ParameterEditor } from '@/components/controls/ParameterEditor';
import { PARAMETERS } from '@/data/synthesizer/parameters';
import { describeMidiMapping, VERIFICATION_LABELS } from '@/engine/midi/describe';
import { codecFor } from '@/engine/midi/MidiParameterMapper';
import { WEB_MIDI_SUPPORT_TEXT } from '@/engine/midi/support';
import { effectiveVerification } from '@/engine/midi/verification';
import { getMidiController } from '@/services/midiController';
import { selectInputConnected, selectOutputConnected, useMidiStore } from '@/stores/midiStore';
import styles from './HardwarePage.module.css';
import { LearnedValuesList } from './LearnSwitchValues';
import { t, tn } from '@/i18n/t';

const STATUS_TEXT: Record<string, { label: string; tone: BadgeTone }> = {
  unsupported: { label: WEB_MIDI_SUPPORT_TEXT.unsupported.label, tone: 'warning' },
  insecure: { label: WEB_MIDI_SUPPORT_TEXT['insecure-context'].label, tone: 'warning' },
  idle: { label: 'Not connected', tone: 'neutral' },
  requesting: { label: 'Waiting for permission…', tone: 'info' },
  ready: { label: 'MIDI access granted', tone: 'success' },
  denied: { label: 'Permission denied', tone: 'danger' },
  error: { label: 'MIDI error', tone: 'danger' },
};

function hex(bytes: number[]) {
  return bytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
}

export function HardwarePage() {
  const midi = useMidiStore();
  const controller = getMidiController();
  const [filter, setFilter] = useState('');
  const [sentCount, setSentCount] = useState<number | null>(null);
  const [lastTested, setLastTested] = useState<string | null>(null);
  const inConnected = selectInputConnected(midi);
  const outConnected = selectOutputConnected(midi);
  const status = STATUS_TEXT[midi.status] ?? { label: 'Not connected', tone: 'neutral' as const };

  const mapped = useMemo(
    () =>
      PARAMETERS.filter((p) => codecFor(p) !== null && p.scope !== 'performance').filter(
        (p) => !filter || p.name.toLowerCase().includes(filter.toLowerCase()),
      ),
    [filter],
  );
  const verifiedCount = Object.values(midi.verification).filter(
    (v) => v.input === 'pass' || v.output === 'pass',
  ).length;

  return (
    <>
      <PageHeader
        eyebrow={t('Hardware')}
        title={t('Bass Station II over USB MIDI')}
        description={t(
          'Connect a real Bass Station II to sync knob movements in both directions. Everything else in the Academy works without hardware.',
        )}
      />
      <div className={styles.grid}>
        <Card
          className={styles.half}
          title={t('Connection')}
          actions={
            <Badge tone={status.tone} dot>
              {t(status.label)}
            </Badge>
          }
        >
          {(midi.status === 'unsupported' || midi.status === 'insecure') && (
            <p className={styles.muted}>
              {midi.status === 'unsupported'
                ? t(WEB_MIDI_SUPPORT_TEXT.unsupported.detail)
                : t(WEB_MIDI_SUPPORT_TEXT['insecure-context'].detail)}
            </p>
          )}
          {(midi.status === 'idle' || midi.status === 'denied' || midi.status === 'error') && (
            <div className={styles.row}>
              <Button variant="primary" onClick={() => void controller.connect()}>
                {midi.status === 'idle' ? t('Connect MIDI') : t('Try again')}
              </Button>
              <span className={styles.muted}>
                {midi.error ??
                  t(
                    'The browser will ask for permission to use MIDI devices. SysEx is not requested.',
                  )}
              </span>
            </div>
          )}
          {midi.status === 'ready' && (
            <>
              <div className={styles.row}>
                <label className={styles.field}>
                  {t('Input (from the synth)')}
                  <select
                    className={styles.select}
                    value={midi.inputId ?? ''}
                    onChange={(e) => controller.selectInput(e.target.value || null)}
                  >
                    <option value="">{t('None')}</option>
                    {midi.inputs.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.state !== 'connected'}>
                        {p.name}
                        {p.state !== 'connected' ? t(' (disconnected)') : ''}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  {t('Output (to the synth)')}
                  <select
                    className={styles.select}
                    value={midi.outputId ?? ''}
                    onChange={(e) => controller.selectOutput(e.target.value || null)}
                  >
                    <option value="">{t('None')}</option>
                    {midi.outputs.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.state !== 'connected'}>
                        {p.name}
                        {p.state !== 'connected' ? t(' (disconnected)') : ''}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className={styles.row}>
                <Badge tone={inConnected ? 'success' : 'neutral'} dot>
                  {t('Input')}{' '}
                  {inConnected
                    ? t('connected')
                    : midi.inputId
                      ? t('disconnected (waiting to reconnect)')
                      : t('not selected')}
                </Badge>
                <Badge tone={outConnected ? 'success' : 'neutral'} dot>
                  {t('Output')}{' '}
                  {outConnected
                    ? t('connected')
                    : midi.outputId
                      ? t('disconnected (waiting to reconnect)')
                      : t('not selected')}
                </Badge>
              </div>
              {midi.inputs.length === 0 && midi.outputs.length === 0 && (
                <p className={styles.muted}>
                  {t(
                    'No MIDI devices found. Connect the Bass Station II by USB and switch it on. It appears here automatically.',
                  )}
                </p>
              )}
            </>
          )}
        </Card>

        <Card className={styles.half} title={t('Settings')}>
          <div className={styles.toggleRow}>
            <div>
              <strong>{t('MIDI channel')}</strong>
              <p>
                {t(
                  'Must match the synth’s Global: MIDI Channel (Function + upper G#). The default is 1.',
                )}
              </p>
            </div>
            <div style={{ minWidth: 180 }}>
              <ParameterEditor id="global.midiChannel" />
            </div>
          </div>
          <div className={styles.toggleRow}>
            <div>
              <strong>{t('Receive from hardware')}</strong>
              <p>{t('Knob movements on the synth update the Academy.')}</p>
            </div>
            <Switch
              checked={midi.receive}
              onChange={(v) => midi.set({ receive: v })}
              label={t('Receive from hardware')}
            />
          </div>
          <div className={styles.toggleRow}>
            <div>
              <strong>{t('Send to hardware')}</strong>
              <p>{t('Changes made in the Academy are sent to the synth.')}</p>
            </div>
            <Switch
              checked={midi.send}
              onChange={(v) => midi.set({ send: v })}
              label={t('Send to hardware')}
            />
          </div>
          {midi.send && (
            <p className={styles.warning}>
              {t(
                'The MIDI numbers come from Novation’s manual, but most value encodings are inferred. Test the parameters you rely on below before trusting them.',
              )}
            </p>
          )}
          <div className={styles.row}>
            <Button disabled={!outConnected} onClick={() => setSentCount(controller.sendPatch())}>
              {t('Send current settings to the synth')}
            </Button>
            {sentCount !== null && (
              <span className={styles.muted}>{t('Sent {n} parameters.', { n: sentCount })}</span>
            )}
          </div>
        </Card>

        <Card
          className={styles.full}
          title={t('Panel switches and taught values')}
          subtitle={t('How the Academy keeps its panel in step with yours.')}
        >
          <p className={styles.muted}>
            {t(
              'Osc Select, Env Select, Noise/Ring/Ext and the Pulse Width source switch send no MIDI of their own, so moving them is invisible to the app. When you then turn a knob, the synth sends the message of the parameter it is really editing (for example Ring Mod level), and the Academy moves its switch to match. On Amp+Mod Env, the faders send both envelopes at once and the app shows Amp+Mod.',
            )}
          </p>
          <LearnedValuesList />
        </Card>

        <Card
          className={styles.full}
          title={t('Activity')}
          subtitle={t('The last MIDI messages, newest first. Clock messages are hidden.')}
        >
          {midi.log.length === 0 ? (
            <p className={styles.muted}>{t('No messages yet.')}</p>
          ) : (
            <ul className={styles.log}>
              {midi.log.map((e, i) => (
                <li key={`${e.at}-${i}`}>
                  <span>{e.dir === 'in' ? 'IN' : 'OUT'}</span>
                  <span>{hex(e.bytes)}</span>
                  <span>{e.label}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          className={styles.full}
          title={t('Compatibility test')}
          subtitle={tn(
            verifiedCount,
            'Verify each documented mapping on your own synth. {count} parameter verified on your device so far. Results are stored on this computer only.',
            'Verify each documented mapping on your own synth. {count} parameters verified on your device so far. Results are stored on this computer only.',
          )}
        >
          <ol className={styles.muted} style={{ margin: 0, paddingLeft: 18 }}>
            <li>
              <strong>{t('Input:')}</strong>{' '}
              {t(
                'click “Listen”, then move that control on the synth. If the expected parameter arrives, input is verified.',
              )}
            </li>
            <li>
              <strong>{t('Output:')}</strong>{' '}
              {t('click “Send”, then say whether the synth changed (the display shows the value).')}
            </li>
          </ol>
          <input
            className={styles.select}
            type="search"
            placeholder={t('Filter parameters…')}
            aria-label={t('Filter parameters')}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('Parameter')}</th>
                  <th>MIDI</th>
                  <th className={styles.hideNarrow}>{t('Value encoding')}</th>
                  <th>{t('Status')}</th>
                  <th>{t('Test')}</th>
                </tr>
              </thead>
              <tbody>
                {mapped.map((p) => {
                  const codec = codecFor(p);
                  const local = midi.verification[p.id];
                  const eff = effectiveVerification(p, local);
                  return (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td className="mono">{describeMidiMapping(p.midi.mapping)}</td>
                      <td className={`${styles.codec} ${styles.hideNarrow}`}>
                        {codec?.basis === 'documented' ? t('Documented') : t('Inferred')}:{' '}
                        {codec?.description}
                      </td>
                      <td>
                        <Badge tone={eff.local ? 'success' : 'warning'} dot>
                          {t(VERIFICATION_LABELS[eff.status])}
                          {eff.local ? t(' (your device)') : ''}
                        </Badge>
                        {local?.output === 'fail' && (
                          <div className={styles.codec}>{t('Output reported as not working')}</div>
                        )}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Button
                            size="sm"
                            disabled={!inConnected}
                            variant={midi.listeningFor === p.id ? 'primary' : 'secondary'}
                            onClick={() =>
                              midi.set({ listeningFor: midi.listeningFor === p.id ? null : p.id })
                            }
                          >
                            {midi.listeningFor === p.id ? t('Listening…') : t('Listen')}
                          </Button>
                          <Button
                            size="sm"
                            disabled={!outConnected}
                            onClick={() => {
                              if (controller.testOutput(p.id)) setLastTested(p.id);
                            }}
                          >
                            {t('Send')}
                          </Button>
                          {lastTested === p.id && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  midi.recordVerification(p.id, { output: 'pass' });
                                  setLastTested(null);
                                }}
                              >
                                {t('It changed')}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  midi.recordVerification(p.id, { output: 'fail' });
                                  setLastTested(null);
                                }}
                              >
                                {t('No change')}
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className={styles.muted}>
            {t(
              'Not supported: patch dumps and SysEx. The manual documents the Dump procedure but not the patch byte format, so the Academy does not read or write hardware patch memories.',
            )}
          </p>
        </Card>
      </div>
    </>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: 40,
        height: 22,
        flex: 'none',
        borderRadius: 999,
        border: 0,
        background: checked ? 'var(--accent)' : 'var(--border-strong)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 200ms',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 21 : 3,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 200ms',
        }}
      />
    </button>
  );
}
