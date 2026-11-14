# Bass Station Academy — development guide

The [README](README.md) explains what the app does and what it does not do. This file is for people
working on the code.

## Setup and commands

```bash
npm install
npx playwright install chromium   # once, for end-to-end tests
npm run dev                       # http://localhost:5173
npm test                          # Vitest (jsdom + fake-indexeddb)
npm run test:e2e                  # Playwright against a production build (port 4173)
npm run lint && npm run typecheck && npm run build
```

Node 20+. TypeScript runs in strict mode with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.

## Architecture

The folder layout is in the README. The key ideas:

### 1. One parameter model

- **`src/data/synthesizer/parameters/*`**: one `ParameterDefinition` per value. Each has a name, section
  and scope (`patch` / `global` / `performance` / `panel`), plus:
  - how it is reached (`panel`, `on-key` key × presses, or `function-modifier`);
  - range, step, unit and default (from the Init Patch, with `defaultInferred` where the manual is silent),
    and `rangeSource`;
  - education text, concepts, related parameters and affected visuals;
  - MIDI mapping and verification, and the manual page.
- **`src/data/synthesizer/controls.ts`**: the physical controls. A control's `target` is either a
  parameter, several parameters, or a routing node `{ via: selectorParam, routes }`. `functionTarget` says
  what it edits while Function is held. `resolveControlTarget(target, values)` resolves the current
  routing.
- **`useSynthStore`**: the only live value map. `setValue(id, raw, origin)` validates, clamps and snaps
  to the step. `replaceValues(input, origin)` sanitises whole maps (storage, presets, lesson starting
  points).
- Components never hold their own copy of a value. Visualisers read through `useSynthValues(ids)`, which
  can be redirected by `ValuesOverrideContext`; demos and challenge targets use this to show fixed values
  without touching the user's state.

### 2. Visual engine (`src/engine/visuals`)

These are pure functions with no React, covered by unit tests:

- `calibration.ts`: maps panel values to physical units. Documented anchors cite the manual; inferred
  ones are marked as inferred.
- `waveforms.ts`, `oscillatorMix.ts`, `filter.ts` (analog prototype magnitude responses), `envelope.ts`,
  `lfo.ts`, `arp.ts`, `glide.ts`, `notes.ts`.
- Every visualiser is wrapped in `VizFrame`, which carries the "Theoretical model" badge.
  `VizOptionsContext` hides the numeric readouts on quiz targets.

### 3. Tasks (`src/engine/tasks`)

`Task` = `set` (conditions on parameters) | `choice` | `changed` (N patch parameters differ from Init) |
`select` (identify a control: the inspected parameter must match). `evaluateTask` returns per-condition
results and a message. `TaskPanel` renders any task; lessons show the targets up front, while challenges
can hide them and reveal hints after each check.

### 4. MIDI (`src/engine/midi`, `src/services/midiController.ts`)

- `MidiDeviceManager`: a Web MIDI wrapper (ports, `statechange`), free of app state.
- `MidiParameterMapper`: one codec per parameter (`bits`, `basis: documented | inferred`, encode and
  decode), message building (CC, 8-bit CC pair, NRPN 99/98/6), and lookup indexes for incoming messages.
- `MidiInputHandler`: a stateful parser for CC pairs and the NRPN sequence, plus notes, bend, pressure and
  program change.
- `MidiOutputHandler`: coalesces values per parameter and flushes once per animation frame.
- `useMidiStore`: connection state, ports, receive/send flags, the activity log, and the user's local
  verification results.
- `MidiController`: wires everything together.
  - It writes incoming changes with origin `'midi'`.
  - It only sends changes whose origin is `'ui'` or `'preset'` with a single id, and only when sending is
    enabled. Bulk loads are sent explicitly with `sendPatch()`.
  - It remembers the selected ports by ID and name so it can reattach after a reconnection.
  - Routing switches send no MIDI, so it follows them: `selectorRoutingFor(id)` (registry) gives the
    switch positions that make a control reach `id`, and incoming values set those positions. Group
    targets (Env Select on Amp+Mod) are detected when siblings arrive within 250 ms.
  - Raw values a codec cannot decode become `undecoded` events. The user can teach their meaning
    (`useMidiStore.learnedValues`, persisted with the MIDI settings), and taught values override the codec.
- Verification policy:
  - The registry stays at `requires-testing` until a hardware session confirms a mapping. A test enforces
    this.
  - Users' own results (`useMidiStore.verification`) are displayed separately as "(your device)" through
    `effectiveVerification()`.

### 5. Languages (`src/i18n`)

- `useLocaleStore` holds `'en' | 'fr'`: detected from `navigator.languages` at startup and saved in
  `preferences/locale`. `setLocale` is async and serialized, so the latest request wins.
- Interface strings: `t('English text', { vars })` and `tn(count, one, other)`. The English text is the
  key and `fr/ui.ts` maps it to French. A missing key falls back to English.
- Content (lessons, challenges, parameters, controls, glossary, curriculum, presets) is translated with
  text overlays. `content.ts` lists each content set and its text keys. On a language change, English
  strings are restored and the French overlay (`fr/content.ts`, a lazily loaded chunk) is written into the
  data objects in place. Ids, values and structure are never touched. The app shell remounts on change,
  so everything renders again.
- Labels printed on the hardware stay English.
- Tests (`i18n.test.ts`) fail if a French overlay has a stray or missing string, if a literal `t()` key in
  the source has no French entry, or if placeholders differ.
- When you add or change English content, add the French text to the matching `fr/*.ts` file in the same
  shape. The tests will tell you what is missing.

### 6. Persistence (`src/services`)

- IndexedDB `bass-station-academy` holds these object stores:
  - `preferences`: theme, language, MIDI settings;
  - `session`: panel values as `{ format: 1, values }`;
  - `progress`: `v1`;
  - `presets`: one record per preset.
- Migrations live in `services/storage/db.ts`: bump `DB_VERSION` and append a function to `MIGRATIONS`.
- Everything read from storage or imported from a file goes through a parser: `sanitizeValues`,
  `parseProgress`, `parseMidiSettings`, `parsePreset`, `parseImportFile`.
- If IndexedDB is unavailable, the app runs in memory and says so on the dashboard and in the Sound
  Library.

## Conventions

- **Never invent hardware facts.** New parameters must cite a manual page. Anything the manual omits gets
  `rangeSource: 'inferred'`, `defaultInferred: true` or a `midi.notes` entry, and should be added to
  `docs/research/bass-station-ii-reference.md`.
- Parameter IDs follow `section.camelName`. Panel routing switches use `panel.*`.
- Colours come only from the tokens in `src/styles/tokens.css`, defined for both light and dark. The
  virtual panel is always dark, like the instrument.
- CSS Modules for components. Inline styles only for one-off dynamic values.
- No placeholder may look finished. Unbuilt or unsupported things say so plainly in the UI.
- New lessons and challenges are covered by tests automatically. They must use valid parameters, be
  solvable, and not already be solved by the Init Patch.

## Current status

All six phases are implemented. The numbers:

|                          |                                              |
| ------------------------ | -------------------------------------------- |
| Parameters               | 114 (all cite manual pages)                  |
| Physical controls        | 58, covering callouts 1–49                   |
| On-Key functions         | 37, including multi-press extended functions |
| Documented MIDI mappings | 100 (0 verified on hardware by the project)  |
| Lessons                  | 44 across 8 chapters                         |
| Challenges               | 18 across 6 types                            |
| Example presets          | 6                                            |
| Tests                    | 287 Vitest + 7 Playwright                    |

## Known limitations

The full list is in the README under "What the app cannot do (yet)". Technical notes:

- The value encodings of CC pairs (8-bit split: MSB = top 7 bits, LSB bit 6 = lowest bit), the bipolar
  offsets and the enum indexes are inferred. Sub Osc Octave uses the manual's listed order (-2, -1), and
  envelope triggering uses Multi = 0, Single = 1, Autoglide = 2 from a hardware report (unconfirmed).
- The duplicate NRPN 87/91 entries (Speed/Sync vs Sync Value) resolve to Speed/Sync on input. This
  ambiguity is pinned by a test.
- The bundle is ~300 KB of app code plus ~210 KB of vendor code (uncompressed). Route-level code
  splitting was not needed for the current size.
- There is no service worker, so no installable offline mode.

## Next tasks

1. Hardware verification session. Promote confirmed mappings and correct the codecs in
   `MidiParameterMapper`.
2. Patch SysEx research from real dumps, then hardware preset import and export.
3. An optional Web Audio preview, labelled as an approximation.
4. Lessons for AFX mode, micro-tuning and paraphony.
5. A service worker for offline installs.
6. More languages.
