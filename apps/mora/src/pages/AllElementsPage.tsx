// src/pages/AllElementsPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Icon } from '../components/ui/Icon'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { Progress } from '../components/ui/Progress'
import { Accordion } from '../components/ui/Accordion'
import { Spinner } from '../components/ui/Spinner'
import { Rating } from '../components/ui/Rating'
import { Steps } from '../components/ui/Steps'
import { StatusDot } from '../components/ui/StatusDot'
import { Toast } from '../components/ui/Toast'
import { InputIcon } from '../components/ui/InputIcon'
import { Range } from '../components/ui/Range'
import { Tag } from '../components/ui/Tag'
import { Ribbon } from '../components/ui/Ribbon'
import { Flag } from '../components/ui/Flag'
import { Payment } from '../components/ui/Payment'
import { Timeline, TimelineItem } from '../components/ui/Timeline'
import { Empty } from '../components/ui/Empty'
import { Nav } from '../components/ui/Nav'
import { NavSegmented } from '../components/ui/NavSegmented'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Pagination } from '../components/ui/Pagination'
import { Dropdown } from '../components/ui/Dropdown'
import { FormCheck } from '../components/ui/FormCheck'
import { Select } from '../components/ui/Select'
import { Modal, ModalHeader, ModalFooter } from '../components/ui/Modal'

export default function AllElementsPage() {
  return (
    <BaseLayout pageTitle="All Elements" pagePretitle="Kitchen Sink">
      <div className="row row-cards">
        {/* Typography Section */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Typography</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h1>Heading 1</h1>
                  <h2>Heading 2</h2>
                  <h3>Heading 3</h3>
                  <h4>Heading 4</h4>
                  <h5>Heading 5</h5>
                  <h6>Heading 6</h6>
                </div>
                <div className="col-md-6">
                  <p className="lead">This is a lead paragraph with larger text.</p>
                  <p>
                    This is a regular paragraph with <strong>bold text</strong>, <em>italic text</em>, and{' '}
                    <u>underlined text</u>.
                  </p>
                  <p><small className="text-muted">This is small muted text.</small></p>
                  <p className="text-primary">Primary text color</p>
                  <p className="text-success">Success text color</p>
                  <p className="text-danger">Danger text color</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Buttons</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h4>Standard Buttons</h4>
                  <div className="btn-list mb-3">
                    <Button text="Default" />
                    <Button text="Primary" color="primary" icon="star" />
                    <Button text="Secondary" color="secondary" />
                    <Button text="Success" color="success" icon="check" />
                    <Button text="Warning" color="warning" />
                    <Button text="Danger" color="danger" icon="x" />
                    <Button text="Info" color="info" />
                  </div>
                </div>
                <div className="col-md-6">
                  <h4>Button Sizes</h4>
                  <div className="btn-list mb-3 align-items-start">
                    <Button text="Small" size="sm" />
                    <Button text="Default" />
                    <Button text="Large" size="lg" />
                  </div>

                  <h4>Icon Buttons</h4>
                  <div className="btn-list mb-3 align-items-start">
                    <Button icon="heart" iconOnly />
                    <Button icon="star" iconOnly />
                    <Button icon="check" iconOnly />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Simple Card</h3>
            </div>
            <div className="card-body">
              <p>This is a simple card with header and body content.</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Card with Footer</h3>
            </div>
            <div className="card-body">
              <p>This card includes a footer section.</p>
            </div>
            <div className="card-footer">
              <div className="d-flex">
                <a className="btn btn-link" href="#">Cancel</a>
                <a className="btn btn-primary ms-auto" href="#">Save</a>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Alerts</h3>
            </div>
            <div className="card-body">
              <Alert type="info" title="This is a primary alert with an icon." />
              <Alert type="success" title="This is a success alert message." />
              <Alert type="warning" title="This is a warning alert message." />
              <Alert type="danger" title="This is a danger alert message." />
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Badges</h3>
            </div>
            <div className="card-body">
              <div className="space-y">
                <div>
                  <Badge text="Default" />
                  {' '}
                  <Badge text="Primary" color="primary" />
                  {' '}
                  <Badge text="Secondary" color="secondary" />
                  {' '}
                  <Badge text="Success" color="success" />
                  {' '}
                  <Badge text="Warning" color="warning" />
                  {' '}
                  <Badge text="Danger" color="danger" />
                </div>
                <div>
                  <Badge text="With Icon" color="primary" icon="star" />
                  {' '}
                  <Badge text="Light Badge" color="primary" light />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bars Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Progress Bars</h3>
            </div>
            <div className="card-body">
              <div className="space-y">
                <div>
                  <Progress value={25} />
                </div>
                <div>
                  <Progress value={50} color="success" />
                </div>
                <div>
                  <Progress value={75} color="warning" />
                </div>
                <div>
                  <Progress value={90} color="danger" showValue />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Elements Section */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Form Elements</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Text Input</label>
                    <input type="text" className="form-control" placeholder="Enter text" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Input</label>
                    <input type="email" className="form-control" placeholder="Enter email" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password Input</label>
                    <input type="password" className="form-control" placeholder="Enter password" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Select Dropdown</label>
                    <Select id="demo-select" values={['Option 1', 'Option 2', 'Option 3']} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Textarea</label>
                    <textarea className="form-control" rows={3} placeholder="Enter message"></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Checkboxes</label>
                    <FormCheck title="Option 1" type="checkbox" />
                    <FormCheck title="Option 2" type="checkbox" checked />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Radio Buttons</label>
                    <FormCheck title="Option 1" type="radio" name="radio-demo" />
                    <FormCheck title="Option 2" type="radio" name="radio-demo" checked />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Switch</label>
                    <FormCheck title="Enable notifications" type="switch" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Elements */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Navigation Elements</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h4>Tabs</h4>
                  <div className="mb-3">
                    <Nav tabs className="mb-4" />
                  </div>

                  <h4>Pills Navigation</h4>
                  <div className="mb-3">
                    <Nav pills className="mb-4" />
                  </div>

                  <h4>Breadcrumb</h4>
                  <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Library', href: '#' }, { label: 'Data' }]} homeIcon />
                </div>
                <div className="col-md-6">
                  <h4>Pagination</h4>
                  <Pagination count={5} activeItem={2} className="mb-4" />

                  <h4>Pagination with Text</h4>
                  <Pagination count={3} text />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Lists</h3>
            </div>
            <div className="card-body">
              <h4>Unordered List</h4>
              <ul>
                <li>First item</li>
                <li>Second item</li>
                <li>Third item</li>
              </ul>

              <h4>Ordered List</h4>
              <ol>
                <li>First item</li>
                <li>Second item</li>
                <li>Third item</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Table</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-vcenter">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Doe</td>
                      <td>john@example.com</td>
                      <td><Badge text="Active" color="success" /></td>
                    </tr>
                    <tr>
                      <td>Jane Smith</td>
                      <td>jane@example.com</td>
                      <td><Badge text="Pending" color="warning" /></td>
                    </tr>
                    <tr>
                      <td>Bob Johnson</td>
                      <td>bob@example.com</td>
                      <td><Badge text="Inactive" color="danger" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Avatars Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Avatars</h3>
            </div>
            <div className="card-body">
              <div className="space-y">
                <div>
                  <Avatar placeholder="JD" size="sm" />{' '}
                  <Avatar placeholder="JS" />{' '}
                  <Avatar placeholder="BJ" size="lg" />{' '}
                  <Avatar placeholder="AB" size="xl" />
                </div>
                <div>
                  <Avatar placeholder="RD" shape="avatar-rounded" />{' '}
                  <Avatar placeholder="PR" color="primary" shape="avatar-rounded" />{' '}
                  <Avatar placeholder="SC" color="success" shape="avatar-rounded" />
                </div>
                <div>
                  <Avatar icon="user" />{' '}
                  <Avatar icon="star" color="warning" />{' '}
                  <Avatar placeholder="ST" status="success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Icons Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Icons</h3>
            </div>
            <div className="card-body">
              <div className="space-y">
                <div>
                  {['home', 'user', 'settings', 'heart', 'star', 'bell', 'mail', 'phone', 'calendar', 'clock', 'map-pin', 'camera', 'plus', 'minus', 'edit', 'trash', 'download', 'upload', 'search', 'filter', 'refresh', 'share', 'copy', 'external-link'].map((icon) => (
                    <Icon key={icon} icon={icon} className="me-2 mb-2" />
                  ))}
                </div>
                <div>
                  <span className="text-primary"><Icon icon="check" /></span>{' '}
                  <span className="text-success"><Icon icon="circle-check" /></span>{' '}
                  <span className="text-warning"><Icon icon="alert-triangle" /></span>{' '}
                  <span className="text-danger"><Icon icon="alert-circle" /></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dropdowns Section */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Dropdowns</h3>
            </div>
            <div className="card-body">
              <div className="btn-list">
                <Dropdown mainBtn="Primary Dropdown" options={['Action', 'Another action', 'Something else here']} />
                <Dropdown mainBtn="Secondary Dropdown" options={['Edit', 'Copy', 'Delete']} />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Elements Section */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Interactive Elements</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h4>Accordion</h4>
                  <div className="mb-4">
                    <Accordion count={3} id="demo-accordion" />
                  </div>
                </div>
                <div className="col-md-6">
                  <h4>Spinners</h4>
                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-2">
                      <Spinner type="border" color="primary" />
                      <Spinner type="border" color="success" size="sm" />
                      <Spinner type="grow" color="warning" />
                      <Spinner type="grow" color="danger" size="sm" />
                    </div>
                  </div>

                  <h4>Rating</h4>
                  <div className="mb-3">
                    <Rating id="demo-rating" value={4} />
                  </div>

                  <h4>Steps</h4>
                  <div className="mb-3">
                    <Steps count={4} active={2} />
                  </div>
                  <div className="mb-3">
                    <Steps count={4} active={3} numbers />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Feedback Elements */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Status Elements</h3>
            </div>
            <div className="card-body">
              <h4>Status Dots</h4>
              <div className="mb-3 d-flex gap-2">
                <StatusDot color="success" />
                <StatusDot color="warning" />
                <StatusDot color="danger" />
                <StatusDot color="info" animated />
              </div>

              <h4>Toast Notifications</h4>
              <div className="mb-3">
                <Toast id="demo-toast" show text="This is a sample toast message!" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Form Elements */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Enhanced Forms</h3>
            </div>
            <div className="card-body">
              <h4>Input with Icons</h4>
              <div className="mb-3">
                <InputIcon placeholder="Search..." icon="search" />
              </div>
              <div className="mb-3">
                <InputIcon placeholder="Loading..." loader />
              </div>

              <h4>Input Groups</h4>
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">@</span>
                  <input type="text" className="form-control" placeholder="Username" />
                </div>
              </div>
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input type="text" className="form-control" placeholder="Price" />
                  <span className="input-group-text">.00</span>
                </div>
              </div>

              <h4>Range Slider</h4>
              <div className="mb-3">
                <Range id="demo-range" />
              </div>
            </div>
          </div>
        </div>

        {/* Tags & Labels */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tags & Labels</h3>
            </div>
            <div className="card-body">
              <h4>Tags</h4>
              <div className="mb-3">
                <Tag text="Primary Tag" icon="star" />{' '}
                <Tag text="Success Tag" status="success" />{' '}
                <Tag text="Warning Tag" status="warning" />
              </div>

              <h4>Ribbons</h4>
              <div className="position-relative mb-4" style={{ height: 100, background: 'var(--tblr-bg-surface-secondary)', borderRadius: 8 }}>
                <Ribbon text="New" color="success" />
              </div>
              <div className="position-relative mb-3" style={{ height: 100, background: 'var(--tblr-bg-surface-secondary)', borderRadius: 8 }}>
                <Ribbon text="Sale" color="danger" top />
              </div>
            </div>
          </div>
        </div>

        {/* Media Elements */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Media Elements</h3>
            </div>
            <div className="card-body">
              <h4>Flags</h4>
              <div className="mb-3">
                <div className="d-flex flex-wrap gap-2">
                  {['us', 'gb', 'de', 'fr', 'pl', 'es', 'it', 'nl', 'ca', 'au'].map((flag) => (
                    <Flag key={flag} flag={flag} />
                  ))}
                </div>
              </div>

              <h4>Payment Icons</h4>
              <div className="mb-3">
                <div className="d-flex flex-wrap gap-2">
                  {['visa', 'mastercard', 'paypal', 'americanexpress', 'applepay', 'google-pay', 'stripe', 'discover', 'jcb', 'maestro', 'dinersclub', 'bitcoin', 'ethereum', 'klarna', 'venmo', 'square'].map((p) => (
                    <Payment key={p} payment={p} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Timeline</h3>
            </div>
            <div className="card-body">
              <Timeline>
                <TimelineItem time="10 hrs ago" title="+1150 Followers" description="You’re getting more and more followers, keep it up!" icon="brand-x" />
                <TimelineItem time="2 hrs ago" title="+3 New Products were added!" description="Congratulations!" icon="briefcase" />
                <TimelineItem time="1 day ago" title="Database backup completed!" description="Download the latest backup." icon="check" />
                <TimelineItem time="1 day ago" title="+290 Page Likes" description="This is great, keep it up!" icon="brand-facebook" />
                <TimelineItem time="2 days ago" title="+3 Friend Requests" icon="user-plus">
                  <div className="avatar-list mt-3">
                    <Avatar src="/static/avatars/000f.jpg" status="success" />
                    <Avatar src="/static/avatars/001m.jpg" status="success" />
                    <Avatar src="/static/avatars/002f.jpg" status="success" />
                  </div>
                </TimelineItem>
                <TimelineItem time="3 days ago" title="+3 New photos" icon="photo">
                  <div className="mt-3">
                    <div className="row g-2">
                      <div className="col-4">
                        <div className="img-responsive img-responsive-21x9 rounded border" style={{ backgroundImage: 'url(/static/photos/beautiful-blonde-woman-relaxing-with-a-can-of-coke-on-a-tree-stump-by-the-beach.jpg)' }}></div>
                      </div>
                      <div className="col-4">
                        <div className="img-responsive img-responsive-21x9 rounded border" style={{ backgroundImage: 'url(/static/photos/a-visit-to-the-bookstore.jpg)' }}></div>
                      </div>
                      <div className="col-4">
                        <div className="img-responsive img-responsive-21x9 rounded border" style={{ backgroundImage: 'url(/static/photos/a-woman-works-at-a-desk-with-a-laptop-and-a-cup-of-coffee.jpg)' }}></div>
                      </div>
                    </div>
                  </div>
                </TimelineItem>
                <TimelineItem time="2 weeks ago" title="System updated to v2.02" description="Check the complete changelog at the activity page." icon="settings" />
              </Timeline>
            </div>
          </div>
        </div>

        {/* Empty State Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Empty State</h3>
            </div>
            <div className="card-body">
              <Empty
                title="No data found"
                subtitle="Try adjusting your search or filter to find what you're looking for."
                illustration="boy-girl"
                buttonText="Add new item"
                buttonIcon="plus"
              />
            </div>
          </div>
        </div>

        {/* Modal Section */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Modals</h3>
            </div>
            <div className="card-body">
              <div className="btn-list">
                <button className="btn" data-bs-toggle="modal" data-bs-target="#modal-demo">
                  Open Modal
                </button>
                <button className="btn" data-bs-toggle="modal" data-bs-target="#modal-success">
                  Success Modal
                </button>
              </div>

              {/* Demo Modal */}
              <Modal id="modal-demo">
                <ModalHeader title="Modal Title" />
                <div className="modal-body">
                  <p>This is a sample modal dialog. You can put any content here.</p>
                </div>
                <ModalFooter submitLabel="Save changes" />
              </Modal>

              {/* Success Modal */}
              <div className="modal modal-blur fade" id="modal-success" tabIndex={-1} role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-body text-center py-4">
                      <Icon icon="circle-check" className="icon icon-lg text-success mb-2" />
                      <h3>Success!</h3>
                      <div className="text-secondary">Your action was completed successfully.</div>
                    </div>
                    <div className="modal-footer">
                      <div className="w-100">
                        <div className="row">
                          <div className="col">
                            <button className="btn w-100" data-bs-dismiss="modal">Cancel</button>
                          </div>
                          <div className="col">
                            <button className="btn btn-success w-100" data-bs-dismiss="modal">OK</button>
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

        {/* Button Groups Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Button Groups</h3>
            </div>
            <div className="card-body">
              <h4>Basic Button Group</h4>
              <div className="btn-group mb-3" role="group">
                <button type="button" className="btn">Left</button>
                <button type="button" className="btn">Middle</button>
                <button type="button" className="btn">Right</button>
              </div>

              <h4>Button Toolbar</h4>
              <div className="btn-toolbar mb-3" role="toolbar">
                <div className="btn-group me-2" role="group">
                  <button type="button" className="btn">1</button>
                  <button type="button" className="btn">2</button>
                  <button type="button" className="btn">3</button>
                </div>
                <div className="btn-group" role="group">
                  <button type="button" className="btn">4</button>
                  <button type="button" className="btn">5</button>
                </div>
              </div>

              <h4>Vertical Button Group</h4>
              <div className="btn-group-vertical" role="group">
                <button type="button" className="btn">Top</button>
                <button type="button" className="btn">Middle</button>
                <button type="button" className="btn">Bottom</button>
              </div>
            </div>
          </div>
        </div>

        {/* Segmented Navigation Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Segmented Navigation</h3>
            </div>
            <div className="card-body">
              <h4>Basic Segmented</h4>
              <div className="mb-3">
                <NavSegmented items={['Home', 'Profile', 'Settings']} />
              </div>

              <h4>With Icons</h4>
              <div className="mb-3">
                <NavSegmented icons={['home', 'user', 'settings']} />
              </div>

              <h4>With Emojis</h4>
              <div className="mb-3">
                <NavSegmented items={['👦', '👦🏿', '👦🏾', '👦🏽', '👦🏼', '👦🏻']} />
              </div>

              <h4>With Icons and Text</h4>
              <div className="mb-3">
                <NavSegmented items={['Home', 'Profile', 'Settings']} icons={['home', 'user', 'settings']} />
              </div>
            </div>
          </div>
        </div>

        {/* Collapse Section */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Collapse</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h4>Basic Collapse</h4>
                  <button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample">
                    Toggle Collapse
                  </button>
                  <div className="collapse" id="collapseExample">
                    <div className="card card-body mt-2">
                      This is collapsed content that can be toggled. It's hidden by default and shown when the button is clicked.
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <h4>Multiple Targets</h4>
                  <div className="btn-list">
                    <button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample1">
                      Toggle First
                    </button>
                    <button className="btn" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample2">
                      Toggle Second
                    </button>
                  </div>
                  <div className="collapse mt-2" id="multiCollapseExample1">
                    <div className="card card-body mb-2">
                      First collapsible content.
                    </div>
                  </div>
                  <div className="collapse" id="multiCollapseExample2">
                    <div className="card card-body">
                      Second collapsible content.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tooltips & Popovers Section */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tooltips & Popovers</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h4>Tooltips</h4>
                  <div className="btn-list">
                    <button className="btn" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">Top</button>
                    <button className="btn" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on right">Right</button>
                    <button className="btn" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom">Bottom</button>
                    <button className="btn" data-bs-toggle="tooltip" data-bs-placement="left" title="Tooltip on left">Left</button>
                  </div>
                </div>
                <div className="col-md-6">
                  <h4>Popovers</h4>
                  <div className="btn-list">
                    <button className="btn" data-bs-toggle="popover" data-bs-placement="top" title="Popover Title" data-bs-content="This is popover content on top">
                      Top Popover
                    </button>
                    <button className="btn" data-bs-toggle="popover" data-bs-placement="right" title="Popover Title" data-bs-content="This is popover content on right">
                      Right Popover
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* List Groups Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">List Groups</h3>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <div className="list-group-item">
                  <Icon icon="home" className="me-2" />
                  Home
                </div>
                <div className="list-group-item active">
                  <Icon icon="star" className="me-2" />
                  Active item
                </div>
                <div className="list-group-item">
                  <Icon icon="settings" className="me-2" />
                  Settings
                </div>
                <div className="list-group-item">
                  <Icon icon="user" className="me-2" />
                  Profile
                </div>
                <div className="list-group-item disabled">
                  <Icon icon="lock" className="me-2" />
                  Disabled item
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Elements Section */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Content Elements</h3>
            </div>
            <div className="card-body">
              <h4>Blockquote</h4>
              <blockquote className="blockquote mb-4">
                <p>This is a blockquote example with some sample text to demonstrate the styling.</p>
                <footer className="blockquote-footer">
                  Someone famous in <cite title="Source Title">Source Title</cite>
                </footer>
              </blockquote>

              <h4>Code Block</h4>
              <pre className="mb-3"><code>{`// JavaScript example
function greetUser(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}`}</code></pre>

              <h4>Inline Elements</h4>
              <p>
                This paragraph contains <code>inline code</code>, <kbd>Ctrl + S</kbd> keyboard shortcut, and <mark>highlighted text</mark>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
