// src/pages/Datatables.tsx
// Converted from preview/pages/datatables.html
//
// The original used tabler-list.js for client-side sorting.
// Here we replace it with a fully React-controlled sortable table.

import { useState, useMemo } from 'react'
import BaseLayout from '../layouts/BaseLayout'
import { Progress } from '../components/ui/Progress'
import rollercoasters from '../data/rollercoasters.json'

interface Rollercoaster {
  name: string
  diff: number | string
  city: string
  type: string
  score: string
  ratings: number
  tops: number
}

// ── Deterministic pseudo-random helpers ────────────────────────────────────
// Mirrors Liquid's `random_number` and `random_date` filters.
// Using index as seed so values are stable across renders.

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

function randomProgress(index: number): number {
  return Math.round(seededRandom(index) * 100)
}

function randomQuantity(index: number, min = 1, max = 200): number {
  return min + Math.round(seededRandom(index + 100) * (max - min))
}

function randomDate(index: number): Date {
  const base = new Date('2023-01-01').getTime()
  const range = 365 * 24 * 60 * 60 * 1000
  return new Date(base + Math.round(seededRandom(index + 200) * range))
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })
}

// ── Types ───────────────────────────────────────────────────────────────────

type SortKey = 'name' | 'city' | 'type' | 'score' | 'date' | 'quantity' | 'progress'
type SortDir = 'asc' | 'desc'

interface Row extends Rollercoaster {
  progress: number
  quantity: number
  date: Date
}

// ── Component ───────────────────────────────────────────────────────────────

export default function Datatables() {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const rows: Row[] = rollercoasters.map((rc, i) => ({
    ...rc,
    progress: randomProgress(i),
    quantity: randomQuantity(i),
    date: randomDate(i),
  }))

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      let av: string | number
      let bv: string | number

      switch (sortKey) {
        case 'name': av = a.name; bv = b.name; break
        case 'city': av = a.city; bv = b.city; break
        case 'type': av = a.type; bv = b.type; break
        case 'score': av = a.score; bv = b.score; break
        case 'date': av = a.date.getTime(); bv = b.date.getTime(); break
        case 'quantity': av = a.quantity; bv = b.quantity; break
        case 'progress': av = a.progress; bv = b.progress; break
        default: av = ''; bv = ''
      }

      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [rows, sortKey, sortDir])

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return null
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  const cols: { label: string; key: SortKey }[] = [
    { label: 'Name', key: 'name' },
    { label: 'City', key: 'city' },
    { label: 'Type', key: 'type' },
    { label: 'Score', key: 'score' },
    { label: 'Date', key: 'date' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Progress', key: 'progress' },
  ]

  return (
    <BaseLayout pageTitle="Datatables">
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {cols.map(col => (
                    <th key={col.key}>
                      <button
                        className="table-sort"
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}{sortIcon(col.key)}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((row, i) => (
                  <tr key={i}>
                    <td>{row.name}</td>
                    <td>{row.city}</td>
                    <td>{row.type}</td>
                    <td>{row.score}</td>
                    <td>{formatDate(row.date)}</td>
                    <td>{row.quantity}</td>
                    <td>
                      <div className="row align-items-center">
                        <div className="col-12 col-lg-auto">{row.progress}%</div>
                        <div className="col">
                          <Progress value={row.progress} width="5rem" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
