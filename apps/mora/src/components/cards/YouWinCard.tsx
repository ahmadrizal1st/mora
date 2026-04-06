// src/components/cards/YouWinCard.tsx
import { IconGift } from '@tabler/icons-react';

interface YouWinCardProps {
  ordersCount?: number
  onClaim?: () => void
}

export function YouWinCard({ ordersCount = 100, onClaim }: YouWinCardProps) {
  return (
    <div className="card card-gradient card-gradient-gold">
      <div className="card-body text-center p-5">
        <div className="display-3 leading-none mb-2">🏆</div>
        <h1>You are winner!</h1>
        <p className="text-secondary">
          You've been selected as our lucky winner for completing{' '}
          <strong className="text-body">{ordersCount} orders</strong> this month!
          Click below to claim your exclusive prize and enjoy the benefits!
        </p>
        <div className="mt-5">
          <button className="btn btn-primary" onClick={onClaim}>
            <IconGift className="icon me-2" />
            Grab my special deal
          </button>
        </div>
      </div>
    </div>
  )
}