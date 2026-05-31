export const formatCurrency = (amount: number, currencyCode = 'IDR') => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(amount)
}
