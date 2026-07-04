import React from 'react'
import { Link } from '@tanstack/react-router'
import { MarketingNavbar } from '../components/marketing/MarketingNavbar'

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="page page-center-marketing">
      <MarketingNavbar />
      <div className="page-wrapper">
        <main>{children}</main>
        <footer className="footer footer-transparent d-print-none py-6 border-top">
          <div className="container">
            <div className="row align-items-center flex-row-reverse">
              <div className="col-lg-auto ms-lg-auto">
                <ul className="list-inline list-inline-dots mb-0">
                  <li className="list-inline-item">
                    <Link to="/" className="link-secondary">
                      Documentation
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link to="/" className="link-secondary">
                      License
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <a
                      href="https://github.com/tabler/tabler"
                      target="_blank"
                      rel="noreferrer"
                      className="link-secondary"
                    >
                      Source code
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-12 col-lg-auto mt-3 mt-lg-0">
                <ul className="list-inline list-inline-dots mb-0">
                  <li className="list-inline-item">
                    Copyright &copy; {new Date().getFullYear()}
                    <Link to="/" className="link-secondary ms-1">
                      Morapi
                    </Link>
                    . All rights reserved.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
