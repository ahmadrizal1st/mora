import { Icon } from '../ui/Icon'
import { useTheme } from '../../context/ThemeContext'

export function NavbarSideTheme() {
    const { config, toggleDarkMode } = useTheme()

    return (
        <div className="nav-item">
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
