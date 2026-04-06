// src/components/marketing/sections/Features.tsx
import SectionDivider from '../SectionDivider';
import Shape from '../../ui/Shape';

interface SectionProps {
  background?: string;
  className?: string;
  divider?: 'waves' | 'arc';
}

export function Features({ background, className = '', divider }: SectionProps) {
  const sectionClass = ['section', background ? `section-${background}` : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={sectionClass}>
      <SectionDivider divider={divider} />
      <div className="container">
        <div className="row items-center text-center g-lg-10">
          <div className="col-md-6 col-lg">
            <Shape icon="devices" className="mb-3" size="md" />
            <h2 className="h2">Mobile-optimized</h2>
            <p className="text-secondary">
              Our email templates are fully responsive, so you can be sure they will look great on any
              device and screen size.
            </p>
          </div>
          <div className="col-md-6 col-lg">
            <Shape icon="mailbox" className="mb-3" size="md" />
            <h2 className="h2">Compatible with 90+ email clients</h2>
            <p className="text-secondary">
              Tested across 90+ email clients and devices, Tabler emails will help you make your email
              communication professional and reliable.
            </p>
          </div>
          <div className="col-md-6 col-lg">
            <Shape icon="palette" className="mb-3" size="md" />
            <h2 className="h2">Unique, minimal design</h2>
            <p className="text-secondary">
              Draw recipients' attention with beautiful, minimal email designs based on Bootstrap and
              Material Design principles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
