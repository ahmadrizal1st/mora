import { Icon } from '../ui/Icon'
import { NavbarApps } from '../cards/NavbarApps'

export function NavbarSideApps() {
    return (
        <div className="nav-item dropdown d-none d-md-flex me-3">
            <a
                href="#"
                className="nav-link px-0"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                tabIndex={-1}
                aria-label="Show app menu"
            >
                <Icon icon="apps" />
            </a>
            <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
                <NavbarApps />
            </div>
        </div>
    )
}
