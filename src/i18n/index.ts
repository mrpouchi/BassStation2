import { applyContentLocale } from './content';
import { onBeforeLocaleChange } from './locale';

onBeforeLocaleChange(applyContentLocale);

export { t, tn } from './t';
export { useLocaleStore, type Locale } from './locale';
