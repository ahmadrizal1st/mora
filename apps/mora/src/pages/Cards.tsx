// src/pages/Cards.tsx
import BaseLayout from '../layouts/BaseLayout'
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  CardStatus,
  CardStamp,
  CardProgress,
  CardRibbonText,
  CardRibbonTop,
  CardImage,
  CardTabs,
  CardGroup,
  CreditCardCard,
} from '../components/cards'
import { Icon } from '../components/ui/Icon'
import { Placeholder } from '../components/ui'

const missingCss = `
  .card-dashed {
    border: var(--tblr-border-width) dashed var(--tblr-border-color);
  }
  
  .card-transparent {
    background: transparent;
    border: var(--tblr-border-width) dashed var(--tblr-border-color);
    box-shadow: none;
  }
`;

export default function Cards() {
  return (
    <BaseLayout pageTitle="Cards" pagePretitle="Components">
      <style>{missingCss}</style>
      <div className="row row-cards">
        {/* Basic Cards */}
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardHeader>
              <CardTitle>Card title</CardTitle>
            </CardHeader>
            <CardBody>Simple card</CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardHeader light>
              <CardTitle>Card title</CardTitle>
            </CardHeader>
            <CardBody>Card with header background</CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card className="card-borderless">
            <CardBody>
              <CardTitle>Card title</CardTitle>
              <div>Card without border</div>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardHeader>
              <CardTitle subtitle="Subtitle">Card title</CardTitle>
            </CardHeader>
            <CardBody>Card with title and subtitle</CardBody>
          </Card>
        </div>

        {/* Hover Effects */}
        <div className="col-md-6 col-lg-3">
          <Card as="a" href="#" className="card-link">
            <CardBody>Default hover effect</CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card as="a" href="#" className="card-link card-link-rotate">
            <CardBody>Rotate hover effect</CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card as="a" href="#" className="card-link card-link-pop">
            <CardBody>Pop hover effect</CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
        </div>

        {/* Rotations & States */}
        <div className="col-md-6 col-lg-3">
          <Card className="card-rotate-end">
            <CardBody>Card rotate end</CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card className="card-rotate-start">
            <CardBody>Card rotate start</CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card className="card-active">
            <CardBody>
              <p>This is a card with active state.</p>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card className="card-inactive">
            <CardBody>
              <p>This is some text inactive state.</p>
            </CardBody>
          </Card>
        </div>

        {/* Stamps & Backgrounds */}
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardStamp icon="bell" />
            <CardBody>
              <CardTitle>Card with icon bg</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto at consectetur culpa ducimus eum fuga fugiat, ipsa iusto, modi nostrum recusandae reiciendis saepe.</p>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card className="bg-primary-lt">
            <CardBody>
              <CardTitle>Card with primary light background</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto at consectetur culpa ducimus eum fuga fugiat, ipsa iusto, modi nostrum recusandae reiciendis saepe.</p>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card className="bg-primary text-primary-fg">
            <CardStamp icon="star" iconClass="bg-white text-primary" />
            <CardBody>
              <CardTitle>Card with background and icon</CardTitle>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto at consectetur culpa ducimus eum fuga fugiat, ipsa iusto, modi nostrum recusandae reiciendis saepe.</p>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardStatus position="top" color="danger" />
            <CardBody>
              <CardTitle>Card with top status</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto at consectetur culpa ducimus eum fuga fugiat, ipsa iusto, modi nostrum recusandae reiciendis saepe.</p>
            </CardBody>
          </Card>
        </div>

        {/* Statuses & Ribbons */}
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardStatus position="bottom" color="success" />
            <CardBody>
              <CardTitle>Card with bottom status</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardStatus position="start" color="primary" />
            <CardBody>
              <CardTitle>Card with side status</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardRibbonTop color="yellow"><Icon icon="star" /></CardRibbonTop>
            <CardBody>
              <CardTitle>Card with top ribbon</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto at consectetur culpa ducimus eum fuga fugiat, ipsa iusto, modi nostrum recusandae reiciendis saepe.</p>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardBody>
              <CardTitle>Card with ribbon text</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto at consectetur culpa ducimus eum fuga fugiat, ipsa iusto, modi nostrum recusandae reiciendis saepe.</p>
            </CardBody>
            <CardRibbonText position="end" color="red">New</CardRibbonText>
          </Card>
        </div>

        {/* Progress & Stacked */}
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardBody>
              <CardTitle>Card with progress bar</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
            </CardBody>
            <CardProgress value={38} />
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card className="card-stacked">
            <CardBody>
              <CardTitle>Stacked card</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
            </CardBody>
          </Card>
        </div>

        {/* Images */}
        <div className="col-lg-6">
          <Card>
            <div className="row row-0">
              <div className="col-3">
                <CardImage src="/static/photos/a-visit-to-the-bookstore.jpg" position="start" className="w-100 h-100 object-cover card-img-start" alt="Card side image" />
              </div>
              <div className="col">
                <CardBody>
                  <CardTitle>Card with left side image</CardTitle>
                  <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
                </CardBody>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-lg-6">
          <Card>
            <div className="row row-0">
              <div className="col-3 order-md-last">
                <CardImage src="/static/photos/finances-us-dollars-and-bitcoins-currency-money.jpg" position="end" className="w-100 h-100 object-cover card-img-end" alt="Card side image" />
              </div>
              <div className="col">
                <CardBody>
                  <CardTitle>Card with right side image</CardTitle>
                  <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
                </CardBody>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardImage src="/static/photos/beautiful-blonde-woman-on-a-wooden-pier-by-the-lake.jpg" position="top" alt="Card top image" />
            <CardBody>
              <CardTitle>Card with top image</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardBody>
              <CardTitle>Card with bottom image</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
            </CardBody>
            <CardImage src="/static/photos/books-and-purple-flowers-on-a-wooden-stool-by-the-bed.jpg" position="bottom" alt="Card bottom image" />
          </Card>
        </div>

        {/* Footers */}
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardBody>
              <CardTitle>Card with footer</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
            </CardBody>
            <CardFooter>
              This is standard card footer
            </CardFooter>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardBody>
              <CardTitle>Card with transparent footer</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
            </CardBody>
            <CardFooter transparent>
              This is transparent card footer
            </CardFooter>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardBody>
              <CardTitle>Card with footer button</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
            </CardBody>
            <CardFooter>
              <a href="#" className="btn btn-primary">Go somewhere</a>
            </CardFooter>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardBody>
              <CardTitle>Card with footer buttons</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
            </CardBody>
            <CardFooter>
              <div className="row">
                <div className="col">
                  <a href="#" className="btn w-100">Cancel</a>
                </div>
                <div className="col">
                  <a href="#" className="btn btn-primary w-100">Submit</a>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Nested Cards */}
        <div className="col-12">
          <Card>
            <CardHeader>
              <CardTitle>Cards inside card</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="row row-cards">
                {['First', 'Second', 'Third'].map((name, i) => (
                  <div key={i} className="col-md">
                    <Card>
                      <CardStatus position="top" color={['red', 'green', 'blue'][i]} />
                      <CardHeader>
                        <CardTitle>{name} card</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Placeholder height={150} border={true} ratio={false} />
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Card Group */}
        <div className="col-12">
          <CardGroup>
            {['First', 'Second', 'Third'].map((name, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{name} card</CardTitle>
                </CardHeader>
                <CardBody>
                  <Placeholder height={150} border={true} ratio={false} />
                </CardBody>
              </Card>
            ))}
          </CardGroup>
        </div>

        {/* Row Deck */}
        <div className="col-12">
          <div className="row row-cards row-deck">
            <div className="col">
              <Card>
                <CardHeader>
                  <CardTitle>Card title</CardTitle>
                </CardHeader>
                <CardBody>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</CardBody>
                <CardFooter>
                  Last updated 3 mins ago
                </CardFooter>
              </Card>
            </div>
            <div className="col">
              <Card>
                <CardHeader>
                  <CardTitle>Card title</CardTitle>
                </CardHeader>
                <CardBody>This card has supporting text below as a natural lead-in to additional content.</CardBody>
                <CardFooter>
                  Last updated 3 mins ago
                </CardFooter>
              </Card>
            </div>
            <div className="col">
              <Card>
                <CardHeader>
                  <CardTitle>Card with very long content</CardTitle>
                </CardHeader>
                <CardBody>This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</CardBody>
                <CardFooter>
                  Last updated 3 mins ago
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardBody>
              <CardTitle>Card with footer elements</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
            </CardBody>
            <CardFooter>
              <div className="row align-items-center">
                <div className="col-auto">
                  <a href="#">More information</a>
                </div>
                <div className="col-auto ms-auto">
                  <label className="form-check form-switch m-0">
                    <input className="form-check-input" type="checkbox" defaultChecked />
                  </label>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        <div className="col-md-6 col-lg-3">
          <Card>
            <CardBody>
              <CardTitle>Card with footer elements</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam deleniti fugit incidunt, iste, itaque minima neque pariatur perferendis sed suscipit velit vitae voluptatem.</p>
            </CardBody>
            <CardFooter>
              <div className="row align-items-center">
                <div className="col-auto ms-auto">
                  <div className="avatar-list avatar-list-stacked">
                    <span className="avatar avatar-sm rounded" style={{ backgroundImage: 'url(/static/avatars/000m.jpg)' }}></span>
                    <span className="avatar avatar-sm rounded" style={{ backgroundImage: 'url(/static/avatars/001m.jpg)' }}></span>
                    <span className="avatar avatar-sm rounded" style={{ backgroundImage: 'url(/static/avatars/002m.jpg)' }}></span>
                    <span className="avatar avatar-sm rounded" style={{ backgroundImage: 'url(/static/avatars/003m.jpg)' }}></span>
                    <span className="avatar avatar-sm rounded">+3</span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Tabs & Pills */}
        <div className="col-md-6 col-lg-4">
          <Card>
            <CardHeader>
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item"><a className="nav-link active" href="#">Active</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Link</a></li>
                <li className="nav-item"><a className="nav-link disabled" href="#">Disabled</a></li>
              </ul>
            </CardHeader>
            <CardBody>
              <CardTitle>Card with header tabs</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto at consectetur culpa ducimus eum fuga fugiat, ipsa iusto, modi nostrum recusandae reiciendis saepe.</p>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-4">
          <Card>
            <CardHeader>
              <ul className="nav nav-pills card-header-pills">
                <li className="nav-item"><a className="nav-link active" href="#">Active</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Link</a></li>
                <li className="nav-item"><a className="nav-link disabled" href="#">Disabled</a></li>
              </ul>
            </CardHeader>
            <CardBody>
              <CardTitle>Card with header pills</CardTitle>
              <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto at consectetur culpa ducimus eum fuga fugiat, ipsa iusto, modi nostrum recusandae reiciendis saepe.</p>
            </CardBody>
          </Card>
        </div>
        <div className="col-md-6 col-lg-4">
          <CardTabs>
            <ul className="nav nav-tabs">
              <li className="nav-item"><a href="#tab-top-1" className="nav-link active" data-bs-toggle="tab">Activity</a></li>
              <li className="nav-item"><a href="#tab-top-2" className="nav-link" data-bs-toggle="tab">Profile</a></li>
              <li className="nav-item"><a href="#tab-top-3" className="nav-link" data-bs-toggle="tab">Settings</a></li>
            </ul>
            <div className="tab-content">
              <div id="tab-top-1" className="card tab-pane active show">
                <CardBody>
                  <CardTitle>Activity</CardTitle>
                  <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, alias aliquid distinctio dolorem expedita, fugiat hic magni molestiae molestias odit.</p>
                </CardBody>
              </div>
              <div id="tab-top-2" className="card tab-pane">
                <CardBody>
                  <CardTitle>Profile</CardTitle>
                  <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, alias aliquid distinctio dolorem expedita, fugiat hic magni molestiae molestias odit.</p>
                </CardBody>
              </div>
              <div id="tab-top-3" className="card tab-pane">
                <CardBody>
                  <CardTitle>Settings</CardTitle>
                  <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, alias aliquid distinctio dolorem expedita, fugiat hic magni molestiae molestias odit.</p>
                </CardBody>
              </div>
            </div>
          </CardTabs>
        </div>
        <div className="col-md-6 col-lg-4">
          <CardTabs bottom>
            <div className="tab-content">
              <div id="tab-bottom-1" className="card tab-pane active show">
                <CardBody>
                  <CardTitle>Activity</CardTitle>
                  <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, alias aliquid distinctio dolorem expedita, fugiat hic magni molestiae molestias odit.</p>
                </CardBody>
              </div>
              <div id="tab-bottom-2" className="card tab-pane">
                <CardBody>
                  <CardTitle>Profile</CardTitle>
                  <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, alias aliquid distinctio dolorem expedita, fugiat hic magni molestiae molestias odit.</p>
                </CardBody>
              </div>
              <div id="tab-bottom-3" className="card tab-pane">
                <CardBody>
                  <CardTitle>Settings</CardTitle>
                  <p className="text-secondary">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci, alias aliquid distinctio dolorem expedita, fugiat hic magni molestiae molestias odit.</p>
                </CardBody>
              </div>
            </div>
            <ul className="nav nav-tabs nav-tabs-bottom">
              <li className="nav-item"><a href="#tab-bottom-1" className="nav-link active" data-bs-toggle="tab">Activity</a></li>
              <li className="nav-item"><a href="#tab-bottom-2" className="nav-link" data-bs-toggle="tab">Profile</a></li>
              <li className="nav-item"><a href="#tab-bottom-3" className="nav-link" data-bs-toggle="tab">Settings</a></li>
            </ul>
          </CardTabs>
        </div>

        {/* Empty States & Credit Card */}
        <div className="col-lg-4">
          <Card>
            <div className="empty">
              <div className="empty-img">
                <img src="/static/illustrations/light/not-found.png" style={{ height: '150px' }} alt="" />
              </div>
              <p className="empty-title">No results found</p>
              <p className="empty-subtitle text-secondary">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <div className="empty-action">
                <a href="./." className="btn btn-primary">
                  <Icon icon="search" className="icon" />
                  Search again
                </a>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-lg-4">
          <div className="card card-lg card-dashed card-transparent">
            <div className="card-body text-center">
              <div className="mb-3">
                <div className="avatar-list avatar-list-stacked">
                  <span className="avatar avatar-sm avatar-rounded" style={{ backgroundImage: 'url(/static/avatars/000m.jpg)' }}></span>
                  <span className="avatar avatar-sm avatar-rounded" style={{ backgroundImage: 'url(/static/avatars/052f.jpg)' }}></span>
                  <span className="avatar avatar-sm avatar-rounded" style={{ backgroundImage: 'url(/static/avatars/002m.jpg)' }}></span>
                  <span className="avatar avatar-sm avatar-rounded" style={{ backgroundImage: 'url(/static/avatars/003m.jpg)' }}></span>
                  <span className="avatar avatar-sm avatar-rounded" style={{ backgroundImage: 'url(/static/avatars/000f.jpg)' }}></span>
                </div>
              </div>
              <h3 className="card-title">No Team Members</h3>
              <p className="text-secondary">Invite your team to<br />collaborate on this project.</p>
              <div className="mt-4">
                <a href="#" className="btn btn-primary">
                  <Icon icon="plus" />
                  Invite Members
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <CreditCardCard />
        </div>
      </div>
    </BaseLayout>
  )
}