// src/pages/StarRatingsPage.tsx
import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import { Rating } from '../components/ui/Rating';

const StarRatingsPage: React.FC = () => {
  return (
    <BaseLayout pageTitle="Star Ratings">
      <div className="row row-cards">
        <div className="col-md-4">
          <div className="row row-cards">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="h3 card-title">Basic</div>
                  <div><Rating value={4} /></div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="h3 card-title">Different icon</div>
                  <div className="space-y">
                    <div><Rating value={4} /></div>
                    <div><Rating icon="heart" value={4} color="red" /></div>
                    <div><Rating icon="ghost" value={4} color="azure" /></div>
                    <div><Rating icon="circle" value={4} color="green" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="h3 card-title">Custom colors</div>
              <div className="space-y">
                <div><Rating id="color" value={3} /></div>
                <div><Rating id="color-primary" color="primary" value={3} /></div>
                <div><Rating id="color-red" color="red" value={3} /></div>
                <div><Rating id="color-lime" color="lime" value={3} /></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="h3 card-title">Custom sizes</div>
              <div className="space-y">
                <div><Rating id="size-sm" value={3} size="sm" /></div>
                <div><Rating id="size-primary" value={3} /></div>
                <div><Rating id="size-md" value={3} size="md" /></div>
                <div><Rating id="size-lg" value={3} size="lg" /></div>
                <div><Rating id="size-xl" value={3} size="xl" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default StarRatingsPage;
