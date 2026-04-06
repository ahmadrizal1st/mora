// src/components/marketing/sections/Faq2.tsx

interface Faq2Props {
  background?: string;
  className?: string;
}

const faqs = [
  {
    question: 'Can I use Tabler in commercial projects?',
    answer:
      'Of course! Tabler is under MIT license, so you can confidently use it in commercial projects. However, remember to include a note that your project uses Tabler.',
  },
  {
    question: 'How do I get notified of new Tabler versions?',
    answer: 'You may watch the releases on GitHub or follow me on Twitter.',
  },
  {
    question: 'Can Tabler be used with WordPress?',
    answer:
      'Tabler is an HTML template that can be used for any purpose. However, it is not made to be easily installed on WordPress. It will require some effort and enough knowledge of the WordPress script to do so.',
  },
];

export function Faq2({ background, className = '' }: Faq2Props) {
  const sectionClass = ['section', background ? `section-${background}` : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={sectionClass}>
      <div className="container">
        <div className="row g-xl-6">
          <div className="col-lg-4">
            <div className="section-header text-start sticky-top">
              <div className="section-title">Frequently asked questions</div>
              <p className="section-description">
                Can't find the answer you're looking for? Reach out to our customer support team.
              </p>
            </div>
          </div>
          <div className="col-lg">
            <div className="space-y-5">
              {faqs.map(({ question, answer }) => (
                <div key={question}>
                  <div className="h3 mb-1">{question}</div>
                  <div className="text-secondary">{answer}</div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <a className="btn" href="#">
                Read more questions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Faq2;
