// src/pages/TourPage.tsx
import { useState } from 'react';
import BaseLayout from '../layouts/BaseLayout';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { Icon } from '../components/ui/Icon';

export default function TourPage() {
  const [activeOption, setActiveOption] = useState('1');

  const startTour = () => {
    const driverObj = driver({
      allowClose: true,
      showProgress: true,
      steps: [
        {
          element: '#start-tour',
          popover: {
            title: 'Welcome to the Tour!',
            description: 'This button starts the interactive tour. Click it to begin exploring the page.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '#tour-card-1',
          popover: {
            title: 'Welcome Section',
            description: 'This is the first card in our tour. It demonstrates how Driver.js highlights elements on the page.',
            side: 'right',
            align: 'start'
          }
        },
        {
          element: '#tour-card-2',
          popover: {
            title: 'Features Section',
            description: 'This card shows additional features and demonstrates the tour\'s ability to navigate between different elements.',
            side: 'left',
            align: 'start'
          }
        },
        {
          element: '#tour-card-3',
          popover: {
            title: 'Data Table',
            description: 'This table shows how Driver.js works with larger elements. You can highlight entire sections of your page.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '#tour-card-4',
          popover: {
            title: 'Settings Card',
            description: 'This card demonstrates how the tour works with smaller, centered elements.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '#tour-card-5',
          popover: {
            title: 'Users Card',
            description: 'Another example card showing user management features.',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '#tour-card-6',
          popover: {
            title: 'Analytics Card',
            description: 'The final step of the tour. This card shows analytics features.',
            side: 'top',
            align: 'center'
          }
        }
      ]
    })

    driverObj.drive()
  }

  return (
    <BaseLayout pageTitle="Driver Tour">
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Product Tour Example</h3>
              <div className="card-actions">
                <button 
                  id="start-tour" 
                  className="btn btn-primary" 
                  onClick={startTour}
                >
                  Start Tour
                </button>
              </div>
            </div>
            <div className="card-body">
              <p className="text-secondary">
                Click the "Start Tour" button to begin an interactive tour of this page.
                The tour will guide you through different elements and features.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card" id="tour-card-1">
            <div className="card-header">
              <h3 className="card-title">Welcome Section</h3>
            </div>
            <div className="card-body">
              <p className="text-secondary mb-3">This is the first card in our tour. It demonstrates how Driver.js highlights elements on the page.</p>
              <div className="btn-list">
                <button className="btn btn-primary">Action Button</button>
                <button className="btn btn-white border-secondary-subtle px-3">Secondary</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card" id="tour-card-2">
            <div className="card-header">
              <h3 className="card-title">Features Section</h3>
            </div>
            <div className="card-body">
              <p className="text-secondary mb-3">This card shows additional features and demonstrates the tour's ability to navigate between different elements.</p>
              <div className="form-selectgroup">
                <label className="form-selectgroup-item">
                  <input
                    type="radio"
                    name="options"
                    value="1"
                    className="form-selectgroup-input"
                    checked={activeOption === '1'}
                    onChange={() => setActiveOption('1')}
                  />
                  <span className="form-selectgroup-label">Option 1</span>
                </label>
                <label className="form-selectgroup-item ms-2">
                  <input
                    type="radio"
                    name="options"
                    value="2"
                    className="form-selectgroup-input"
                    checked={activeOption === '2'}
                    onChange={() => setActiveOption('2')}
                  />
                  <span className="form-selectgroup-label">Option 2</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card" id="tour-card-3">
            <div className="card-header">
              <h3 className="card-title">Navigation Example</h3>
            </div>
            <div className="card-body">
              <p className="text-secondary mb-4">This is a full-width card that demonstrates how the tour works with larger elements.</p>
              <div className="table-responsive">
                <table className="table table-vcenter">
                  <thead>
                    <tr className="bg-body-tertiary">
                      <th className="text-secondary fs-6 text-uppercase fw-medium border-bottom-0">NAME</th>
                      <th className="text-secondary fs-6 text-uppercase fw-medium border-bottom-0">STATUS</th>
                      <th className="text-secondary fs-6 text-uppercase fw-medium border-bottom-0">ROLE</th>
                      <th className="w-1 border-bottom-0"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">John Doe</td>
                      <td className="py-2">
                        <span className="badge bg-success text-white px-2 py-1">
                          Active
                        </span>
                      </td>
                      <td className="text-secondary py-2">Developer</td>
                      <td className="text-end py-2">
                        <button className="btn btn-sm btn-white">
                          Edit
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2">Jane Smith</td>
                      <td className="py-2">
                        <span className="badge bg-warning text-white px-2 py-1">
                          Pending
                        </span>
                      </td>
                      <td className="text-secondary py-2">Designer</td>
                      <td className="text-end py-2">
                        <button className="btn btn-sm btn-white">
                          Edit
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card" id="tour-card-4">
            <div className="card-body text-center py-5">
              <div className="mb-3">
                <Icon icon="settings" size={48} className="text-secondary" />
              </div>
              <h3 className="card-title mb-2">Settings</h3>
              <p className="text-secondary small">Configure your application settings here.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card" id="tour-card-5">
            <div className="card-body text-center py-5">
              <div className="mb-3">
                <Icon icon="users" size={48} className="text-secondary" />
              </div>
              <h3 className="card-title mb-2">Users</h3>
              <p className="text-secondary small">Manage your team members and permissions.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card" id="tour-card-6">
            <div className="card-body text-center py-5">
              <div className="mb-3">
                <Icon icon="chart-bar" size={48} className="text-secondary" />
              </div>
              <h3 className="card-title mb-2">Analytics</h3>
              <p className="text-secondary small">View your application statistics and reports.</p>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
