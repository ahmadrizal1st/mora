import { clsx } from 'clsx'
import { NavbarSideTheme } from './NavbarSideTheme'
import { NavbarSideNotifications } from './NavbarSideNotifications'
import { NavbarSideLanguage } from './NavbarSideLanguage'
import { NavbarSideUser } from './NavbarSideUser'

interface NavbarSideProps {
  breakpoint?: string
  personId?: number
  hideUsername?: boolean
  dark?: boolean
  showTheme?: boolean
  showNotifications?: boolean
  showLanguage?: boolean
  showUser?: boolean
  className?: string
}

export function NavbarSide({
  breakpoint = 'md',
  personId = 1,
  hideUsername,
  dark,
  showTheme = true,
  showNotifications = true,
  showLanguage = true,
  showUser = true,
  className,
}: NavbarSideProps) {
  const classes = clsx('navbar-nav', 'flex-row', className)

  const toolsClasses = clsx(
    `d-none d-${breakpoint}-flex`,
    'me-3'
  )

  return (
    <div className={classes}>
      {showNotifications && (
        <NavbarSideNotifications className="me-2 me-md-3" />
      )}

      {(showTheme || showLanguage) && (
        <div className={toolsClasses}>
          {showTheme && <NavbarSideTheme />}
          {showLanguage && <NavbarSideLanguage />}
        </div>
      )}

      {showUser && (
        <NavbarSideUser
          personId={personId}
          hideUsername={hideUsername}
          dark={dark}
        />
      )}
    </div>
  )
}
