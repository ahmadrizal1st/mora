// src/components/marketing/HeroBrowser.tsx
import { IconLock } from '@tabler/icons-react';

const PREVIEW_URL = 'https://preview.tabler.io';

export default function HeroBrowser() {
  return (
    <header className="hero pb-0">
      <div className="container">
        <h1 className="hero-title">Develop beautiful web apps with&nbsp;Tabler</h1>
        <p className="hero-description mt-4">
          Tabler is a free and open source web application UI kit based on Bootstrap&nbsp;5,
          with hundreds responsive components and multiple layouts.
        </p>
        <div className="my-5">
          <div className="row g-3 justify-content-center">
            <div className="col-auto">
              <a href="#" className="btn btn-lg">See features</a>
            </div>
            <div className="col-auto">
              <a
                href={PREVIEW_URL}
                className="btn btn-lg btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Preview template
              </a>
            </div>
          </div>
        </div>
        <div className="hero-img img-overlap-margin">
          <div className="browser">
            <div className="browser-header">
              <div className="row align-items-center">
                <div className="col-auto col-md-2">
                  <div className="browser-dots browser-dots-colored">
                    <div className="browser-dot"></div>
                    <div className="browser-dot"></div>
                    <div className="browser-dot"></div>
                  </div>
                </div>
                <div className="col-8">
                  <a
                    href={PREVIEW_URL}
                    className="browser-input"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Open preview of Tabler dashboard!"
                  >
                    <IconLock size={16} color="green" className="me-2" />
                    {PREVIEW_URL}
                  </a>
                </div>
              </div>
            </div>
            <img
              src="/static/marketing/preview.png"
              width={1040}
              height={760}
              className="img-fluid"
              alt="Tabler dashboard preview"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
