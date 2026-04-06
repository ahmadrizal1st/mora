// src/components/marketing/sections/Features2.tsx
import SectionDivider from '../SectionDivider';
import Shape from '../../ui/Shape';

interface Features2Props {
  background?: string;
  className?: string;
  divider?: 'waves' | 'arc';
}

export function Features2({ background, className = '', divider }: Features2Props) {
  const sectionClass = ['section', background ? `section-${background}` : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={sectionClass}>
      <SectionDivider divider={divider} />
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Everything you need to deploy your app</h2>
          <div className="section-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua.
          </div>
        </div>
        <div className="row g-lg-10">
          <div className="col-lg-6 mb-3 mb-lg-0">
            <svg
              width={500}
              height={400}
              className="img-fluid border rounded"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="100%" height="100%" fill="#f0f0f0" />
              <text x="50%" y="50%" textAnchor="middle" fill="#aaa" fontSize="18">
                Preview Image
              </text>
            </svg>
          </div>
          <div className="col-lg-6">
            <div className="space-y-6">
              {[
                {
                  icon: 'tools',
                  title: 'Designed with users in mind',
                  text: 'Tabler is fully responsive and compatible with all modern browsers. Thanks to its modern, user-friendly design you can create a fully functional interface that users will love. Every UI element has been created with attention to detail to make your interface beautiful!',
                },
                {
                  icon: 'brand-bootstrap',
                  title: 'Built for developers',
                  text: 'Having in mind what it takes to write high-quality code, we want to help you speed up the development process and keep your code clean. Based on Bootstrap 5, Tabler is a cutting-edge solution, compatible with all modern browsers and fully responsive.',
                },
                {
                  icon: 'paint',
                  title: 'Fully customizable',
                  text: "You can easily customize the UI elements to make them fit the needs of your project. And don't worry if you don't have much experience - Tabler is easy to get started!",
                },
              ].map(({ icon, title, text }) => (
                <div key={title}>
                  <div className="row">
                    <div className="col-auto">
                      <Shape icon={icon} size="md" />
                    </div>
                    <div className="col">
                      <h3 className="h2 mb-2">{title}</h3>
                      <p className="text-secondary m-0">{text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features2;
