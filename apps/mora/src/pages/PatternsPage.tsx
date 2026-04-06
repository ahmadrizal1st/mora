// src/pages/PatternsPage.tsx
import DefaultLayout from '../layouts/DefaultLayout'

const patterns = [
  'bg-pattern-diagonal',
  'bg-pattern-diagonal-2',
  'bg-pattern-dots',
  'bg-pattern-rectangles',
  'bg-pattern-lines',
  'bg-pattern-lines-vertical',
  'bg-pattern-grid',
  'bg-pattern-grid-diagonal',
  'bg-pattern-blueprint',
  'bg-pattern-circles',
  'bg-pattern-diagonal-stripes',
  'bg-pattern-diagonal-stripes-2',
  'bg-pattern-zigzag',
  'bg-pattern-vertical-stripes',
  'bg-pattern-horizontal-stripes',
]

const colors = [
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
  'gray',
]

const patternSizes = ['sm', 'md', 'lg', 'xl']

export default function PatternsPage() {
  return (
    <DefaultLayout pageTitle="Patterns">
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Pattern types</h3>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-6 g-3">
                {patterns.map((pattern) => (
                  <div key={pattern} className="col">
                    <div className={`${pattern} rounded mb-3`} style={{ height: '8rem' }}></div>
                    <code>.{pattern}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Pattern colors</h3>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-6 g-3">
                {colors.map((color) => (
                  <div key={color} className="col">
                    <div
                      className={`bg-pattern-rectangles bg-pattern-${color} rounded mb-3`}
                      style={{ height: '8rem' }}
                    ></div>
                    <code>.bg-pattern-{color}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Pattern sizes</h3>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-6 g-3">
                {patternSizes.map((size) => (
                  <div key={size} className="col">
                    <div
                      className={`bg-pattern-diagonal bg-pattern-${size} rounded mb-3`}
                      style={{ height: '8rem' }}
                    ></div>
                    <code>.bg-pattern-{size}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}
