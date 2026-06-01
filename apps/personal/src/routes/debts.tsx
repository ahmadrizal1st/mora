import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/debts')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: '/debts' },
      })
    }
  },
  component: () => (
    <div className="debts-layout">
      <Outlet />
    </div>
  ),
})
