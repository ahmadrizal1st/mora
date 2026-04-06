// src/pages/SocialIconsPage.tsx
import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import socialTiles from '../data/social-tiles.json';
import socials from '../data/socials.json';
import { Trending } from '../components/ui/Trending';

const getSocialIconStyle = (iconName: string, size?: string): React.CSSProperties => {
  const iconUrl = `/static/brands/${iconName}.svg`;
  
  // Default sizes based on Tabler's social-icons plugin
  let height = '2.5rem';
  if (size === 'xxs') height = '1rem';
  else if (size === 'xs') height = '1.25rem';
  else if (size === 'sm') height = '2rem';
  else if (size === 'md') height = '2.5rem';
  else if (size === 'lg') height = '3rem';
  else if (size === 'xl') height = '5rem';
  else if (size === '2xl') height = '7rem';

  return {
    position: 'relative',
    display: 'inline-block',
    height: height,
    aspectRatio: '1',
    background: `url("${iconUrl}") no-repeat center/contain`,
    verticalAlign: 'bottom'
  };
};

const SocialIconsPage: React.FC = () => {
  return (
    <BaseLayout pageTitle="Social icons">
      <div className="row row-cards">
        <div className="col-12">
          <div className="row g-3">
            {socialTiles.map((tile, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <span style={getSocialIconStyle(tile.icon, 'md')}></span>
                      </div>
                      <div className="col">
                        <div className="font-weight-medium">{tile.title}</div>
                        <div className="text-secondary">{tile.description}</div>
                      </div>
                      <div className="col-auto">
                        <Trending value={tile.trending} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Sign in with social media</h3>
            </div>
            <div className="card-body">
              <div className="btn-list">
                {socials.map((social, index) => (
                  <button key={index} className="btn">
                    <span 
                      className="me-2" 
                      style={getSocialIconStyle(social.file, 'xs')}
                    ></span>
                    Sign in with {social.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">List of all social media icons</h3>
            </div>
            <div className="card-body p-0">
              <div className="demo-icons-list-wrap">
                <div className="demo-icons-list d-flex flex-wrap p-3">
                  {socials.map((social, index) => (
                    <span 
                      key={index} 
                      className="m-2" 
                      title={social.name} 
                      data-bs-toggle="tooltip" 
                      data-bs-placement="top"
                    >
                      <span style={getSocialIconStyle(social.file, 'md')}></span>
                    </span>
                  ))}
                  {/* Empty divs to handle flex alignment like Tabler's demo */}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ width: '2.5rem', margin: '0.5rem' }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default SocialIconsPage;
