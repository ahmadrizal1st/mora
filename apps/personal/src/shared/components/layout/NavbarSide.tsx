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
  const classes = clsx('navbar-nav', 'flex-row', 'align-items-center', 'gap-1 gap-md-2', className)

  const responsiveClass = `d-none d-${breakpoint}-flex`

  return (
    <div className={classes}>


      {showNotifications && <NavbarSideNotifications />}

      {showTheme && <NavbarSideTheme className={responsiveClass} />}

      {showLanguage && <NavbarSideLanguage className={responsiveClass} />}

      {showUser && <NavbarSideUser personId={personId} hideUsername={hideUsername} dark={dark} />}
    </div>
  )
}
