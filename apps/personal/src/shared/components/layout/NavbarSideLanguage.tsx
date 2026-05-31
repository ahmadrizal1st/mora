import { clsx } from 'clsx'
import { DropdownMenu } from '../ui/DropdownMenu'
import languages from '../../data/languages.json'

interface NavbarSideLanguageProps {
  className?: string
}

export function NavbarSideLanguage({ className }: NavbarSideLanguageProps) {
  return (
    <div className={clsx('nav-item dropdown', className)}>
      <a
        href="#"
        className="nav-link px-0"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        tabIndex={-1}
        aria-label="Select language"
      >
        <span className="flag flag-xs flag-country-gb" />
      </a>

      <DropdownMenu right arrow flag flagData={languages} triggerless />
    </div>
  )
}
