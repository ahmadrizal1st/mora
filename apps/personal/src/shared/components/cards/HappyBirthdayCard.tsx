import { IconGift } from '@tabler/icons-react';

interface HappyBirthdayCardProps {
  name?: string;
  discountCode?: string;
  discountPercent?: number;
  onClaim?: () => void;
}

export function HappyBirthdayCard({
  name = 'Andrew',
  discountCode = 'NWYR20',
  discountPercent = 20,
  onClaim,
}: HappyBirthdayCardProps) {
  return (
    <div className="card card-gradient card-gradient-rainbow">
      <div className="card-body text-center p-5">
        <div className="display-5 leading-none mb-2">🍾 🎉</div>
        <h1>Happy Birthday, {name}!</h1>
        <p className="text-secondary">
          We truly hope your day is brimming with joy, laughter, and countless moments that bring a smile to your face!
        </p>
        <p className="text-secondary">
          To celebrate your special day, here's a discount code just for you:{' '}
          <strong className="text-body">{discountCode}</strong>. Enjoy{' '}
          <strong className="text-body">{discountPercent}% off</strong> your next purchase!
        </p>
        <div className="mt-5">
          <button className="btn btn-primary" onClick={onClaim}>
            <IconGift className="icon me-2" />
            Grab my special deal
          </button>
        </div>
      </div>
    </div>
  );
}
