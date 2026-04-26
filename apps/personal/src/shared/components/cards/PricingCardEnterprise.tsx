interface PricingCardEnterpriseProps {
  title?: string;
  description?: string;
  onBook?: () => void;
}

export function PricingCardEnterprise({
  title = 'Enterprise-ready. Reach out for a custom quote.',
  description = 'Tabler is designed to work great for large enterprises. Take a look at our feature comparison.',
  onBook,
}: PricingCardEnterpriseProps) {
  return (
    <div className="card card-md">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="h3">{title}</h2>
            <p className="m-0 text-secondary">{description}</p>
          </div>
          <div className="col-auto">
            <button className="btn" onClick={onBook}>Book a demo</button>
          </div>
        </div>
      </div>
    </div>
  );
}
