// src/pages/ColorPickerPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { ColorPicker } from '../components/ui'
import colorsData from '../data/colors.json'

export default function ColorPickerPage() {
  const colors = [...colorsData.base, ...colorsData.social]

  return (
    <BaseLayout pageTitle="Color picker">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Basic</h3>
          <div className="row g-3">
            {colors.map((color, index) => (
              <div key={index} className="col-12 col-sm-4 col-md-3 col-lg-2">
                <ColorPicker
                  id={`colorpicker-${index}`}
                  value={color.value}
                  format="hex"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
