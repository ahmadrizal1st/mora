import { useState } from 'react';

interface InvoiceRow {
  id?: string;
  subject: string;
  client: string;
  vatNo?: string;
  date?: string;
  status: string;
  statusColor?: string;
  price: string;
}

interface InvoicesTableCardProps {
  invoices?: InvoiceRow[];
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export function InvoicesTableCard({
  invoices = [
    { id: '001401', subject: 'Logo creation', client: 'Acme Corp', vatNo: 'GB123', date: '2024-01-10', status: 'Paid', statusColor: 'success', price: '$1,800' },
    { id: '001402', subject: 'Web design', client: 'Globe Inc', vatNo: 'US456', date: '2024-01-14', status: 'Pending', statusColor: 'warning', price: '$20,000' },
    { id: '001403', subject: 'App design', client: 'Tech Ltd', vatNo: 'FR789', date: '2024-01-18', status: 'Overdue', statusColor: 'danger', price: '$3,200' },
  ],
  hideHeader,
  hideFooter,
}: InvoicesTableCardProps) {
  const [perPage, setPerPage] = useState('8');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const filtered = invoices.filter(inv =>
    !search || inv.subject.toLowerCase().includes(search.toLowerCase()) || inv.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={hideHeader && hideFooter ? "" : "card"}>
      {!hideHeader && (
        <div className="card-header">
          <h3 className="card-title">Invoices</h3>
        </div>
      )}
      <div className="card-body border-bottom py-2">
        <div className="d-flex flex-row flex-sm-row gap-2 align-items-center">
          <div className="text-secondary text-mobile-xs d-flex align-items-center">
            <span className="d-none d-sm-inline me-1">Show</span>
            <input type="text" className="form-control form-control-sm px-1 text-center" value={perPage}
              onChange={e => setPerPage(e.target.value)} style={{ width: '35px' }} />
            <span className="d-none d-sm-inline ms-1">entries</span>
          </div>
          <div className="ms-auto text-secondary text-mobile-xs d-flex align-items-center">
            <span className="me-1 d-none d-sm-inline">Search:</span>
            <input type="text" className="form-control form-control-sm"
                value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ maxWidth: '100px' }} />
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-selectable card-table table-vcenter text-nowrap">
          <thead>
            <tr className="text-mobile-xs">
              <th className="w-1"><input className="form-check-input m-0" type="checkbox" style={{ borderRadius: '4px' }} /></th>
              <th className="w-1">No.</th>
              <th>Subject</th>
              <th>Client</th>
              <th className="d-none d-md-table-cell">VAT No.</th>
              <th className="d-none d-md-table-cell">Created</th>
              <th className="d-none d-sm-table-cell">Status</th>
              <th>Price</th>
              <th className="d-none d-md-table-cell"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, Number(perPage) || 8).map((inv, i) => (
              <tr key={i} className="text-mobile-xs">
                <td>
                  <input className="form-check-input m-0" type="checkbox"
                    style={{ borderRadius: '4px' }}
                    checked={selected.has(i)}
                    onChange={() => {
                      const next = new Set(selected);
                      next.has(i) ? next.delete(i) : next.add(i);
                      setSelected(next);
                    }} />
                </td>
                <td><span className="text-secondary">{inv.id?.slice(-3)}</span></td>
                <td className="text-truncate" style={{ maxWidth: '100px' }}><a href="#" className="text-reset">{inv.subject}</a></td>
                <td className="text-truncate" style={{ maxWidth: '80px' }}>{inv.client}</td>
                <td className="d-none d-md-table-cell">{inv.vatNo}</td>
                <td className="d-none d-md-table-cell">{inv.date}</td>
                <td className="d-none d-sm-table-cell">
                  <span className={`badge bg-${inv.statusColor} me-1`} />
                  <span className="d-none d-lg-inline">{inv.status}</span>
                </td>
                <td className="fw-bold">{inv.price}</td>
                <td className="text-end d-none d-md-table-cell">
                  <button className="btn btn-sm">Actions</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!hideFooter && (
        <div className="card-footer">
          <div className="row g-2 justify-content-between">
            <div className="col-auto d-flex align-items-center">
              <p className="m-0 text-secondary">
                Showing <strong>1 to {Math.min(filtered.length, Number(perPage) || 8)}</strong> of <strong>{filtered.length} entries</strong>
              </p>
            </div>
            <div className="col-auto">
              <nav>
                <ul className="pagination m-0">
                  <li className="page-item disabled"><a className="page-link" href="#">«</a></li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">»</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
