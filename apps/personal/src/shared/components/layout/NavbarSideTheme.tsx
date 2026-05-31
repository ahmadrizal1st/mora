import { clsx } from 'clsx'
import { Icon } from '../ui/Icon'
import { useTheme } from '@/shared/context/ThemeContext'

interface NavbarSideThemeProps {
  className?: string
}

export function NavbarSideTheme({ className }: NavbarSideThemeProps) {
  const { config, toggleDarkMode } = useTheme()

  return (
    <div className={clsx('nav-item', className)}>
      {config.theme === 'light' ? (
        <a
          href="#"
          className="nav-link px-0"
          title="Enable dark mode"
          onClick={(e) => {
            e.preventDefault()
            toggleDarkMode()
          }}
        >
          <Icon icon="moon" />
        </a>
      ) : (
        <a
          href="#"
          className="nav-link px-0"
          title="Enable light mode"
          onClick={(e) => {
            e.preventDefault()
            toggleDarkMode()
          }}
        >
          <Icon icon="sun" />
        </a>
      )}
    </div>
  )
}
