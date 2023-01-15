export function currencyFormatter(): Intl.NumberFormat {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'KZT',
    currencyDisplay: 'narrowSymbol',
    // minimumFractionDigits: 0
  })
}