# Bass Station Academy — development guide

An interactive web app for learning subtractive synthesis on the **Novation Bass Station II**.
It is visual only (no audio engine). It works without hardware and, in a later milestone,
connects to a real Bass Station II over Web MIDI.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # unit + component tests (Vitest, jsdom, fake IndexedDB)
npm run test:e2e     # Playwright smoke tests against a production build
npm run lint && npm run typecheck && npm run build
```

Node 20+ is required. The development target is desktop Chrome. Web MIDI requires HTTPS or localhost.

## Stack

React 18 · TypeScript (strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) · Vite 5 ·
CSS Modules + design tokens · React Router 6 · Zustand 5 · IndexedDB via `idb` · Vitest +
Testing Library · Playwright · ESLint (typescript-eslint strict) · Prettier.

## Architecture

```
src/
  app/                 shell, routing, navigation, icons
  components/
    ui/                design-system primitives (Button, Badge, Card, SegmentedControl…)
    controls/          parameter-bound inputs (ParameterEditor)
    synthesizer/       Hardware View panel components (Phase 2)
    visualizers/       waveform / filter / ADSR / LFO views (Phase 2)
  features/            one folder per section: dashboard, learn, synth-lab, challenges, sound-library, midi
  engine/
    parameters/        types, registry lookups, validation, formatting, control routing
    midi/              Web MIDI support detection, MIDI descriptions (MIDI modules: Phase 5)
    visuals/           pure math for visualizers (Phase 2)
  data/
    synthesizer/       ★ parameter registry, control inventory, On-Key layout, concepts, sync values
    lessons/           curriculum outline (content: Phase 3)
    challenges/        (Phase 4)
  stores/              Zustand stores (synth state, preferences, persistence status)
  services/            IndexedDB access and persistence wiring
  styles/              tokens.css (light/dark), global.css
docs/research/         sources and findings about the hardware
e2e/                   Playwright tests
```

### Single source of truth

- `src/data/synthesizer/parameters/*` holds **one** `ParameterDefinition` per value: name, section,
  scope, access path (panel / On-Key key × presses / Function+control), range, default (Init Patch),
  unit, education text, concepts, related parameters, MIDI mapping with verification status, manual
  page, and affected visualizers.
- `src/data/synthesizer/controls.ts` describes **physical controls**, which _target_ parameters. Shared
  controls route through panel selector parameters. For example, the Coarse knob edits `osc1.coarse` or `osc2.coarse`
  depending on `panel.oscSelect`, and the ADSR faders edit one or both envelopes via `panel.envSelect`.
  `resolveControlTarget()` resolves this from live state.
- `useSynthStore` holds the only live value map. Every view reads from it and writes to it through
  `setValue(id, raw, origin)`, which validates, clamps and step-snaps. `origin` (`ui | midi | preset |
system`) lets the MIDI layer avoid feedback loops.
- Untrusted data (storage, imports) always passes through `sanitizeValues()`.

### MIDI verification policy

A mapping copied from the manual has status `requires-testing`. Only a hardware test session may
promote it to `input-verified`, `output-verified` or `both-verified`. A unit test enforces that nothing
is marked verified today. The UI never presents an untested mapping as working.

### Persistence

IndexedDB database `bass-station-academy`, stores `preferences`, `session`, `presets`, `progress`.
To change the schema, bump `DB_VERSION` and append a migration in `src/services/storage/db.ts`.
Stored panel state is wrapped as `{ format: 1, values }` so it can be migrated later. If IndexedDB
is unavailable, the app keeps working and the dashboard says changes won't be kept.

## Conventions

- Parameter ids: `section.camelName` (e.g. `filter.lfo2Depth`). Panel routing switches use `panel.*`.
- Official names come from the manual and panel. Never invent controls or ranges. Mark anything
  undocumented with `rangeSource: 'inferred'`, `defaultInferred: true` or a `midi.notes` entry.
- Colours only via tokens in `styles/tokens.css`. Every token is defined for both light and dark.
- Components use CSS Modules. Avoid inline styles except for one-off dynamic values.
- No placeholder presented as complete. Unbuilt features show an honest empty state.

## Current status

**Phase 1: foundations. Done.**

- Vite/React/TS project, lint, format, unit/component/E2E tests.
- Design system (tokens, light/dark/auto theme, primitives) and responsive app shell with navigation.
- Parameter registry: 114 parameters, 58 physical controls (all manual callouts 1–49), 25-key On-Key
  layout including multi-press functions, concept glossary, sync-value table, Init Patch defaults.
- Synth Lab reference (Parameters / Panel controls / On-Key) with a parameter inspector bound to the
  shared store, showing live control routing.
- IndexedDB persistence of theme and panel state, with validation on load.
- Web MIDI capability detection. No device access yet.
- Curriculum outline (8 chapters, 44 lessons) marked "in writing".

## Known limitations

- No Hardware View, Learning View or visualizers yet (Phase 2).
- No lesson content, challenges or presets yet.
- No MIDI device connection. All 100 documented mappings are untested on hardware.
- Manual discrepancies are listed in `docs/research/bass-station-ii-reference.md`.
- The parameter range model is the display range. MIDI value encoding is defined in Phase 5.

## Next tasks (Phase 2: Synth Lab)

1. Gather a panel layout reference and build the Hardware View (knob, fader, switch, select-button
   and LED components driven by `CONTROLS` and `resolveControlTarget`).
2. Pointer, wheel and keyboard interaction for knobs/faders, with fine-adjust modifiers and accessible
   `role="slider"` semantics.
3. Learning View: the same store grouped by concept, using `ParameterEditor`.
4. `engine/visuals`: pure functions for waveform samples (incl. pulse width, sync), filter magnitude
   response (type/shape/slope/cutoff/resonance), ADSR curves (using the documented time anchors),
   and LFO shapes (incl. slew and delay). Unit-test them, then render with SVG.
5. Label visualizations clearly as theoretical models, not circuit simulations.
