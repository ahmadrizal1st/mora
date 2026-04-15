interface PricingPlanFeature {
  text: string;
  available: boolean;
  label?: string;
}

interface PricingPlanProps {
  tier?: string;
  price?: string;
  period?: string;
  color?: string;
  features?: PricingPlanFeature[];
  description?: string;
  onPurchase?: () => void;
}

export function PricingPlan({
  tier = 'Professional',
  price = '$199',
  period = '/ month',
  color = 'pink',
  features = [
    { text: 'Target Audience', label: 'Unlimited', available: true },
    { text: 'User Account', label: '1', available: true },
    { text: 'Video Tuts', label: '100+', available: true },
    { text: 'Public Displays', available: false },
  ],
  description = 'This plan is perfect for small businesses and startups.',
  onPurchase,
}: PricingPlanProps) {
  return (
    <div className="card card-gradient card-gradient-love">
      <div className={`ribbon bg-${color}`}>Featured</div>
      <div className="card-body">
        <div className={`h-subheader text-${color}`}>{tier}</div>
        <div className="d-flex align-items-baseline mt-5">
          <div className="display-5">{price}</div>
          <div className="fs-1 text-secondary">{period}</div>
        </div>
        <ul className="list-unstyled mt-6 space-y space-y-2">
          {features.map((f, i) => (
            <li key={i} className="d-flex gap-2">
              <div>
                {f.available
                  ? <svg xmlns="http://www.w3.org/2000/svg" className="icon text-success" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l5 5l10 -10" /></svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" className="icon text-secondary" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                }
              </div>
              <div className={!f.available ? 'text-secondary' : ''}>
                {f.label && <strong>{f.label} </strong>}
                {f.text}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-muted">{description}</p>
        <div className="mt-6">
          <button className={`btn btn-${color} w-100`} onClick={onPurchase}>Purchase Now</button>
        </div>
      </div>
    </div>
  );
}
