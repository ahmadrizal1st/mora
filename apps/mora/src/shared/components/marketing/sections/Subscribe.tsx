// src/components/marketing/sections/Subscribe.tsx
import { IconMail } from '@tabler/icons-react';
import { useState } from 'react';

interface SubscribeProps {
  background?: string;
  className?: string;
}

export function Subscribe({ background, className = '' }: SubscribeProps) {
  const [email, setEmail] = useState('');

  const sectionClass = ['section', background ? `section-${background}` : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={sectionClass}>
      <div className="container">
        <div className="section-header mb-6">
          <h2 className="section-title">Subscribe on our newsletter</h2>
          <p className="section-description">
            Get daily news on upcoming offers from many suppliers all over the world
          </p>
        </div>
      </div>
      <div className="container-tight">
        <div className="row">
          <div className="col">
            <input
              className="w-100 form-control"
              placeholder="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              <IconMail size={16} className="me-1" /> Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Subscribe;
