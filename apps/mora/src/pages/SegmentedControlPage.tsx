// src/pages/SegmentedControlPage.tsx
import React from 'react';
import BaseLayout from '../layouts/BaseLayout';
import { NavSegmented } from '../components/ui/NavSegmented';

const SegmentedControlPage: React.FC = () => {
  return (
    <BaseLayout pageTitle="Segmented control">
      <div className="row row-cards">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <NavSegmented items={['1', '2', '3', '4']} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <NavSegmented items={['👦', '👦🏿', '👦🏾', '👦🏽', '👦🏼', '👦🏻']} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <NavSegmented icons={['home', 'star', 'clock', 'ghost', 'bold', 'italic', 'underline']} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <NavSegmented 
                items={['List', 'Kanban', 'Calendar', 'Files']} 
                icons={['list', 'layout', 'calendar', 'files']} 
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <NavSegmented 
                items={['List', 'Kanban', 'Calendar', 'Files']} 
                icons={['list', 'layout', 'calendar', 'files']} 
                vertical 
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <NavSegmented 
                icons={['home', 'star', 'clock', 'ghost', 'bold', 'italic', 'underline']} 
                vertical 
                disabled="3" 
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <NavSegmented items={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} disabled="4,5" />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <NavSegmented items={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} vertical={true} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <NavSegmented items={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} name="checkbox" />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <NavSegmented items={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} fullWidth={true} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="space-y">
                <div>
                  <NavSegmented 
                    items={['Overview', 'Analytics', 'Reports', 'Notifications']} 
                    fullWidth={true} 
                  />
                </div>
                <div>
                  <NavSegmented 
                    items={['Account', 'Password']} 
                    fullWidth={true} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="space-y">
                <div>
                  <NavSegmented items={['List', 'Kanban', 'Calendar', 'Files']} disabled="3,5" size="sm" />
                </div>
                <div>
                  <NavSegmented items={['List', 'Kanban', 'Calendar', 'Files']} disabled="3,5" />
                </div>
                <div>
                  <NavSegmented items={['List', 'Kanban', 'Calendar', 'Files']} disabled="3,5" size="lg" />
                </div>

                <div>
                  <NavSegmented 
                    items={['List', 'Kanban', 'Calendar', 'Files']} 
                    icons={['list', 'layout', 'calendar', 'files']} 
                    disabled="3,5" 
                    size="sm" 
                  />
                </div>
                <div>
                  <NavSegmented 
                    items={['List', 'Kanban', 'Calendar', 'Files']} 
                    icons={['list', 'layout', 'calendar', 'files']} 
                    disabled="3,5" 
                  />
                </div>
                <div>
                  <NavSegmented 
                    items={['List', 'Kanban', 'Calendar', 'Files']} 
                    icons={['list', 'layout', 'calendar', 'files']} 
                    disabled="3,5" 
                    size="lg" 
                  />
                </div>
                
                <div>
                  <NavSegmented icons={['list', 'layout', 'calendar', 'files']} disabled="3,5" size="sm" />
                </div>
                <div>
                  <NavSegmented icons={['list', 'layout', 'calendar', 'files']} disabled="3,5" />
                </div>
                <div>
                  <NavSegmented icons={['list', 'layout', 'calendar', 'files']} disabled="3,5" size="lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default SegmentedControlPage;
