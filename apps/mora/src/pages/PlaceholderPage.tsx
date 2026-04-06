import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import { 
  PlaceholderCard1, 
  PlaceholderCard2, 
  PlaceholderCard3, 
  PlaceholderCard4, 
  PlaceholderCard5, 
  PlaceholderCard6 
} from '../components/PlaceholderCard';

const PlaceholderPage: React.FC = () => {
  return (
    <BaseLayout pageTitle="Placeholder">
      <div className="row row-cards">
        {/* First row: 4 instances of Card 1 */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="col-md-6 col-lg-3">
            <PlaceholderCard1 />
          </div>
        ))}

        {/* Second row: Layout with Card 3 and Card 4 */}
        <div className="col-md-6 col-lg-4">
          <div className="row row-cards">
            <div className="col-12">
              <PlaceholderCard3 />
            </div>
            <div className="col-12">
              <PlaceholderCard4 />
            </div>
          </div>
        </div>

        {/* Third row: Layout with Card 1 and Card 2 */}
        <div className="col-md-6 col-lg-4">
          <div className="row row-cards">
            <div className="col-12">
              <PlaceholderCard1 />
            </div>
            <div className="col-12">
              <PlaceholderCard2 />
            </div>
          </div>
        </div>

        {/* Fourth row: Layout with Card 5 and Card 6 */}
        <div className="col-md-6 col-lg-4">
          <div className="row row-cards">
            <div className="col-12">
              <PlaceholderCard5 />
            </div>
            <div className="col-12">
              <PlaceholderCard6 />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default PlaceholderPage;
