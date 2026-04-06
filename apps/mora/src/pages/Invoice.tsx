// src/pages/Invoice.tsx
import BaseLayout from '../layouts/BaseLayout'
import { InvoiceCard } from '../components/cards/InvoiceCard'

export default function Invoice() {
  return (
    <BaseLayout pageTitle="Invoice">
      <InvoiceCard />
    </BaseLayout>
  )
}