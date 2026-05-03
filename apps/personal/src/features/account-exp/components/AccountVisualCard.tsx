import { Icon } from '@/shared/components/ui/Icon';

interface AccountVisualCardProps {
  name: string;
  num: string;
  type: string;
  balance: string;
  logo?: string;
  color?: string;
}

export function AccountVisualCard({ name, num, type, balance, logo, color }: AccountVisualCardProps) {
  const isBank = type.toLowerCase().includes('bank');
  const isInvest = ['invest', 'bibit', 'ajaib', 'bareksa'].some(k => type.toLowerCase().includes(k));

  const cardIcon = isBank ? 'building-bank' : isInvest ? 'trending-up' : 'wallet';
  const cardLabel = isBank ? 'Debit Card' : isInvest ? 'Investasi' : 'E-Wallet';

  const bg = color
    ? `linear-gradient(135deg, ${color}ee 0%, ${color}aa 100%)`
    : isBank
    ? 'linear-gradient(135deg, #206bc4 0%, #114a8f 100%)'
    : 'linear-gradient(135deg, #2fb344 0%, #1e7e2f 100%)';

  return (
    <div
      className="card border-0 text-white overflow-hidden shadow-lg mb-3"
      style={{
        background: bg,
        borderRadius: '16px',
        height: '180px',
        position: 'relative',
      }}
    >
      {/* Logo watermark — bottom left */}
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
            filter: 'brightness(0) invert(1)',
            pointerEvents: 'none',
          }}
        />
      ) : (
        /* Fallback decorative icon */
        <div className="position-absolute" style={{ left: '-8px', bottom: '-8px', opacity: 0.12, color: '#fff', pointerEvents: 'none' }}>
          <Icon icon={cardIcon} size={120} />
        </div>
      )}

      {/* Decorative circle — top right */}
      <div className="position-absolute end-0 top-0 opacity-10" style={{ transform: 'translate(20%, -20%)' }}>
        <Icon icon={cardIcon} size={120} />
      </div>

      <div className="card-body d-flex flex-column justify-content-between p-4 position-relative" style={{ zIndex: 1 }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="fs-6 opacity-75 mb-0 text-uppercase fw-semibold" style={{ letterSpacing: '0.08em' }}>
              {cardLabel}
            </div>
            <div className="h3 fw-bold mb-0">{name}</div>
          </div>
          <Icon icon="nfc" size="md" />
        </div>

        <div>
          <div className="font-monospace h2 mb-1">**** **** **** {num.slice(-4)}</div>
          <div className="d-flex justify-content-between align-items-end">
            <div className="h3 fw-bold mb-0 font-monospace">{balance}</div>
            <div className="text-uppercase small fw-bold opacity-75">MORA PAY</div>
          </div>
        </div>
      </div>
    </div>
  );
}
