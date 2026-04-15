interface NewsItem {
  title: string;
  excerpt?: string;
  source?: string;
  date?: string;
  href?: string;
}

interface CompanyField {
  label: string;
  value: React.ReactNode;
}

interface CompanyLookupCardProps {
  domain?: string;
  logoUrl?: string;
  fields?: CompanyField[];
  location?: string;
  timezone?: string;
  description?: string;
  tags?: string[];
  sideFields?: CompanyField[];
  news?: NewsItem[];
}

export function CompanyLookupCard({
  domain = 'amazon.com',
  logoUrl = 'https://logo.clearbit.com/amazon.com?size=100',
  fields = [
    { label: 'Name', value: 'Amazon.com' },
    { label: 'Ticker', value: 'AMZN' },
    { label: 'Founded', value: '1995' },
    { label: 'Type', value: 'Public' },
    { label: 'Employees', value: '341,400' },
    { label: 'Revenue', value: '$135B' },
  ],
  location = '207 Boren Ave, Seattle, WA 98109, USA',
  timezone = 'America/Los_Angeles',
  description = 'Online shopping from the earth\'s biggest selection of products.',
  tags = ['E-Commerce', 'B2C', 'Internet', 'Technology'],
  sideFields = [
    { label: 'Industry', value: 'Internet Software & Services' },
    { label: 'Phone', value: <a href="tel:+12062661000">+1 206-266-1000</a> },
  ],
  news = [
    { title: 'Amazon expansion plans revealed', source: 'businessinsider.com', date: '2 days ago' },
    { title: 'AWS revenue surpasses expectations', source: 'techcrunch.com', date: '4 days ago' },
  ],
}: CompanyLookupCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row align-items-center mb-4">
          <div className="col-auto">
            <div className="avatar avatar-lg rounded" style={{ backgroundImage: `url(${logoUrl})` }} />
          </div>
          <div className="col">
            <div className="h3 m-0 fw-normal">{domain}</div>
          </div>
        </div>
        <div className="row">
          {fields.map((f, i) => (
            <div key={i} className="col">
              <h5 className="mb-1">{f.label}</h5>
              <div className="text-secondary">{f.value}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-7">
            <div className="row mb-4">
              <div className="col">
                <h5 className="mb-1">Location</h5>
                <div className="text-secondary">{location}</div>
              </div>
              <div className="col">
                <h5 className="mb-1">Timezone</h5>
                <div className="text-secondary">{timezone}</div>
              </div>
            </div>
            <hr />
            <h5 className="mb-4">Recent News</h5>
            <ul className="list-unstyled">
              {news.map((n, i) => (
                <li key={i} className="mb-5">
                  <a href={n.href || '#'}>{n.title}</a>
                  {n.excerpt && <p className="mb-1 text-secondary">{n.excerpt}</p>}
                  <div className="row">
                    <div className="col text-secondary">{n.source}</div>
                    <div className="col text-secondary text-end">{n.date}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-5">
            <ul className="list-unstyled list-separated">
              <li>
                <h5>Description</h5>
                <div className="text-secondary">{description}</div>
              </li>
              <li>
                <h5>Tags</h5>
                <div>{tags.map((t, i) => <span key={i} className="tag me-1">{t}</span>)}</div>
              </li>
              {sideFields.map((f, i) => (
                <li key={i}>
                  <h5 className="mb-1">{f.label}</h5>
                  <div>{f.value}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
