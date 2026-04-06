// src/pages/PageLoader.tsx
import SingleLayout from '../layouts/SingleLayout'
import { Progress } from '../components/ui/Progress'

export default function PageLoader() {
  return (
    <SingleLayout containerSize="slim" hideLogo>
      <div className="text-center">
        <div className="mb-3">
          <a href="/" className="navbar-brand navbar-brand-autodark">
            <img src="/static/logo-small.svg" height="36" alt="" />
          </a>
        </div>
        <div className="text-secondary mb-3">Preparing application</div>
        <Progress indeterminate size="sm" />
      </div>
    </SingleLayout>
  )
}
