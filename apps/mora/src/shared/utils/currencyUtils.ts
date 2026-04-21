/**
 * Formats a numeric value into a currency string (IDR by default).
 * @param amount The numeric value to format
 * @param currencyCode The currency code (default: 'IDR')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode = 'IDR') => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(amount);
};
