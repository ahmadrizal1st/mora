// src/components/cards/InvoiceCard.tsx

interface InvoiceItem {
  no: number
  name: string
  description: string
  qty: number
  unit: string
  amount: string
}

interface InvoiceCardProps {
  invoiceNumber?: string
  companyAddress?: React.ReactNode
  clientAddress?: React.ReactNode
  items?: InvoiceItem[]
  subtotal?: string
  vatRate?: string
  vatDue?: string
  total?: string
}

const defaultItems: InvoiceItem[] = [
  { no: 1, name: 'Logo Creation', description: 'Logo and business cards design', qty: 1, unit: '$1.800,00', amount: '$1.800,00' },
  { no: 2, name: 'Online Store Design & Development', description: 'Design/Development for all popular modern browsers', qty: 1, unit: '$20.000,00', amount: '$20.000,00' },
  { no: 3, name: 'App Design', description: 'Promotional mobile application', qty: 1, unit: '$3.200,00', amount: '$3.200,00' },
]

export function InvoiceCard({
  invoiceNumber = 'INV/001/15',
  items = defaultItems,
  subtotal = '$25.000,00',
  vatRate = '20%',
  vatDue = '$5.000,00',
  total = '$30.000,00',
}: InvoiceCardProps) {
  return (
    <div className="card card-lg">
      <div className="card-body">
        <div className="row">
          <div className="col-6">
            <p className="h3">Company</p>
            <address>
              Street Address<br />
              State, City<br />
              Region, Postal Code<br />
              ltd@example.com
            </address>
          </div>
          <div className="col-6 text-end">
            <p className="h3">Client</p>
            <address>
              Street Address<br />
              State, City<br />
              Region, Postal Code<br />
              ctr@example.com
            </address>
          </div>
          <div className="col-12 my-5">
            <h1>Invoice {invoiceNumber}</h1>
          </div>
        </div>

        <table className="table table-transparent table-responsive">
          <thead>
            <tr>
              <th className="text-center" style={{ width: '1%' }} />
              <th>Product</th>
              <th className="text-center" style={{ width: '1%' }}>Qnt</th>
              <th className="text-end" style={{ width: '1%' }}>Unit</th>
              <th className="text-end" style={{ width: '1%' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.no}>
                <td className="text-center">{item.no}</td>
                <td>
                  <p className="strong mb-1">{item.name}</p>
                  <div className="text-secondary">{item.description}</div>
                </td>
                <td className="text-center">{item.qty}</td>
                <td className="text-end">{item.unit}</td>
                <td className="text-end">{item.amount}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="strong text-end">Subtotal</td>
              <td className="text-end">{subtotal}</td>
            </tr>
            <tr>
              <td colSpan={4} className="strong text-end">Vat Rate</td>
              <td className="text-end">{vatRate}</td>
            </tr>
            <tr>
              <td colSpan={4} className="strong text-end">Vat Due</td>
              <td className="text-end">{vatDue}</td>
            </tr>
            <tr>
              <td colSpan={4} className="fw-semibold text-uppercase text-end">Total Due</td>
              <td className="fw-semibold text-end">{total}</td>
            </tr>
          </tbody>
        </table>

        <p className="text-secondary text-center mt-5">
          Thank you very much for doing business with us. We look forward to working with you again!
        </p>
      </div>
    </div>
  )
}