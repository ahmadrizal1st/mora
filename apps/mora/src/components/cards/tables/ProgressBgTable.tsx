// src/components/cards/tables/ProgressBgTable.tsx

interface UrlItem {
  uri: string
  bounce: number
  visitors: number
}

interface ProgressBgTableProps {
  title?: string
  urls?: UrlItem[]
  limit?: number
}

const defaultUrls: UrlItem[] = [
  { uri: '/home', bounce: 80, visitors: 4823 },
  { uri: '/about', bounce: 62, visitors: 3210 },
  { uri: '/products', bounce: 55, visitors: 2910 },
  { uri: '/blog', bounce: 47, visitors: 2540 },
  { uri: '/contact', bounce: 38, visitors: 1820 },
  { uri: '/pricing', bounce: 71, visitors: 1620 },
  { uri: '/docs', bounce: 29, visitors: 980 },
  { uri: '/careers', bounce: 15, visitors: 430 },
]

import { ProgressBg } from '../../ui/ProgressBg'

export function ProgressBgTable({
  title = 'Top Pages',
  urls = defaultUrls,
  limit = 8,
}: ProgressBgTableProps) {
  const items = urls.slice(0, limit)

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <table className="table table-sm table-borderless">
          <thead>
            <tr>
              <th>Page</th>
              <th className="text-end">Visitors</th>
            </tr>
          </thead>
          <tbody>
            {items.map((url, i) => (
              <tr key={i}>
                <td>
                  <ProgressBg value={url.bounce} text={url.uri} />
                </td>
                <td className="w-1 fw-medium text-end">{url.visitors.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}