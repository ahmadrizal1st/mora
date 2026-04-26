const fs = require('fs');
const content = `
import { createFileRoute } from '@tanstack/react-router'
import Page from '@/features/__DIR__/pages/__COMP__'

export const Route = createFileRoute('/__ROUTE__')({
  component: Page,
})
`;

const routes = [
  { path: 'sign-in', dir: 'auth', comp: 'SignIn' },
  { path: 'sign-up', dir: 'auth', comp: 'SignUp' },
  { path: 'forgot-password', dir: 'auth', comp: 'ForgotPassword' },
  { path: 'dashboard', dir: 'dashboard', comp: 'Dashboard' },
  { path: 'dashboard-crypto', dir: 'dashboard', comp: 'DashboardCrypto' },
  { path: 'tracker', dir: 'tracker', comp: 'TrackerPage' },
];

routes.forEach(r => {
  let fileContent = content
    .replace('__DIR__', r.dir)
    .replace('__COMP__', r.comp)
    .replace('/__ROUTE__', r.path === 'tracker' ? '/tracker' : `/${r.path}`);
  fs.writeFileSync(`routes/${r.path}.tsx`, fileContent);
});

// Create index
fs.writeFileSync('routes/index.tsx', `
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' })
  }
})
`);

// Create scanner page explicitly
fs.writeFileSync('routes/tracker.photo.tsx', `
import { createFileRoute } from '@tanstack/react-router'
import ScannerPage from '@/features/scanner/pages/ScannerPage'

export const Route = createFileRoute('/tracker/photo')({
  component: ScannerPage,
})
`);

// Create input explicitly 
fs.writeFileSync('routes/tracker.input.tsx', `
import { createFileRoute } from '@tanstack/react-router'
import TrackerInputPage from '@/features/tracker/pages/TrackerInputPage'

export const Route = createFileRoute('/tracker/input')({
  component: TrackerInputPage,
})
`);

console.log("Routes generated!");
