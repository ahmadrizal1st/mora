interface PricingCardProps {
  category?: string;
  price?: number | string;
  users?: number | string;
  features?: string[];
  availableFeatures?: boolean[];
  featuredColor?: string;
  onChoose?: () => void;
}

export function PricingCard({
  category = 'Enterprise',
  price = 79,
  users = 10,
  features = ['Sharing Tools', 'Design Tools', 'Private Messages', 'Twitter API'],
  availableFeatures = [true, false, true, false],
  featuredColor,
  onChoose,
}: PricingCardProps) {
  return (
    <div className="card card-md">
      {featuredColor && (
        <div className={`ribbon ribbon-top bg-${featuredColor}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24"
            strokeWidth="2" stroke="currentColor" fill="currentColor">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
          </svg>
        </div>
      )}
      <div className="card-body text-center">
        <div className="text-uppercase text-secondary fw-medium">{category}</div>
        <div className="display-5 fw-bold my-3">${price}</div>
        <ul className="list-unstyled lh-lg">
          <li><strong>{users}</strong> Users</li>
          {features.map((f, i) => (
            <li key={i}>
              {availableFeatures[i]
                ? <svg xmlns="http://www.w3.org/2000/svg" className="icon me-1 text-success" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l5 5l10 -10" /></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" className="icon me-1 text-danger" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              }
              {f}
            </li>
          ))}
        </ul>
        <div className="text-center mt-4">
          <button
            className={`btn${featuredColor ? ` btn-${featuredColor}` : ''} w-100`}
            onClick={onChoose}
          >
            Choose plan
          </button>
        </div>
      </div>
    </div>
  );
}
