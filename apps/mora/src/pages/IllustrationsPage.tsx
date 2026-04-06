// src/pages/IllustrationsPage.tsx
import { useState, useMemo } from 'react'
import BaseLayout from '../layouts/BaseLayout'
import { Icon } from '../components/ui/Icon'
import freeIllustrations from '../data/free-illustrations.json'
import illustrationsList from '../data/illustrations.json'

const COLORS = [
  { value: 'var(--tblr-color-primary)', className: 'bg-primary', label: 'Primary' },
  { value: 'var(--tblr-bg-surface-inverted)', className: 'bg-inverted', label: 'Inverted' },
  { value: '#066fd1', className: 'bg-blue', label: 'Blue' },
  { value: '#4299e1', className: 'bg-azure', label: 'Azure' },
  { value: '#4263eb', className: 'bg-indigo', label: 'Indigo' },
  { value: '#ae3ec9', className: 'bg-purple', label: 'Purple' },
  { value: '#d6336c', className: 'bg-pink', label: 'Pink' },
  { value: '#d63939', className: 'bg-red', label: 'Red' },
  { value: '#f76707', className: 'bg-orange', label: 'Orange' },
  { value: '#f59f00', className: 'bg-yellow', label: 'Yellow' },
  { value: '#74b816', className: 'bg-lime', label: 'Lime' },
  { value: '#2fb344', className: 'bg-green', label: 'Green' },
  { value: '#0ca678', className: 'bg-teal', label: 'Teal' },
  { value: '#17a2b8', className: 'bg-cyan', label: 'Cyan' },
]

const SKIN_COLORS = [
  { hex: '#FFCB9D', label: 'Rose' },
  { hex: '#F0BA60', label: 'Yellow' },
  { hex: '#e2c6a7', label: 'Skin 1' },
  { hex: '#c7a786', label: 'Skin 2' },
  { hex: '#a68063', label: 'Skin 3' },
  { hex: '#926241', label: 'Skin 4' },
  { hex: '#654c45', label: 'Skin 5' },
  { hex: '#d5d7dd', label: 'Gray' },
]

type FreeIllustrationsData = {
  autodark: Record<string, string>
}

const autodarkIllustrations = (freeIllustrations as FreeIllustrationsData).autodark
const illustrationKeys = Object.keys(autodarkIllustrations)

export default function IllustrationsPage() {
  const [selectedColor, setSelectedColor] = useState('var(--tblr-color-primary)')
  const [selectedSkin, setSelectedSkin] = useState('#FFCB9D')
  const [selectedIllustration, setSelectedIllustration] = useState(
    illustrationKeys[illustrationKeys.length - 1] || illustrationKeys[0]
  )

  const currentSvg = useMemo(() => {
    const raw = autodarkIllustrations[selectedIllustration] || ''
    return raw.replace(/<svg /, '<svg class="w-100 h-auto" ')
  }, [selectedIllustration])

  const thumbnailSvgs = useMemo(() => {
    const result: Record<string, string> = {}
    for (const key of illustrationKeys) {
      result[key] = (autodarkIllustrations[key] || '').replace(/<svg /, '<svg class="w-100 h-auto" ')
    }
    return result
  }, [])

  return (
    <BaseLayout pageTitle="SVG Illustrations" pagePretitle="Addons">
      {/* Interactive SVG Customizer */}
      <div
        className="mb-7"
        style={{
          '--tblr-illustrations-primary': selectedColor,
          '--tblr-illustrations-skin': selectedSkin,
        } as React.CSSProperties}
      >
        <div className="row row-cards">
          <div className="col-12">
            <div className="row row-cards row-deck g-4">
              <div className="col-md-7">
                <div className="card">
                  <div className="card-body d-flex align-items-center">
                    <div
                      className="w-100"
                      dangerouslySetInnerHTML={{ __html: currentSvg }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        {/* Primary color picker */}
                        <div className="form-label">Primary color</div>
                        <div className="row g-2">
                          {COLORS.map((color) => (
                            <div className="col-auto" key={color.value}>
                              <label className="form-colorinput">
                                <input
                                  name="color"
                                  type="radio"
                                  value={color.value}
                                  className="form-colorinput-input"
                                  checked={selectedColor === color.value}
                                  onChange={() => setSelectedColor(color.value)}
                                />
                                <span className={`form-colorinput-color ${color.className}`} />
                              </label>
                            </div>
                          ))}
                        </div>

                        {/* Skin color picker */}
                        <div className="form-label mt-4">Skin color</div>
                        <div className="row g-2">
                          {SKIN_COLORS.map((skin) => (
                            <div className="col-auto" key={skin.hex}>
                              <label className="form-colorinput">
                                <input
                                  name="skin-color"
                                  type="radio"
                                  value={skin.hex}
                                  className="form-colorinput-input"
                                  checked={selectedSkin === skin.hex}
                                  onChange={() => setSelectedSkin(skin.hex)}
                                />
                                <span
                                  className="form-colorinput-color"
                                  style={{ backgroundColor: skin.hex }}
                                />
                              </label>
                            </div>
                          ))}
                        </div>

                        {/* Illustration selector */}
                        <div className="form-label mt-4">Select SVG illustration</div>
                        <div className="row">
                          {illustrationKeys.map((key) => (
                            <div className="col-3" key={key}>
                              <label className="form-imagecheck mb-2">
                                <input
                                  name="form-imagecheck"
                                  type="radio"
                                  value={key}
                                  className="form-imagecheck-input"
                                  checked={selectedIllustration === key}
                                  onChange={() => setSelectedIllustration(key)}
                                />
                                <span className="form-imagecheck-figure">
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: thumbnailSvgs[key],
                                    }}
                                  />
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Illustrations Section */}
      <h2 className="page-title my-5">
        {(illustrationsList as string[]).length - 4} more SVG Illustrations
      </h2>

      <div className="row row-cards">
        <div className="col-lg-4">
          <div className="card card-md sticky-top">
            <div className="card-stamp card-stamp-lg">
              <div className="card-stamp-icon bg-primary">
                <Icon icon="brand-figma" />
              </div>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-10">
                  <h3 className="h1">Tabler Illustrations</h3>
                  <div className="prose text-secondary">
                    Access a wide range of SVG illustrations for various projects. Effortlessly
                    customize any illustration to align perfectly with your chosen color scheme!
                  </div>
                  <div className="mt-3">
                    <a
                      href="https://r.tabler.io/buy-illustrations"
                      className="btn btn-primary"
                      target="_blank"
                      rel="noopener"
                    >
                      <Icon icon="download" />
                      Get lifetime access
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="row row-cards">
            {(illustrationsList as string[]).map((name) => (
              <div className="col-6 col-md-3" key={name}>
                <div className="card">
                  <div className="card-body">
                    <a
                      href="https://r.tabler.io/buy-illustrations"
                      target="_blank"
                      rel="noopener"
                    >
                      <img
                        src={`/static/illustrations/light/${name}.png`}
                        alt={name}
                        className="img-light"
                        loading="lazy"
                      />
                      <img
                        src={`/static/illustrations/dark/${name}.png`}
                        alt={name}
                        className="img-dark"
                        loading="lazy"
                      />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
