import { Icon } from '@/shared/components/ui/Icon'

interface AccountVisualCardProps {
  name: string
  num: string
  type: string
  balance: string
  logo?: string
  color?: string
  onEdit?: () => void
  onDelete?: () => void
}

function getContrastYIQ(hexcolor: string) {
  if (!hexcolor || !hexcolor.startsWith('#')) return 'text-white'
  let hex = hexcolor.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? 'text-dark' : 'text-white'
}

export function AccountVisualCard({
  name,
  num,
  type,
  balance,
  logo,
  color,
  onEdit,
  onDelete,
}: AccountVisualCardProps) {
  const isBank = type.toLowerCase().includes('bank')
  const isInvest = ['invest', 'bibit', 'ajaib', 'bareksa'].some((k) =>
    type.toLowerCase().includes(k)
  )

  const cardIcon = isBank ? 'building-bank' : isInvest ? 'trending-up' : 'wallet'
  const cardLabel = isBank ? 'Debit Card' : isInvest ? 'Investasi' : 'E-Wallet'

  const isHex = color?.startsWith('#')
  const textColorClass = isHex ? getContrastYIQ(color!) : 'text-white'
  const isDarkText = textColorClass === 'text-dark'

  const bgStyle = color
    ? {
        backgroundColor: isHex ? color : `var(--tblr-${color})`,
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.2) 100%)',
      }
    : {
        backgroundImage: isBank
          ? 'linear-gradient(135deg, #206bc4 0%, #114a8f 100%)'
          : 'linear-gradient(135deg, #2fb344 0%, #1e7e2f 100%)',
      }

  return (
    <div
      className={`card border-0 ${textColorClass} overflow-hidden shadow-lg`}
      style={{
        ...bgStyle,
        borderRadius: '16px',
        height: '180px',
        position: 'relative',
      }}
    >
      {logo ? (
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-1px',
            bottom: '40px',
            width: '120px',
            height: '120px',
            objectFit: 'contain',
            opacity: 0.15,
            filter: isDarkText ? 'brightness(0)' : 'brightness(0) invert(1)',
            pointerEvents: 'none',
          }}
        />
      ) : (
        <div
          className="position-absolute"
          style={{
            left: '-8px',
            bottom: '-8px',
            opacity: 0.12,
            color: isDarkText ? '#000' : '#fff',
            pointerEvents: 'none',
          }}
        >
          <Icon icon={cardIcon} size={120} />
        </div>
      )}

      <div
        className="position-absolute end-0 top-0 opacity-10"
        style={{ transform: 'translate(20%, -20%)', color: isDarkText ? '#000' : 'inherit' }}
      >
        <Icon icon={cardIcon} size={120} />
      </div>

      <div
        className="card-body d-flex flex-column justify-content-between p-4 position-relative"
        style={{ zIndex: 1 }}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div
              className={`fs-6 mb-0 text-uppercase fw-semibold ${isDarkText ? 'opacity-75' : 'opacity-75'}`}
              style={{ letterSpacing: '0.08em' }}
            >
              {cardLabel}
            </div>
            <div className="h3 fw-bold mb-0">{name}</div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Icon icon="nfc" size="md" />
            {(onEdit || onDelete) && (
              <div className="dropdown">
                <a
                  href="#"
                  className={`btn-action dropdown-toggle ${isDarkText ? 'text-dark' : 'text-white'}`}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ opacity: 0.8 }}
                >
                  <Icon icon="dots-vertical" size="sm" />
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  {onEdit && (
                    <button className="dropdown-item" onClick={onEdit}>
                      <Icon icon="pencil" className="me-2 text-secondary" size="sm" />
                      Edit Akun
                    </button>
                  )}
                  {onDelete && (
                    <button className="dropdown-item text-danger" onClick={onDelete}>
                      <Icon icon="trash" className="me-2 text-danger" size="sm" />
                      Hapus Akun
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="font-monospace h2 mb-1">**** **** **** {num.slice(-4)}</div>
          <div className="d-flex justify-content-between align-items-end">
            <div className="h3 fw-bold mb-0 font-monospace">{balance}</div>
            <div className={`text-uppercase small fw-bold ${isDarkText ? 'opacity-75' : 'opacity-75'}`}>MORA PAY</div>
          </div>
        </div>
      </div>
    </div>
  )
}
