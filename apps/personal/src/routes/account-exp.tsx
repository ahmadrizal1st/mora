import { createFileRoute } from '@tanstack/react-router';
import AccountExpPage from '@/features/account-exp/pages/AccountExpPage';

export const Route = createFileRoute('/account-exp')({
  component: AccountExpPage,
});
