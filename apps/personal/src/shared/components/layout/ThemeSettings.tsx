import { useTheme, type ThemeConfig } from '@/shared/context/ThemeContext'
import { Icon } from '../ui/Icon'

const COLORS = [
  'blue',
  'azure',
  'indigo',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'teal',
  'cyan',
]

const FONTS = ['sans-serif', 'serif', 'monospace', 'comic']

const BASES = ['slate', 'gray', 'zinc', 'neutral', 'stone']

const RADIUSES = ['0', '0.5', '1', '1.5', '2']

export function ThemeSettings() {
  const { config, setThemeValue, resetTheme, settingsOpen, openSettings, closeSettings } =
    useTheme()

  const handleChange = (key: keyof ThemeConfig, value: string) => {
    setThemeValue(key, value)
  }

  return (
    <>
      <div className="settings d-none d-lg-block">
        <a
          href="#"
          className="btn btn-floating btn-icon btn-primary"
          onClick={(e) => {
            e.preventDefault()
            openSettings()
          }}
          aria-label="Theme Settings"
        >
          <Icon icon="brush" />
        </a>
      </div>

      {settingsOpen && <div className="offcanvas-backdrop fade show" onClick={closeSettings} />}

      <div
        className={`offcanvas offcanvas-start offcanvas-narrow${settingsOpen ? ' show' : ''}`}
        tabIndex={-1}
        id="offcanvas-settings"
        role="dialog"
        aria-modal="true"
        aria-labelledby="offcanvas-settings-title"
        style={settingsOpen ? { visibility: 'visible' as const } : {}}
      >
        <div className="offcanvas-header">
          <h2 className="offcanvas-title" id="offcanvas-settings-title">
            Theme Settings
          </h2>
          <button type="button" className="btn-close" aria-label="Close" onClick={closeSettings} />
        </div>
        <div className="offcanvas-body d-flex flex-column">
          <div>
            <div className="mb-4">
              <label className="form-label">Color mode</label>
              <p className="form-hint">Choose the color mode for your app.</p>
              {['light', 'dark'].map((mode) => (
                <label className="form-check" key={mode}>
                  <div className="form-selectgroup-item">
                    <input
                      type="radio"
                      name="theme"
                      value={mode}
                      className="form-check-input"
                      checked={config.theme === mode}
                      onChange={() => handleChange('theme', mode)}
                    />
                    <div className="form-check-label">
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mb-4">
              <label className="form-label">Color scheme</label>
              <p className="form-hint">The perfect color mode for your app.</p>
              <div className="row g-2">
                {COLORS.map((color) => (
                  <div className="col-auto" key={color}>
                    <label className="form-colorinput">
                      <input
                        name="theme-primary"
                        type="radio"
                        value={color}
                        className="form-colorinput-input"
                        checked={config['theme-primary'] === color}
                        onChange={() => handleChange('theme-primary', color)}
                      />
                      <span className={`form-colorinput-color bg-${color}`} />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Font family</label>
              <p className="form-hint">Choose the font family that fits your app.</p>
              {FONTS.map((font) => (
                <label className="form-check" key={font}>
                  <div className="form-selectgroup-item">
                    <input
                      type="radio"
                      name="theme-font"
                      value={font}
                      className="form-check-input"
                      checked={config['theme-font'] === font}
                      onChange={() => handleChange('theme-font', font)}
                    />
                    <div className="form-check-label">
                      {font.charAt(0).toUpperCase() + font.slice(1)}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mb-4">
              <label className="form-label">Theme base</label>
              <p className="form-hint">Choose the gray shade for your app.</p>
              {BASES.map((base) => (
                <label className="form-check" key={base}>
                  <div className="form-selectgroup-item">
                    <input
                      type="radio"
                      name="theme-base"
                      value={base}
                      className="form-check-input"
                      checked={config['theme-base'] === base}
                      onChange={() => handleChange('theme-base', base)}
                    />
                    <div className="form-check-label">
                      {base.charAt(0).toUpperCase() + base.slice(1)}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mb-4">
              <label className="form-label">Corner Radius</label>
              <p className="form-hint">Choose the border radius factor for your app.</p>
              {RADIUSES.map((radius) => (
                <label className="form-check" key={radius}>
                  <div className="form-selectgroup-item">
                    <input
                      type="radio"
                      name="theme-radius"
                      value={radius}
                      className="form-check-input"
                      checked={config['theme-radius'] === radius}
                      onChange={() => handleChange('theme-radius', radius)}
                    />
                    <div className="form-check-label">{radius}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y">
            <button
              type="button"
              className="btn w-100"
              onClick={() => {
                resetTheme()
              }}
            >
              <Icon icon="rotate" />
              Reset changes
            </button>
            <button type="button" className="btn btn-primary w-100" onClick={closeSettings}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
