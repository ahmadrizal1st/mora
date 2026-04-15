// src/components/marketing/sections/Cta.tsx
import { IconChevronRight } from '@tabler/icons-react';

interface CtaProps {
  background?: string;
  className?: string;
}

export function Cta({ background, className = '' }: CtaProps) {
  const sectionClass = ['section', background ? `section-${background}` : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={sectionClass}>
      <div className="container-narrow text-center">
        <h3 className="h1">
          Enhance your efficiency with our application,
          <br />
          available for use immediately.
        </h3>
        <p className="text-secondary">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, ipsa? Voluptates sunt, ipsum
          esse quis obcaecati atque placeat consectetur beatae, tenetur ducimus iure minima expedita
          recusandae doloribus nam. Pariatur, facilis?
        </p>
        <div className="btn-list justify-content-center mt-6">
          <a href="#" className="btn btn-primary">
            Get started
          </a>
          <a href="#" className="btn btn-ghost-secondary">
            Learn more <IconChevronRight size={16} className="ms-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Cta;
