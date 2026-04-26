// src/components/marketing/sections/Testimonials.tsx

interface TestimonialsProps {
  background?: string;
  className?: string;
  limit?: number;
  hideHeader?: boolean;
}

const testimonials = [
  "Ever since I started using Tabler, my HTML designing process has been significantly smoother. Its intuitive interface is a breath of fresh air!",
  "I'm beyond impressed with Tabler. This UI kit has transformed my workflow for the better. It's easy to use, streamlined, and remarkably efficient.",
  "Tabler's feature-rich package has drastically improved my website design process. It's an absolute game-changer in the UI kit landscape.",
  "Having used many UI kits in the past, I can confidently say that Tabler stands out. The level of customization it offers is unparalleled.",
  "What I love about Tabler is its sleek design and ease of use. It's really simplified my HTML designing work. Five stars from me!",
  "I'd recommend Tabler to anyone, whether they're a seasoned pro or a beginner in HTML design. Its versatility and user-friendly nature make it a cut above the rest.",
  "Navigating through Tabler has been a breeze! Its intuitive layout helps me save time and focus more on the creative aspect of my work.",
  "With Tabler, designing HTML has never been more straightforward. The kit's sleek features and functionalities have taken my design work to new heights.",
  "Tabler has revolutionized the way I approach HTML design. Its array of tools and efficient interface make it a must-have for any designer.",
  "I'm truly amazed by Tabler's capabilities. It's not just an HTML UI kit, it's a design powerhouse that has made my work a lot more efficient and enjoyable.",
  "As a web developer, Tabler has revolutionized my workflow. The HTML UI kit is exceptionally well-structured, making my projects much more efficient and visually appealing.",
  "Tabler has transformed the way I approach web design. It's intuitive, easy to use, and has saved me countless hours of coding from scratch. A real game-changer!",
  "The breadth of design options that Tabler provides is astounding. It has added a whole new level of professionalism to my websites and made my job a lot easier.",
  "I've been in the web development industry for years and I must say, Tabler is one of the best HTML UI kits I've come across. It's user-friendly and allows for a high degree of customization.",
  "Since I've started using Tabler, I've noticed a significant improvement in my work. It's streamlined, efficient, and helps me produce better results for my clients.",
  "Using Tabler has been a fantastic experience. The number of components it offers has allowed me to design more efficiently, and its consistent updates ensure that it always stays ahead of the curve.",
  "Tabler is a web designer's dream come true. The HTML UI kit offers so many features and functionalities that make my design process more streamlined and efficient.",
  "I cannot recommend Tabler enough! This HTML UI kit is a must-have for any web developer looking to level up their design game.",
  "From a beginner's perspective, Tabler has been a lifesaver. It has enabled me to create professional-quality websites without needing advanced coding skills.",
  "Tabler offers the perfect balance of simplicity and sophistication. It has greatly improved my workflow and I can't imagine working on web development projects without it.",
];

// Sample people for testimonials
const people = [
  { full_name: 'Alice Martin', job_title: 'Frontend Developer', photo: '/static/avatars/001f.jpg' },
  { full_name: 'Bob Chen', job_title: 'UI Designer', photo: '/static/avatars/001m.jpg' },
  { full_name: 'Clara Diaz', job_title: 'Product Manager', photo: '/static/avatars/002f.jpg' },
  { full_name: 'David Kim', job_title: 'Full Stack Engineer', photo: '/static/avatars/002m.jpg' },
  { full_name: 'Eva Müller', job_title: 'UX Researcher', photo: '/static/avatars/003f.jpg' },
  { full_name: 'Frank Osei', job_title: 'Backend Developer', photo: '/static/avatars/003m.jpg' },
  { full_name: 'Grace Lin', job_title: 'Web Developer', photo: '/static/avatars/004f.jpg' },
  { full_name: 'Henry Park', job_title: 'Software Engineer', photo: '/static/avatars/004m.jpg' },
  { full_name: 'Iris Novak', job_title: 'Designer', photo: '/static/avatars/005f.jpg' },
  { full_name: 'James Okafor', job_title: 'Tech Lead', photo: '/static/avatars/005m.jpg' },
];

function splitIntoColumns<T>(arr: T[], cols: number): T[][] {
  const result: T[][] = Array.from({ length: cols }, () => []);
  arr.forEach((item, i) => result[i % cols].push(item));
  return result;
}

export function Testimonials({
  background,
  className = '',
  limit = 99,
  hideHeader = false,
}: TestimonialsProps) {
  const sectionClass = ['section', background ? `section-${background}` : '', className]
    .filter(Boolean)
    .join(' ');

  const limited = testimonials.slice(0, limit);
  const columns = splitIntoColumns(limited, 3);

  return (
    <section className={sectionClass}>
      <div className="container">
        {!hideHeader && (
          <div className="section-header">
            <h2 className="section-title">Trusted by hundreds</h2>
            <p className="section-description">
              Our Users send us bunch of smilies with our services, and we love them 😍
            </p>
          </div>
        )}
        <div className="row g-lg-6">
          {columns.map((group, colIdx) => (
            <div className="col-md-6 col-lg-4" key={colIdx}>
              <div className="row g-lg-6">
                {group.map((text, idx) => {
                  const person = people[(colIdx * group.length + idx) % people.length];
                  return (
                    <div className="col-12" key={idx}>
                      <a href="#" className="card bg-surface-secondary">
                        <div className="card-body">
                          <div className="row mb-3">
                            <div className="col-auto">
                              <span
                                className="avatar avatar-md"
                                style={{
                                  backgroundImage: `url(/${person.photo})`,
                                }}
                              />
                            </div>
                            <div className="col">
                              <h3 className="h3 m-0">{person.full_name}</h3>
                              <div className="text-secondary">{person.job_title}</div>
                            </div>
                          </div>
                          <p>{text}</p>
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
