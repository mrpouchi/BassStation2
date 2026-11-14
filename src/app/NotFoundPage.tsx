import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      actions={
        <ButtonLink to="/" variant="primary">
          Back to dashboard
        </ButtonLink>
      }
    >
      This address does not match any section of the Academy.
    </EmptyState>
  );
}
