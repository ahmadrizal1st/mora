export function getContrastYIQ(hexcolor: string) {
  if (!hexcolor || !hexcolor.startsWith('#')) return 'white'
  let hex = hexcolor.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? 'black' : 'white'
}

export function getAccountVisualMeta(accountType?: string, color?: string, logo?: string) {
  const type = (accountType ?? '').toLowerCase()
  const isBank = type.includes('bank')
  const isInvest = ['invest', 'bibit', 'ajaib', 'bareksa', 'reksa'].some((k) => type.includes(k))
  const isCash = type.includes('tunai') || type.includes('cash')

  const icon = isBank ? 'building-bank' : isInvest ? 'trending-up' : isCash ? 'cash' : 'wallet'
  const label = isBank ? 'Debit Card' : isInvest ? 'Investasi' : 'E-Wallet'
  const defaultLogo = isCash ? 'https://cdn-icons-png.flaticon.com/512/2017/2017461.png' : null
  const defaultColor = isCash ? '#2fb344' : '#4263eb'

  return {
    isBank,
    isInvest,
    isCash,
    icon,
    label,
    logo: logo ?? defaultLogo,
    color: color ?? defaultColor,
  }
}
