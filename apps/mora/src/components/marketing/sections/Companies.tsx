// src/components/marketing/sections/Companies.tsx
import SectionDivider from '../SectionDivider';

interface CompaniesProps {
  background?: string;
  className?: string;
  divider?: 'waves' | 'arc';
}

// Inline SVG brand logos as React components
function Baremetrics() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 120 28" fill="currentColor">
      <text y="22" fontSize="20" fontWeight="bold">Baremetrics</text>
    </svg>
  );
}
function Cgi() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 60 28" fill="currentColor">
      <text y="22" fontSize="20" fontWeight="bold">CGI</text>
    </svg>
  );
}
function Docplanner() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 130 28" fill="currentColor">
      <text y="22" fontSize="20" fontWeight="bold">Docplanner</text>
    </svg>
  );
}
function Flow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 60 28" fill="currentColor">
      <text y="22" fontSize="20" fontWeight="bold">Flow</text>
    </svg>
  );
}
function Fubotv() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 80 28" fill="currentColor">
      <text y="22" fontSize="20" fontWeight="bold">fuboTV</text>
    </svg>
  );
}
function SixFlags() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 100 28" fill="currentColor">
      <text y="22" fontSize="20" fontWeight="bold">Six Flags</text>
    </svg>
  );
}
function Vocus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 70 28" fill="currentColor">
      <text y="22" fontSize="20" fontWeight="bold">Vocus</text>
    </svg>
  );
}

const brands = [
  { name: 'Baremetrics', Component: Baremetrics },
  { name: 'CGI', Component: Cgi },
  { name: 'Docplanner', Component: Docplanner },
  { name: 'Flow', Component: Flow },
  { name: 'fuboTV', Component: Fubotv },
  { name: 'Six Flags', Component: SixFlags },
  { name: 'Vocus', Component: Vocus },
];

export function Companies({ background, className = '', divider }: CompaniesProps) {
  const sectionClass = [
    'section',
    background ? `section-${background}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={sectionClass}>
      <SectionDivider divider={divider} />
      <div className="container">
        <div className="section-header mb-6">
          <h2 className="section-title text-secondary">Trusted by over 3,000 companies</h2>
        </div>
        <div className="row g-lg-8 align-items-center justify-content-center">
          {brands.map(({ name, Component }) => (
            <div className="col-auto" key={name}>
              <a href="#" className="link-secondary" aria-label={name}>
                <Component />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Companies;
