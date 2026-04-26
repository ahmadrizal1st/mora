// src/layouts/RedirectLayout.tsx
import { useEffect } from 'react'

interface RedirectLayoutProps {
  /** Target URL to redirect to */
  to: string
}

/**
 * RedirectLayout immediately redirects the browser to the given URL.
 * Equivalent to shared/layouts/redirect.html + shared/includes/redirect.html
 *
 * Usage:
 *   <RedirectLayout to="/new-page" />
 *   or in a route:
 *   { path: '/old-path', element: <RedirectLayout to="/new-path" /> }
 */
export default function RedirectLayout({ to }: RedirectLayoutProps) {
  useEffect(() => {
    window.location.href = to
  }, [to])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Redirecting…</title>
        <link rel="canonical" href={to} />
        <meta httpEquiv="refresh" content={`0; url=${to}`} />
        <meta name="robots" content="noindex" />
      </head>
      <body>
        <noscript>
          <a href={to}>Click here if you are not redirected.</a>
        </noscript>
      </body>
    </html>
  )
}
