import { useEffect } from 'react'

interface RedirectLayoutProps {
  to: string
}

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
