// src/components/cards/InvoicesCard.tsx
import { useState } from 'react'
import { Icon } from '../ui/Icon'
import { Flag } from '../ui/Flag'
import { DropdownMenu } from '../ui/DropdownMenu'

interface Invoice {
  name: string
  country: string
  client: string
  'vat-no'?: string | number
  vatNo?: string
  date: string
  status: string
  'status-name'?: string
  statusName?: string
  price: string
}

const DEFAULT_INVOICES: Invoice[] = [
  { name: 'Logo Creation', country: 'us', client: 'Carlson Limited', vatNo: '87956621', date: '15 Dec 2017', status: 'success', statusName: 'Paid', price: '$887,00' },
  { name: 'Online Store Design & Development', country: 'gb', client: 'Adobe', vatNo: '87956621', date: '12 Apr 2017', status: 'warning', statusName: 'Pending', price: '$1.200,00' },
  { name: 'App Design', country: 'de', client: 'Bluewolf', vatNo: '87956621', date: '23 Oct 2017', status: 'warning', statusName: 'Pending', price: '$534,00' },
  { name: 'Design Logos', country: 'br', client: 'Salesforce', vatNo: '87956621', date: '2 Sep 2017', status: 'success', statusName: 'Paid', price: '$478,00' },
  { name: 'Promotion Campaign', country: 'fr', client: 'Copywriter', vatNo: '87956621', date: '29 Jan 2018', status: 'success', statusName: 'Paid', price: '$3.500,00' },
  { name: 'Packaging Design', country: 'us', client: 'Apple', vatNo: '87956621', date: '10 Feb 2018', status: 'danger', statusName: 'Overdue', price: '$2.100,00' },
  { name: 'Brand Identity', country: 'es', client: 'Zara', vatNo: '87956621', date: '15 Mar 2018', status: 'success', statusName: 'Paid', price: '$1.800,00' },
  { name: 'Consulting', country: 'it', client: 'Eni', vatNo: '87956621', date: '20 Apr 2018', status: 'warning', statusName: 'Pending', price: '$5.000,00' },
  { name: 'Web Design', country: 'jp', client: 'Toyota', vatNo: '87956621', date: '25 May 2018', status: 'success', statusName: 'Paid', price: '$2.500,00' },
  { name: 'Social Media Management', country: 'cn', client: 'Tencent', vatNo: '87956621', date: '30 Jun 2018', status: 'success', statusName: 'Paid', price: '$4.200,00' },
  { name: 'SEO Optimization', country: 'in', client: 'Reliance', vatNo: '87956621', date: '15 Jul 2018', status: 'warning', statusName: 'Pending', price: '$1.200,00' },
  { name: 'Content Marketing', country: 'kr', client: 'Samsung', vatNo: '87956621', date: '20 Aug 2018', status: 'success', statusName: 'Paid', price: '$3.000,00' },
  { name: 'Email Marketing', country: 'ru', client: 'Gazprom', vatNo: '87956621', date: '25 Sep 2018', status: 'danger', statusName: 'Overdue', price: '$1.500,00' },
  { name: 'PPC Campaign', country: 'ca', client: 'Shopify', vatNo: '87956621', date: '30 Oct 2018', status: 'success', statusName: 'Paid', price: '$2.800,00' },
  { name: 'Influencer Marketing', country: 'au', client: 'Atlassian', vatNo: '87956621', date: '15 Nov 2018', status: 'warning', statusName: 'Pending', price: '$4.500,00' },
  { name: 'Video Production', country: 'mx', client: 'Bimbo', vatNo: '87956621', date: '20 Dec 2018', status: 'success', statusName: 'Paid', price: '$6.000,00' },
]

function ActionsDropdown() {
  return <DropdownMenu right />
}

import { Pagination as UIPagination } from '../ui/Pagination'

export function InvoicesCard({
  invoices = DEFAULT_INVOICES,
  limit: initialLimit = 8,
}: {
  invoices?: Invoice[]
  limit?: number
}) {
  const [showCount, setShowCount] = useState(initialLimit.toString())
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.toLowerCase().includes(search.toLowerCase())
  )

  const limitNum = parseInt(showCount) || 8
  const totalPages = Math.ceil(filteredInvoices.length / limitNum)
  const displayInvoices = filteredInvoices.slice((page - 1) * limitNum, page * limitNum)

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Invoices</h3>
      </div>

      <div className="card-body border-bottom py-3">
        <div className="d-flex">
          <div className="text-secondary">
            Show
            <div className="mx-2 d-inline-block">
              <input
                type="text"
                className="form-control form-control-sm"
                value={showCount}
                onChange={(e) => {
                  setShowCount(e.target.value)
                  setPage(1)
                }}
                size={3}
                aria-label="Invoices count"
              />
            </div>
            entries
          </div>
          <div className="ms-auto text-secondary">
            Search:
            <div className="ms-2 d-inline-block">
              <input
                type="text"
                className="form-control form-control-sm"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                aria-label="Search invoice"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-selectable card-table table-vcenter text-nowrap datatable">
          <thead>
            <tr>
              <th className="w-1">
                <input
                  className="form-check-input m-0 align-middle"
                  type="checkbox"
                  aria-label="Select all invoices"
                />
              </th>
              <th className="w-1">
                No. <Icon icon="chevron-up" className="icon-sm icon-thick" />
              </th>
              <th>Invoice Subject</th>
              <th>Client</th>
              <th>VAT No.</th>
              <th>Created</th>
              <th>Status</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayInvoices.map((invoice, index) => {
              const displayIndex = (page - 1) * limitNum + index
              return (
                <tr key={displayIndex}>
                  <td>
                    <input
                      className="form-check-input m-0 align-middle table-selectable-check"
                      type="checkbox"
                      aria-label="Select invoice"
                    />
                  </td>
                  <td>
                    <span className="text-secondary">00{displayIndex + 1401}</span>
                  </td>
                  <td>
                    <a href="invoice.html" className="text-reset" tabIndex={-1}>
                      {invoice.name}
                    </a>
                  </td>
                  <td>
                    <Flag flag={invoice.country} size="xs" className="me-2" />
                    {invoice.client}
                  </td>
                  <td>{invoice['vat-no'] || invoice.vatNo}</td>
                  <td>{invoice.date}</td>
                  <td>
                    <span className={`badge bg-${invoice.status} me-1`}></span>
                    {invoice['status-name'] || invoice.statusName}
                  </td>
                  <td>{invoice.price}</td>
                  <td className="text-end">
                    <ActionsDropdown />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="card-footer">
        <div className="row g-2 justify-content-center justify-content-sm-between">
          <div className="col-auto d-flex align-items-center">
            <p className="m-0 text-secondary">
              Showing <strong>{(page - 1) * limitNum + 1} to {Math.min(page * limitNum, filteredInvoices.length)}</strong> of <strong>{filteredInvoices.length} entries</strong>
            </p>
          </div>
          <div className="col-auto">
            <UIPagination
              count={totalPages}
              activeItem={page}
              onPageChange={(p) => setPage(p)}
              className="m-0 ms-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}