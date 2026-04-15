import { clsx } from 'clsx'

interface FooterProps {
  version?: string
  siteTitle?: string
  className?: string
}

export function Footer({
  version,
  siteTitle = 'Tabler',
  className,
}: FooterProps) {
  return (
    <footer className={clsx('footer', 'footer-transparent', 'd-none d-lg-block', 'd-print-none', className)}>
      <div className="container-xl">
        <div className="row text-center align-items-center flex-row-reverse">
          <div className="col-12 col-lg-auto mt-3 mt-lg-0">
            <ul className="list-inline list-inline-dots mb-0">
              <li className="list-inline-item">
                Copyright &copy; {new Date().getFullYear()}{' '}
                <a href="/" className="link-secondary">{siteTitle}</a>.
                All rights reserved.
              </li>
              {version && (
                <li className="list-inline-item">
                  <a href="/changelog" className="link-secondary" rel="noopener">
                    v{version}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}