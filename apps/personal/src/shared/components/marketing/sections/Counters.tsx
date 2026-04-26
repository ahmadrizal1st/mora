// src/components/marketing/sections/Counters.tsx

interface CountersProps {
  background?: string;
  className?: string;
}

const stats = [
  { value: '48', label: 'templates' },
  { value: '12', label: 'years in business' },
  { value: '2,5k+', label: 'copies sold' },
  { value: '99%', label: 'happy customers' },
];

export function Counters({ background, className = '' }: CountersProps) {
  const sectionClass = ['section', background ? `section-${background}` : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={sectionClass}>
      <div className="container">
        <div className="row justify-content-lg-center">
          {stats.map(({ value, label }) => (
            <div className="col-sm-6 col-lg-3" key={label}>
              <div className="text-center">
                <h2 className="display-5 m-0 fw-bold">{value}</h2>
                <p className="text-secondary m-0">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Counters;
