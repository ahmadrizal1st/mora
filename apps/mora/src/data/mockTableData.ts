import type { Person } from '../types'
import type { AdvancedTableHeader } from '../components/ui/AdvancedTable'

export const defaultHeaders: AdvancedTableHeader[] = [
  { name: 'Name', dataSort: 'sort-name' },
  { name: 'Location', dataSort: 'sort-content' },
  { name: 'Status', dataSort: 'sort-status' },
  { name: 'Date', dataSort: 'sort-date' },
  { name: 'Tags', dataSort: 'sort-tags' },
  { name: 'Category', dataSort: 'sort-category' },
]

export const defaultPeople: Person[] = Array.from({ length: 20 }, (_, i) => {
  const isMale = i % 2 === 0
  const photoNum = Math.floor(i / 2).toString().padStart(3, '0')
  const photo = `${photoNum}${isMale ? 'm' : 'f'}.jpg`

  return {
    id: i + 1,
    full_name: [
      'Alice Smith', 'Bob Jones', 'Carol White', 'Dave Brown', 'Eve Davis',
      'Frank Miller', 'Grace Wilson', 'Hank Moore', 'Iris Taylor', 'Jake Anderson',
      'Kate Thomas', 'Liam Jackson', 'Mia Harris', 'Noah Martin', 'Olivia Garcia',
      'Paul Martinez', 'Quinn Robinson', 'Rita Clark', 'Sam Rodriguez', 'Tina Lewis',
    ][i],
    city: ['New York', 'London', 'Paris', 'Tokyo', 'Sydney'][i % 5],
    country: ['US', 'UK', 'FR', 'JP', 'AU'][i % 5],
    status: (['Active', 'Inactive', 'Requested'] as const)[i % 3],
    date: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }),
    tags: [['QTA', 'Event', 'Tickets'], ['Event', 'Tickets'], ['QTA', 'Event'], ['Tickets']][i % 4],
    category: ['Agencies', 'Individual', 'Event', 'Ticket'][i % 4],
    photo,
  }
})
