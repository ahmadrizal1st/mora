import { useEffect } from 'react';
import * as Turbo from '@hotwired/turbo';
import BaseLayout from '../layouts/BaseLayout';

export default function TurboLoaderPage() {
  useEffect(() => {
    // Disable Turbo Drive for this demonstration if needed, 
    // though in a React SPA it's already not "driving" the same way.
    Turbo.session.drive = false;
  }, []);

  const getLoader = () => {
    // Accessing the progress bar adapter. 
    // In Turbo 8, this might be internal, but we'll try the suggested path.
    // @ts-ignore - Internal API access
    return (Turbo as any).navigator?.delegate?.adapter?.progressBar;
  };

  const showLoader = () => {
    const loader = getLoader();
    if (loader) {
      loader.show();
    } else {
      console.warn('Turbo loader not found');
    }
  };

  const hideLoader = () => {
    const loader = getLoader();
    if (loader) {
      loader.hide();
    }
  };

  const setProgress = (value: number) => {
    const loader = getLoader();
    if (loader) {
      loader.show();
      loader.setValue(value);
    }
  };

  const set100AndHide = () => {
    const loader = getLoader();
    if (loader) {
      loader.show();
      loader.setValue(1);
      setTimeout(() => {
        loader.hide();
      }, 1000);
    }
  };

  return (
    <BaseLayout pageTitle="Turbo Loader">
      <div className="card">
        <div className="card-body">
          <div className="btn-list">
            <button className="btn" id="show-loader" onClick={showLoader}>
              Show loader
            </button>
            <button className="btn" id="hide-loader" onClick={hideLoader}>
              Hide loader
            </button>
            <button className="btn" id="set-10" onClick={() => setProgress(0.1)}>
              Set 10%
            </button>
            <button className="btn" id="set-50" onClick={() => setProgress(0.5)}>
              Set 50%
            </button>
            <button className="btn" id="set-100" onClick={set100AndHide}>
              Set 100%
            </button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
