import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import '@/i18n';
import { useLocaleStore } from '@/i18n/locale';

// Tests run in English unless they switch language themselves.
afterEach(async () => {
  await useLocaleStore.getState().setLocale('en');
});
