import { detectWebMidiSupport } from './support';

const withMidi = {
  requestMIDIAccess: () => Promise.reject(new Error('unused')),
} as unknown as Navigator;

describe('detectWebMidiSupport', () => {
  it('reports unsupported browsers', () => {
    expect(detectWebMidiSupport({} as Navigator, true)).toBe('unsupported');
    expect(detectWebMidiSupport(undefined, true)).toBe('unsupported');
  });
  it('requires a secure context', () => {
    expect(detectWebMidiSupport(withMidi, false)).toBe('insecure-context');
    expect(detectWebMidiSupport(withMidi, true)).toBe('available');
  });
});
