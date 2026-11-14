# Bass Station II — research notes

Primary source: **Novation Bass Station II user guide, version 5.0** (English, © 2025),
downloaded from Focusrite's official server:
<https://fael-downloads-prod.focusrite.com/customer/prod/downloads/bass_station_ii_user_guide_v5_en.pdf>

Every entry in `src/data/synthesizer/parameters` cites a page of this guide (`source.page`).
Sections used:

| Topic                                                                   | Pages |
| ----------------------------------------------------------------------- | ----- |
| Hardware overview (panel callouts 1–49)                                 | 8–13  |
| Oscillators, sub osc, paraphonic, oscillator error, extended sub tuning | 34–38 |
| Mixer, filter, filter tracking                                          | 38–42 |
| Envelopes, triggering, retrigger, retrigger count, fixed duration       | 42–46 |
| Portamento, glide divergence, effects, LFOs                             | 46–50 |
| Arpeggiator and sequencer                                               | 50–54 |
| AFX mode and overlays                                                   | 54–56 |
| On-Key functions                                                        | 56–65 |
| Sync values table                                                       | 67    |
| Init Patch parameter table                                              | 68–70 |
| MIDI parameters list                                                    | 71–74 |
| AFX SysEx, overlay parameter list                                       | 74–77 |
| Micro-tuning, greeting message SysEx                                    | 78–81 |

## How the manual's MIDI notation is interpreted

- `cc 26:58`: a coarse/fine CC pair. The second number is always the first + 32, which is the
  standard MIDI MSB/LSB controller convention. These parameters have 0–255 (8-bit) or wider ranges.
  **The exact bit packing across the pair has not been verified on hardware.**
- `NRPN 0:72`: NRPN MSB 0, LSB 72.
- Bipolar ranges such as `-63 to +63*` are stored in their display range in the app. How they
  encode to 7-bit values (presumably offset 64) is part of the MIDI milestone's hardware testing.

## Discrepancies and gaps found in the manual

These are flagged in the registry's `midi.notes` or `rangeSource: 'inferred'` fields and are shown
in the inspector. None are presented as verified.

1. **Osc 2 manual PW max**: the MIDI table says `5. to 94.3`. Osc 1 and p. 36 say 5–95. The app uses 5–95.
2. **Mixer noise level** is printed `23.55`. It is read as the pair `23:55`, matching the other mixer pairs.
3. **Mod wheel** is printed as `mod cc 0`. CC 1 is the standard mod wheel controller. Needs testing.
4. **LFO Sync value vs Speed/Sync** share NRPN 87 (LFO 1) and 91 (LFO 2) in the table. This ambiguity
   is asserted explicitly in tests so it cannot spread silently.
5. **Pitch Bend Range**: the MIDI table says `1 to 12`, while the On-Key description says −24…+24. The app uses −24…+24.
6. **Aftertouch LFO 2 Speed**: the MIDI table says `off, 1 to 127`, while the On-Key description says −63…+63. The app uses −63…+63.
7. **Mod Wh: Filter Freq** (lower C) has no MIDI entry, and its default is not in the Init Patch table.
8. **Envelope triggering NRPNs** take values `1,2,3`. Which value means Single/Multi/Autoglide is undocumented.
9. **LFO waveform CCs 88/89**: the values for each waveform are undocumented.
10. **Sub osc coarse/fine** (NRPN 0:84 / 0:77) have no documented range. They are assumed equal to the Osc coarse/fine ranges.
11. **Arp Tempo** has no documented CC. Tempo follows external MIDI clock when one is present.
12. The **Init Patch table** lists "LFO 1 Sync value off / LFO 2 Sync value on". These values match
    the Key Sync rows and are treated as Key Sync defaults. The sync-value default (`4b`) is marked
    `defaultInferred`.

## Not yet researched

- **Patch SysEx format** (the On-Key Dump function). The manual documents the dump procedure but
  not the byte layout. Hardware preset import/export stays out of scope until the format is
  verified against real dumps (Phase 6).
- **Physical panel geometry** for the Hardware View (Phase 2). Use official product photography as
  the layout reference. The callout numbering above gives the authoritative control list.
