// src/pages/FormElements.tsx
import BaseLayout from '../layouts/BaseLayout'
import {
  Button,
  Avatar,
  InputIcon,
  InputMask,
  Select,
  Progress,
  Range,
  Datepicker,
  FormCheck,
  Icon,
  ButtonGroup,
  AutosizeTextarea,
} from '../components/ui'
import peopleData from '../data/people.json'

const FormSection1 = () => {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">Static</label>
        <div className="form-control-plaintext">Input value</div>
      </div>
      <div className="mb-3">
        <label className="form-label">Text</label>
        <input type="text" className="form-control" name="example-text-input" placeholder="Input placeholder" />
        <small className="form-hint">Here's some more info.</small>
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input type="password" name="example-password-input" className="form-control" placeholder="Input placeholder" />
        <small className="form-hint">
          Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
        </small>
      </div>
      <div className="mb-3">
        <label className="form-label">Disabled</label>
        <input type="text" className="form-control" name="example-disabled-input" placeholder="Disabled..." defaultValue="Well, she turned me into a newt." disabled />
      </div>
      <div className="mb-3">
        <label className="form-label">Readonly</label>
        <input type="text" className="form-control" name="example-disabled-input" placeholder="Readonly..." defaultValue="Well, how'd you become king, then?" readOnly />
      </div>
      <div className="mb-3">
        <label className="form-label required">Required</label>
        <input type="text" className="form-control" name="example-required-input" placeholder="Required..." />
      </div>
      <div className="mb-3">
        <label className="form-label">Textarea <span className="form-label-description">56/100</span></label>
        <textarea className="form-control" name="example-textarea-input" rows={6} placeholder="Content.." defaultValue="Oh! Come and see the violence inherent in the system! Help, help, I'm being repressed! We shall say 'Ni' again to you, if you do not appease us. I'm not a witch. I'm not a witch. Camelot!" />
      </div>

      <div className="mb-3">
        <label className="form-label">Select</label>
        <select className="form-select">
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Select multiple</label>
        <select className="form-select" multiple>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>

      <div className="mb-3">
        <div className="form-label">Select multiple states</div>
        <Select 
          multiple 
          defaultValue={['Arizona', 'South Carolina', 'Wyoming']} 
          options={[
            'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
          ].map(s => ({ value: s, label: s }))} 
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Input group</label>
        <div className="input-group mb-2">
          <input type="text" className="form-control" placeholder="Search for…" />
          <button className="btn" type="button">Go!</button>
        </div>
        <div className="input-group">
          <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Action
          </button>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
          </div>
          <input type="text" className="form-control" aria-label="Text input with dropdown button" />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Input group buttons</label>
        <div className="input-group">
          <input type="text" className="form-control" />
          <button type="button" className="btn">Action</button>
          <button data-bs-toggle="dropdown" type="button" className="btn dropdown-toggle dropdown-toggle-split"></button>
          <div className="dropdown-menu dropdown-menu-end">
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Icon input</label>
        <div className="input-icon mb-3">
          <input type="text" className="form-control" placeholder="Search…" />
          <span className="input-icon-addon">
            <Icon icon="search" />
          </span>
        </div>
        <div className="input-icon mb-3">
          <span className="input-icon-addon">
            <Icon icon="user" />
          </span>
          <input type="text" className="form-control" placeholder="Username" />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Separated icon input</label>
        <div className="input-icon mb-3">
          <input type="text" className="form-control" placeholder="Search…" />
          <span className="input-icon-addon">
            <Icon icon="search" />
          </span>
        </div>
        <div className="input-icon">
          <span className="input-icon-addon">
            <Icon icon="user" />
          </span>
          <input type="text" className="form-control" placeholder="Username" />
          <span className="input-icon-addon">
            <Icon icon="search" />
          </span>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Input with help icon</label>
        <div className="row g-2">
          <div className="col">
            <input type="text" className="form-control" placeholder="Search for…" />
          </div>
          <div className="col-auto align-self-center">
            <span className="form-help" data-bs-toggle="popover" data-bs-placement="top"
              data-bs-content="&lt;p&gt;ZIP Code must be US or CDN format. You can use an extended ZIP+4 code to determine address more accurately.&lt;/p&gt;&lt;p class='mb-0'&gt;&lt;a href='#'&gt;USP ZIP codes lookup tools&lt;/a&gt;&lt;/p&gt;"
              data-bs-html="true">?</span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Loader input</label>
        <div className="mb-2">
          <div className="input-icon">
            <input type="text" className="form-control" placeholder="Loading…" />
            <span className="input-icon-addon">
              <div className="spinner-border spinner-border-sm text-secondary" role="status"></div>
            </span>
          </div>
        </div>
        <div>
          <div className="input-icon">
            <span className="input-icon-addon">
              <div className="spinner-border spinner-border-sm text-secondary" role="status"></div>
            </span>
            <input type="text" className="form-control" placeholder="Loading…" />
          </div>
        </div>
      </div>
    </>
  );
};
const FormSection2 = () => {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">Form control rounded</label>
        <input type="text" className="form-control form-control-rounded mb-2" name="Form control rounded" placeholder="Text.." />
        <div className="input-icon">
          <input type="text" className="form-control form-control-rounded" placeholder="Search…" />
          <span className="input-icon-addon">
            <Icon icon="search" />
          </span>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Form control flush</label>
        <input type="text" className="form-control form-control-flush" name="Form control flush" placeholder="Text.." />
      </div>

      <div className="mb-3">
        <label className="form-label">Input group</label>
        <div className="input-group mb-2">
          <span className="input-group-text">@</span>
          <input type="text" className="form-control" placeholder="username" autoComplete="off" />
        </div>
        <div className="input-group mb-2">
          <input type="text" className="form-control" placeholder="subdomain" autoComplete="off" />
          <span className="input-group-text">.tabler.io</span>
        </div>
        <div className="input-group">
          <span className="input-group-text">https://</span>
          <input type="text" className="form-control" placeholder="subdomain" autoComplete="off" />
          <span className="input-group-text">.tabler.io</span>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Input with checkbox or radios</label>
        <div className="input-group mb-2">
          <span className="input-group-text">
            <input className="form-check-input m-0" type="checkbox" />
          </span>
          <input type="text" className="form-control" autoComplete="off" />
        </div>
        <div className="input-group">
          <input type="text" className="form-control" autoComplete="off" />
          <span className="input-group-text">
            <input className="form-check-input m-0" type="radio" />
          </span>
        </div>
      </div>

      <div className="mb-3">
         <label className="form-label">Input with prepended text</label>
         <div className="input-group input-group-flat">
          <span className="input-group-text">https://tabler.io/users/</span>
          <input type="text" className="form-control ps-0" defaultValue="yourfancyusername" />
         </div>
      </div>

      <div className="mb-3">
         <label className="form-label">Input with appended text</label>
         <div className="input-group input-group-flat">
          <input type="text" className="form-control text-end pe-0" defaultValue="yourfancydomain" />
          <span className="input-group-text">.tabler.io</span>
         </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Input with appended link</label>
        <div className="input-group input-group-flat">
          <input type="password" title="password" className="form-control" defaultValue="ultrastrongpassword" />
          <span className="input-group-text">
            <a href="#" className="link-secondary" title="Show password" data-bs-toggle="tooltip">Show password</a>
          </span>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Input with appended kbd</label>
        <div className="input-group input-group-flat">
          <input type="text" className="form-control" />
          <span className="input-group-text">
            <kbd>ctrl + K</kbd>
          </span>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Input with appended icon links</label>
        <div className="input-group input-group-flat">
          <input type="text" className="form-control" />
          <span className="input-group-text">
            <a href="#" className="link-secondary ms-2" title="Clear search" data-bs-toggle="tooltip"><Icon icon="x" /></a>
            <a href="#" className="link-secondary ms-2" title="Search settings" data-bs-toggle="tooltip"><Icon icon="adjustments" /></a>
            <a href="#" className="link-secondary ms-2" title="Add notification" data-bs-toggle="tooltip"><Icon icon="bell" /></a>
          </span>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Floating inputs</label>
        <div className="form-floating mb-3">
          <input type="email" className="form-control" id="floating-input" defaultValue="name@example.com" autoComplete="off" />
          <label htmlFor="floating-input">Email address</label>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control" id="floating-password" defaultValue="Password" autoComplete="off" />
          <label htmlFor="floating-password">Password</label>
        </div>
        <div className="form-floating">
          <select className="form-select" id="floatingSelect" aria-label="Floating label select example">
            <option value="0">Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
          <label htmlFor="floatingSelect">Select</label>
        </div>
      </div>
    </>
  )
}

const FormSection3 = () => {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">Image Check</label>
        <div className="row g-2">
          {[
            'a-visit-to-the-bookstore.jpg',
            'a-woman-works-at-a-desk-with-a-laptop-and-a-cup-of-coffee.jpg',
            'a-woman-works-on-a-laptop-at-home-2.jpg',
            'a-woman-works-on-a-laptop-at-home-3.jpg',
            'beautiful-blonde-woman-on-a-wooden-pier-by-the-lake.jpg',
            'blue-sofa-with-pillows-in-a-designer-living-room-interior.jpg',
          ].map((filename, i) => (
            <div key={i} className="col-6 col-sm-4">
              <label className="form-imagecheck mb-2">
                <input name="form-imagecheck" type="checkbox" value={i} className="form-imagecheck-input" defaultChecked={i === 1} />
                <span className="form-imagecheck-figure">
                  <img src={`/static/photos/${filename}`} alt={filename} className="form-imagecheck-image w-100 h-100 object-cover" style={{ aspectRatio: '4/3' }} />
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Image Check Radio</label>
        <div className="row g-2">
          {[
            'brainstorming-session-with-creative-designers-2.jpg',
            'finances-us-dollars-and-bitcoins-currency-money.jpg',
            'home-office-desk-with-macbook-iphone-calendar-watch-and-organizer.jpg',
            'home-office-laptop-organizer-and-cup-of-coffee.jpg',
            'young-entrepreneur-working-from-a-modern-cafe-2.jpg',
            'young-woman-sitting-on-the-sofa-and-working-on-her-laptop-3.jpg',
          ].map((filename, i) => (
            <div key={i} className="col-6 col-sm-4">
              <label className="form-imagecheck mb-2">
                <input name="form-imagecheck-radio" type="radio" value={i} className="form-imagecheck-input" defaultChecked={i === 0} />
                <span className="form-imagecheck-figure">
                  <img src={`/static/photos/${filename}`} alt={`Photo ${i}`} className="form-imagecheck-image w-100 h-100 object-cover" style={{ aspectRatio: '4/3' }} />
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Color Input Check</label>
        <div className="row g-2">
          {['dark', 'white', 'blue', 'azure', 'indigo', 'purple', 'pink', 'red', 'orange', 'yellow', 'lime', 'green', 'teal', 'cyan'].map(color => (
            <div key={color} className="col-auto">
              <label className={`form-colorinput${color === 'white' ? ' form-colorinput-light' : ''}`}>
                <input name="color" type="checkbox" value={color} className="form-colorinput-input" defaultChecked />
                <span className={`form-colorinput-color bg-${color}`}></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Color Input Radio</label>
        <div className="row g-2">
          {['dark', 'white', 'blue', 'azure', 'indigo', 'purple', 'pink', 'red', 'orange', 'yellow', 'lime', 'green', 'teal', 'cyan'].map(color => (
            <div key={color} className="col-auto">
              <label className={`form-colorinput${color === 'white' ? ' form-colorinput-light' : ''}`}>
                <input name="color-rounded" type="radio" value={color} className="form-colorinput-input" defaultChecked={color === 'white'} />
                <span className={`form-colorinput-color rounded-circle bg-${color}`}></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Colorpicker</label>
        <input type="color" className="form-control form-control-color" defaultValue="#206bc4" title="Choose your color" />
      </div>

      <div className="mb-3">
        <label className="form-label">Validation States</label>
        <div className="mb-2">
           <input type="text" className="form-control is-valid" placeholder="Valid State.." />
        </div>
        <div>
           <input type="text" className="form-control is-invalid" placeholder="Invalid State.." />
           <div className="invalid-feedback">Invalid feedback</div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Validation States (lite)</label>
        <div className="mb-2">
          <input type="text" className="form-control is-valid is-valid-lite" placeholder="Valid State.." />
        </div>
        <div>
          <input type="text" className="form-control is-invalid is-invalid-lite" placeholder="Invalid State.." />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Form fieldset</label>
        <fieldset className="form-fieldset">
          <div className="mb-3">
            <label className="form-label required">Full name</label>
            <input type="text" className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label required">Company</label>
            <input type="text" className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label required">Email</label>
            <input type="email" className="form-control" />
          </div>
          <div className="mb-0">
            <label className="form-check">
              <input className="form-check-input" type="checkbox" />
              <span className="form-check-label">I agree with terms and conditions</span>
            </label>
          </div>
        </fieldset>
      </div>
    </>
  );
};

const FormSection4 = () => {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">Simple selectgroup</label>
        <div className="form-selectgroup">
          {['HTML', 'CSS', 'PHP', 'JavaScript'].map((tech, i) => (
            <label key={tech} className="form-selectgroup-item">
              <input type="checkbox" name="name" value={tech.toLowerCase()} className="form-selectgroup-input" defaultChecked={i < 3} />
              <span className="form-selectgroup-label">{tech}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Icon input</label>
        <div className="form-selectgroup">
          {['sun', 'moon', 'cloud-rain', 'cloud'].map((icon, i) => (
            <label key={icon} className="form-selectgroup-item">
              <input type="checkbox" name="name" value={icon} className="form-selectgroup-input" defaultChecked={i === 0} />
              <span className="form-selectgroup-label">
                <Icon icon={icon as any} />
              </span>
            </label>
          ))}
          <label className="form-selectgroup-item">
            <input type="checkbox" name="name" value="other" className="form-selectgroup-input" />
            <span className="form-selectgroup-label">Other</span>
          </label>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Selectgroup with icons and text</label>
        <div className="form-selectgroup">
          {[
            { icon: 'home', text: 'Home' },
            { icon: 'user', text: 'User' },
            { icon: 'circle', text: 'Circle' },
            { icon: 'square', text: 'Square' },
          ].map((item, i) => (
            <label key={item.text} className="form-selectgroup-item">
              <input type="radio" name="manager" value={item.text.toLowerCase()} className="form-selectgroup-input" defaultChecked={i === 3} />
              <span className="form-selectgroup-label">
                <Icon icon={item.icon as any} className="me-2" />
                {item.text}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Different style</label>
        <div className="form-selectgroup form-selectgroup-pills">
          {['HTML', 'CSS', 'PHP', 'JavaScript'].map((tech, i) => (
            <label key={tech} className="form-selectgroup-item">
              <input type="checkbox" name="name" value={tech.toLowerCase()} className="form-selectgroup-input" defaultChecked={i < 3} />
              <span className="form-selectgroup-label">{tech}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Payment method</label>
        <div className="form-selectgroup form-selectgroup-boxes d-flex flex-column">
          {[
            { id: '7998', type: 'visa' },
            { id: '1000', type: 'mastercard', checked: true },
            { id: 'paypal', type: 'paypal' },
          ].map((card) => (
            <label key={card.id} className="form-selectgroup-item flex-fill">
              <input type="radio" name="form-payment" value={card.id} className="form-selectgroup-input" defaultChecked={card.checked} />
              <div className="form-selectgroup-label d-flex align-items-center p-3">
                <div className="me-3">
                  <span className="form-selectgroup-check"></span>
                </div>
                <div>
                  <span className={`payment payment-provider-${card.type} payment-xs me-2`}></span>
                  {card.type === 'paypal' ? 'PayPal' : <span>ending in <strong>{card.id}</strong></span>}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Project Manager</label>
        <div className="form-selectgroup form-selectgroup-boxes d-flex flex-column">
          {peopleData.slice(0, 5).map((person, i) => (
            <label key={person.id} className="form-selectgroup-item flex-fill">
              <input type="checkbox" name="manager" value={person.id} className="form-selectgroup-input" defaultChecked={i === 1} />
              <div className="form-selectgroup-label d-flex align-items-center p-3">
                <div className="me-3">
                  <span className="form-selectgroup-check"></span>
                </div>
                <div className="form-selectgroup-label-content d-flex align-items-center">
                  <Avatar person={person as any} size="sm" className="me-3" />
                  <div>
                    <div className="fw-medium">{person.full_name}</div>
                    <div className="text-secondary">{person.job_title}</div>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Buttons group</label>
        <ButtonGroup items={['1 min', '5 min', '10 min', '30 min']} radio fluid id="basic" />
      </div>

      <div className="mb-3">
        <label className="form-label">Buttons group with dropdown</label>
        <ButtonGroup items={['Option 1', 'Option 2']} dropdown radio fluid id="dropdown" />
      </div>

      <div className="row">
        <div className="col">
          <div className="mb-3">
            <label className="form-label">Vertical buttons group</label>
            <ButtonGroup items={['Button 1', 'Button 2', 'Button 3', 'Button 4', 'Button 5']} vertical radio fluid id="vertical" />
          </div>
        </div>
        <div className="col">
          <div className="mb-3">
            <label className="form-label">Vertical with dropdown</label>
            <ButtonGroup items={['Button 1', 'Button 2', 'Button 3', 'Button 4']} vertical dropdown radio fluid id="vertical-dropdown" />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Toolbar</label>
        <ButtonGroup icons={['bold', 'italic', 'underline', 'copy', 'scissors', 'file-plus', 'file-minus']} radio fluid id="toolbar" selectedIndex={1} />
      </div>
    </>
  );
};

const FormSection5 = () => {
  return (
    <>
      <div className="mb-3">
        <div className="form-label">Radios</div>
        <FormCheck type="radio" name="r1" title="Option 1" defaultChecked />
        <FormCheck type="radio" name="r1" title="Option 2" />
        <FormCheck type="radio" name="r1" title="Option 3" disabled />
        <FormCheck type="radio" name="r1" title="Option 4" checked disabled />
      </div>

      <div className="mb-3">
        <div className="form-label">Inline Radios</div>
        <div className="d-flex flex-row gap-3">
          <FormCheck type="radio" name="r2" title="Option 1" defaultChecked />
          <FormCheck type="radio" name="r2" title="Option 2" />
          <FormCheck type="radio" name="r2" title="Option 3" />
        </div>
      </div>

      <div className="mb-3">
        <div className="form-label">Checkboxes</div>
        <FormCheck title="Option 1" defaultChecked />
        <FormCheck title="Option 2" />
        <FormCheck title="Option 3" disabled />
      </div>

      <div className="mb-3">
        <div className="form-label">Inline Checkboxes</div>
        <div className="d-flex flex-row gap-3">
          <FormCheck title="Option 1" defaultChecked />
          <FormCheck title="Option 2" />
          <FormCheck title="Option 3" />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Checkboxes with description</label>
        <label className="form-check">
          <input className="form-check-input" type="checkbox" />
          <span className="form-check-label">Default checkbox</span>
          <span className="form-check-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</span>
        </label>
        <label className="form-check">
          <input className="form-check-input" type="checkbox" />
          <span className="form-check-label">Longer checkbox item that wraps on to two separate lines</span>
          <span className="form-check-description">Ab alias aut, consequuntur cumque esse eveniet incidunt laborum minus molestiae.</span>
        </label>
        <label className="form-check">
          <input className="form-check-input" type="checkbox" />
          <span className="form-check-label">Default checkbox without description</span>
        </label>
      </div>

      <div className="mb-3">
        <div className="form-label">Toggles</div>
        <FormCheck type="switch" title="Option 1" defaultChecked />
        <FormCheck type="switch" title="Option 2" />
        <FormCheck type="switch" title="Option 3" disabled />
      </div>

      <div className="mb-3">
        <div className="form-label">Simple Toggle</div>
        <FormCheck type="switch" />
      </div>

      <div className="mb-3">
        <label className="form-label">Notification switch group</label>
        <div className="divide-y">
          <label className="row g-2 p-2">
            <span className="col-auto">
              <Icon icon="bell" className="text-muted" />
            </span>
            <span className="col">
              Push notifications
            </span>
            <span className="col-auto">
              <label className="form-check form-switch m-0">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </label>
            </span>
          </label>
          <label className="row g-2 p-2">
            <span className="col-auto">
              <Icon icon="mail" className="text-muted" />
            </span>
            <span className="col">
              SMS notifications
            </span>
            <span className="col-auto">
              <label className="form-check form-switch m-0">
                <input className="form-check-input" type="checkbox" />
              </label>
            </span>
          </label>
          <label className="row g-2 p-2">
            <span className="col-auto">
              <Icon icon="message-circle" className="text-muted" />
            </span>
            <span className="col">
              Email notifications
            </span>
            <span className="col-auto">
              <label className="form-check form-switch m-0">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </label>
            </span>
          </label>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Notification</label>
        <div className="list-group list-group-flush">
          {['Internal messages', 'External messages', 'Invites'].map(item => (
            <label key={item} className="list-group-item d-flex align-items-center">
              <span className="flex-fill">{item}</span>
              <label className="form-check form-switch m-0 ms-auto">
                <input className="form-check-input" type="checkbox" defaultChecked />
              </label>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">File input</label>
        <input type="file" className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Date of birth</label>
        <div className="row g-2">
          <div className="col-5">
            <select name="user[month]" className="form-select">
              <option value="">Month</option>
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                <option key={m} value={i + 1} selected={m === 'June'}>{m}</option>
              ))}
            </select>
          </div>
          <div className="col-3">
            <select name="user[day]" className="form-select">
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                <option key={d} value={d} selected={d === 20}>{d}</option>
              ))}
            </select>
          </div>
          <div className="col-4">
            <select name="user[year]" className="form-select">
              <option value="">Year</option>
              {Array.from({ length: 118 }, (_, i) => 2014 - i).map(y => (
                <option key={y} value={y} selected={y === 1989}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Text mask</label>
        <InputMask mask="00/00/0000" placeholder="00/00/0000" visible />
      </div>
      <div className="mb-3">
        <label className="form-label">Telephone mask</label>
        <InputMask mask="(00) 0000-0000" placeholder="(00) 0000-0000" visible />
      </div>

      <div className="mb-3">
        <label className="form-label">Autosize textarea</label>
        <AutosizeTextarea rows={1} placeholder="Type something..." />
      </div>
    </>
  );
};

const FormSection6 = () => {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">Datalist example</label>
        <input className="form-control" list="datalistOptions" placeholder="Type to search..." />
        <datalist id="datalistOptions">
          <option value="Aruba" />
          <option value="Afghanistan" />
          <option value="Angola" />
          <option value="Albania" />
          <option value="Andorra" />
        </datalist>
      </div>

      <div className="mb-3">
        <label className="form-label">Range input</label>
        <Range value="40" />
        <Range id="simple" value="20" connect />
        <Range id="connect" value="60,90" />
        <Range id="color" value="40" className="text-green" connect />
      </div>

      <div className="mb-3">
        <label className="form-label">Datepicker</label>
        <Datepicker id="datepicker-default" layout="none" className="mb-3" value="2020-06-20" />
        <Datepicker id="datepicker-icon-right" className="mb-3" value="2020-06-20" />
        <Datepicker id="datepicker-icon-left" layout="icon" className="mb-3" value="2020-06-20" />
      </div>

      <div className="mb-3">
        <label className="form-label">Inline datepicker</label>
        <div className="datepicker-inline">
          <Datepicker id="datepicker-inline" inline value="2026-03-14" />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Progress</label>
        <Progress value={38} className="mb-2" />
        <Progress indeterminate color="green" />
      </div>

      <div className="mb-3">
        <label className="form-label">Form buttons</label>
        <div className="row g-2">
          <div className="col-6 col-sm-4 col-md-2 col-xl-auto">
            <a href="#" className="btn btn-white w-100">
              <Icon icon="brand-github" className="me-2" /> Login with Github
            </a>
          </div>
          <div className="col-6 col-sm-4 col-md-2 col-xl-auto">
            <a href="#" className="btn btn-white w-100">
              <Icon icon="brand-x" className="me-2" /> Login with X
            </a>
          </div>
        </div>
      </div>


      <div className="mb-3">
        <label className="form-label">Tags input</label>
        <Select 
          multiple 
          selectKey="tags"
          placeholder="Select tags"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Advanced select</label>
        <Select 
          selectKey="users" 
        />
      </div>

      <div className="mb-3">
         <label className="form-label">Advanced select with optgroup</label>
         <Select selectKey="optgroups" />
      </div>

      <div className="mb-3">
        <label className="form-label">Select with avatars</label>
        <Select 
          selectKey="people"
          indicator="avatar"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Select with flags</label>
        <Select 
          selectKey="countries"
          indicator="flag"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Select with labels</label>
        <Select 
          selectKey="labels"
          indicator="label"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Advanced select with validation state</label>
        <div className="mb-2">
          <Select 
            id="countries-valid"
            selectKey="countries"
            state="valid" 
          />
        </div>
        <Select 
          id="countries-invalid"
          selectKey="countries"
          state="invalid" 
        />
      </div>
    </>
  );
};

interface FormLayoutCardProps {
  horizontal?: boolean
  title?: string
}

function FormLayoutCard({ horizontal, title = 'Basic form' }: FormLayoutCardProps) {
  return (
    <form className="card h-100">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body">
        <div className={`mb-3${horizontal ? ' row' : ''}`}>
          <label className={`${horizontal ? 'col-3 col-form-label' : 'form-label'} required`}>Email address</label>
          <div className={horizontal ? 'col' : ''}>
            <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email" />
            <small className="form-hint">We'll never share your email with anyone else.</small>
          </div>
        </div>

        <div className={`mb-3${horizontal ? ' row' : ''}`}>
          <label className={`${horizontal ? 'col-3 col-form-label' : 'form-label'} required`}>Password</label>
          <div className={horizontal ? 'col' : ''}>
            <input type="password" disabled className="form-control" placeholder="Password" />
            <small className="form-hint">
              Your password must be 8-20 characters long, contain letters and numbers, and must not contain
              spaces, special characters, or emoji.
            </small>
          </div>
        </div>

        <div className={`mb-3${horizontal ? ' row' : ''}`}>
          <label className={horizontal ? 'col-3 col-form-label' : 'form-label'}>Select</label>
          <div className={horizontal ? 'col' : ''}>
            <select className="form-select">
              <option>Option 1</option>
              <optgroup label="Optgroup 1">
                <option>Option 1</option>
                <option>Option 2</option>
              </optgroup>
              <option>Option 2</option>
              <optgroup label="Optgroup 2">
                <option>Option 1</option>
                <option>Option 2</option>
              </optgroup>
              <optgroup label="Optgroup 3">
                <option>Option 1</option>
                <option>Option 2</option>
              </optgroup>
              <option>Option 3</option>
              <option>Option 4</option>
            </select>
          </div>
        </div>

        <div className={horizontal ? 'row' : 'mb-3'}>
          <label className={horizontal ? 'col-3 col-form-label pt-0' : 'form-label'}>Checkboxes</label>
          <div className={horizontal ? 'col' : ''}>
            <label className="form-check">
              <input className="form-check-input" type="checkbox" defaultChecked />
              <span className="form-check-label">Option 1</span>
            </label>
            <label className="form-check">
              <input className="form-check-input" type="checkbox" />
              <span className="form-check-label">Option 2</span>
            </label>
            <label className="form-check">
              <input className="form-check-input" type="checkbox" disabled />
              <span className="form-check-label">Option 3</span>
            </label>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <div className="text-end">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </div>
    </form>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function FormElements() {
  const inputMasks = [
    { label: 'Date',                      mask: '00/00/0000' },
    { label: 'Hour',                      mask: '00:00:00' },
    { label: 'Date & Hour',               mask: '00/00/0000 00:00:00' },
    { label: 'ZIP Code',                  mask: '00000-000' },
    { label: 'Money',                     mask: '000.000.000.000.000,00', reverse: true },
    { label: 'Telephone',                 mask: '0000-0000' },
    { label: 'Telephone with Code Area',  mask: '(00) 0000-0000' },
    { label: 'IP Address',                mask: '099.099.099.099', placeholder: '000.000.000.000' },
  ]

  const httpMethods = ['GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'PATCH']
  const httpSources = ['Status code', 'JSON body', 'Headers', 'Text body', 'Response time']
  const httpComparisons = ['Equals','Not equals','Has key','Not has key','Has value','Not has value','Is empty','Is not empty','Greater than','Less than']

  return (
    <BaseLayout pageTitle="Form elements">
      <div className="row row-cards">
        <div className="col-12">
          <form action="https://httpbin.org/post" method="post" className="card">
            <div className="card-header">
              <h4 className="card-title">Form elements</h4>
            </div>
            <div className="card-body">
              <div className="row g-5">
                <div className="col-xl-4">
                  <div className="row">
                    <div className="col-md-6 col-xl-12"><FormSection1 /></div>
                    <div className="col-md-6 col-xl-12"><FormSection2 /></div>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="row">
                    <div className="col-md-6 col-xl-12"><FormSection3 /></div>
                    <div className="col-md-6 col-xl-12"><FormSection4 /></div>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="row">
                    <div className="col-md-6 col-xl-12"><FormSection5 /></div>
                    <div className="col-md-6 col-xl-12"><FormSection6 /></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer text-end">
              <div className="d-flex">
                <a href="#" className="btn btn-link">Cancel</a>
                <button type="submit" className="btn btn-primary ms-auto">Send data</button>
              </div>
            </div>
          </form>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="card-title">Project ID</h3>
              <p className="card-subtitle">Used when interacting with the API.</p>
              <InputIcon
                icon="files"
                value="prj_5ae74426fe935327a8fa178b07d84ad9"
                readonly
              />
            </div>
            <div className="card-footer">
              <div className="row align-items-center">
                <div className="col">Learn more about <a href="#">Project ID</a></div>
                <div className="col-auto">
                  <Button text="Save" color="primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Node.js Version</h3>
              <p className="card-subtitle">The version of Node.js that is used in the Build Step and for Serverless Functions.
                A new Deployment is required for your changes to take effect.</p>
              <select className="form-select">
                <option>14.x</option>
                <option>12.x</option>
              </select>
            </div>
            <div className="card-footer">
              Learn more about <a href="#">Node.js Version</a>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <FormLayoutCard title="Layout" />
        </div>

        <div className="col-lg-8">
          <div className="row row-cards">
            <div className="col-12 col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Input mask</h3>
                </div>
                <div className="card-body">
                  {inputMasks.map(({ label, mask, reverse, placeholder }) => (
                    <div key={label} className="mb-3">
                      <label className="form-label">{label}</label>
                      <InputMask mask={mask} visible reverse={reverse} placeholder={placeholder} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <form className="card h-100">
                <div className="card-header">
                  <h3 className="card-title">My Profile</h3>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="row">
                      <div className="col-auto">
                        <Avatar personId={3} size="md" people={peopleData as any} />
                      </div>
                      <div className="col">
                        <div className="mb-3">
                          <label className="form-label">Email-Address</label>
                          <input className="form-control" placeholder="your-email@domain.com" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea className="form-control" rows={5} defaultValue="Big belly rude boy, million dollar hustler. Unemployed." />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email-Address</label>
                    <input className="form-control" placeholder="your-email@domain.com" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" defaultValue="password" />
                  </div>
                </div>
                <div className="card-footer text-end">
                  <Button text="Save" color="primary" />
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-12">
          <div className="row row-cards">
            <div className="col-12 col-lg-6">
              <form className="card">
                <div className="card-body">
                  <h3 className="card-title">Edit Profile</h3>
                  <div className="row row-cards">
                    <div className="col-md-5">
                      <div className="mb-3">
                        <label className="form-label">Company</label>
                        <input type="text" className="form-control" disabled placeholder="Company" defaultValue="Creative Code Inc." />
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" placeholder="Username" defaultValue="michael23" />
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-4">
                      <div className="mb-3">
                        <label className="form-label">Email address</label>
                        <input type="email" className="form-control" placeholder="Email" />
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input type="text" className="form-control" placeholder="Company" defaultValue="Chet" />
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input type="text" className="form-control" placeholder="Last Name" defaultValue="Faker" />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input type="text" className="form-control" placeholder="Home Address" defaultValue="Melbourne, Australia" />
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-4">
                      <div className="mb-3">
                        <label className="form-label">City</label>
                        <input type="text" className="form-control" placeholder="City" defaultValue="Melbourne" />
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <div className="mb-3">
                        <label className="form-label">Postal Code</label>
                        <input type="text" className="form-control" placeholder="ZIP Code" />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="mb-3">
                        <label className="form-label">Country</label>
                        <select className="form-select">
                          <option value="">Germany</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="mb-3 mb-0">
                        <label className="form-label">About Me</label>
                        <textarea rows={5} className="form-control" placeholder="Here can be your description" defaultValue={`Oh so, your weak rhyme\nYou doubt I'll bother, reading into it\nI'll probably won't, left to my own devices\nBut that's the difference in our opinions.`} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer text-end">
                  <button type="submit" className="btn btn-primary">Update Profile</button>
                </div>
              </form>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card h-100">
                <div className="card-header">
                  <h3 className="card-title">HTTP Request</h3>
                </div>
                <div className="card-body">
                  <div className="row row-cards">
                    <div className="mb-3 col-sm-4 col-md-2">
                      <label className="form-label required">Method</label>
                      <select className="form-select">
                        {httpMethods.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="mb-3 col-sm-8 col-md-10">
                      <label className="form-label required">URL</label>
                      <input name="url" type="text" className="form-control" defaultValue="https://content.googleapis.com/discovery/v1/apis/surveys/v2/rest" />
                    </div>
                  </div>
                  <div className="form-label">Assertions</div>
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead>
                        <tr>
                          <th>Source</th>
                          <th>Property</th>
                          <th>Comparison</th>
                          <th>Target</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { source: 'STATUS_CODE',   property: '',                      comparison: 'EQUALS',    target: '200' },
                          { source: 'JSON_BODY',      property: 'parameters.alt.type',   comparison: 'HAS_VALUE', target: 'string' },
                          { source: 'RESPONSE_TIME',  property: '',                      comparison: 'LESS_THAN', target: '500' },
                          { source: 'HEADERS',        property: 'content-type',          comparison: 'EQUALS',    target: 'application/json; charset=UTF-8' },
                        ].map((row, i) => (
                          <tr key={i}>
                            <td>
                              <select className="form-select">
                                {httpSources.map(s => (
                                  <option key={s} value={s.toUpperCase().replace(/ /g, '_')} selected={s.toUpperCase().replace(/ /g, '_') === row.source}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td><input type="text" className="form-control" defaultValue={row.property} /></td>
                            <td>
                              <select className="form-select">
                                {httpComparisons.map(c => (
                                  <option key={c} value={c.toUpperCase().replace(/ /g, '_')} selected={c.toUpperCase().replace(/ /g, '_') === row.comparison}>
                                    {c}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td><input type="text" className="form-control" defaultValue={row.target} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer text-end">
                  <button type="submit" className="btn btn-primary">Make request</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
