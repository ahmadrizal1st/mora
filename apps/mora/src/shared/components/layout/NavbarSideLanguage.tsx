import { DropdownMenu } from '../ui/DropdownMenu'
import languages from '../../data/languages.json'

export function NavbarSideLanguage() {
    return (
        <div className="nav-item dropdown d-none d-md-flex me-3">
            {/* Trigger dihandle Bootstrap JS via data-bs-toggle */}
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

            {/* triggerless = true → hanya render div.dropdown-menu, tanpa button internal,
                tanpa React toggle state. Bootstrap JS yang handle open/close sepenuhnya. */}
            <DropdownMenu right arrow flag flagData={languages} triggerless />
        </div>
    )
}