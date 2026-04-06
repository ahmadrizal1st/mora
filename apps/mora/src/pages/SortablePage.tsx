// src/pages/SortablePage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Sortable } from '../components/ui'

export default function SortablePage() {
  return (
    <BaseLayout pageTitle="SortableJS">
      <div className="row row-cards">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Basic usage</h3>
            </div>
            <div className="card-body">
              <Sortable tag="ul" className="list-group" options={{ animation: 150 }}>
                <li className="list-group-item">Element A</li>
                <li className="list-group-item">Element B</li>
                <li className="list-group-item">Element C</li>
                <li className="list-group-item">Element D</li>
              </Sortable>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Two lists with movement</h3>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-sm-6">
                  <Sortable
                    tag="ul"
                    className="list-group"
                    options={{ group: 'shared', animation: 150 }}
                  >
                    <li className="list-group-item">Item 1</li>
                    <li className="list-group-item">Item 2</li>
                    <li className="list-group-item">Item 3</li>
                  </Sortable>
                </div>
                <div className="col-sm-6">
                  <Sortable
                    tag="ul"
                    className="list-group"
                    options={{ group: 'shared', animation: 150 }}
                  >
                    <li className="list-group-item">Item A</li>
                    <li className="list-group-item">Item B</li>
                    <li className="list-group-item">Item C</li>
                  </Sortable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
