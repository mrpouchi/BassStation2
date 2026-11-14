import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { t } from '@/i18n/t';

export function NotFoundPage() {
  return (
    <EmptyState
      title={t('Page not found')}
      actions={
        <ButtonLink to="/" variant="primary">
          {t('Back to dashboard')}
        </ButtonLink>
      }
    >
      {t('This address does not match any section of the Academy.')}
    </EmptyState>
  );
}
