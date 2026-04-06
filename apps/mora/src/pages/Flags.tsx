// src/pages/Flags.tsx
import BaseLayout from '../layouts/BaseLayout';
import flags from '../data/flags.json';

export default function Flags() {
  return (
    <BaseLayout pageTitle="Flags" pagePretitle="Flags">
      <div className="card">
        <div className="card-header">
          <div className="card-title">List of all flags</div>
        </div>
        <div className="card-body p-0">
          <div className="demo-icons-list-wrap">
            <div className="demo-icons-list">
              {flags.map((country) => (
                <span
                  key={country.flag}
                  className="demo-icons-list-item"
                  title={country.name}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                >
                  <span className={`flag flag-country-${country.flag.toLowerCase()}`} />
                </span>
              ))}
              {/* Spacer items for grid alignment */}
              {Array.from({ length: 21 }, (_, i) => (
                <div key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
