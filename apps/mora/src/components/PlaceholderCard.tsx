import React from 'react';

export const PlaceholderCard1: React.FC = () => (
  <div className="card placeholder-glow">
    <div className="ratio ratio-21x9 card-img-top placeholder"></div>
    <div className="card-body">
      <div className="placeholder col-9 mb-3"></div>
      <div className="placeholder placeholder-xs col-10"></div>
      <div className="placeholder placeholder-xs col-11"></div>
      <div className="mt-3">
        <a href="#" tabIndex={-1} className="btn btn-primary disabled placeholder col-4" aria-hidden="true"></a>
      </div>
    </div>
  </div>
);

export const PlaceholderCard2: React.FC = () => (
  <div className="card">
    <div className="row g-0 align-items-center placeholder-glow">
      <div className="col-3">
        <div className="ratio ratio-1x1 card-img-start placeholder"></div>
      </div>
      <div className="col">
        <div className="card-body">
          <div className="placeholder col-9 mb-3"></div>
          <div className="placeholder placeholder-xs col-10"></div>
          <div className="placeholder placeholder-xs col-11"></div>
        </div>
      </div>
    </div>
  </div>
);

export const PlaceholderCard3: React.FC = () => (
  <div className="card">
    <div className="card-body">
      <div className="row">
        <div className="col-auto">
          <div className="avatar avatar-rounded placeholder"></div>
        </div>
        <div className="col">
          <div className="placeholder placeholder-xs col-9"></div>
          <div className="placeholder placeholder-xs col-7"></div>
        </div>
      </div>
    </div>
  </div>
);

export const PlaceholderCard4: React.FC = () => (
  <div className="card">
    <div className="card-body py-5 text-center">
      <div>
        <div className="avatar avatar-rounded avatar-lg placeholder mb-3"></div>
      </div>
      <div className="mt w-75 mx-auto">
        <div className="placeholder col-9 mb-3"></div>
        <div className="placeholder placeholder-xs col-10"></div>
      </div>
    </div>
  </div>
);

export const PlaceholderCard5: React.FC = () => (
  <div className="card">
    <div className="card-body text-end placeholder-glow">
      <div className="placeholder col-9 mb-3"></div>
      <div className="placeholder placeholder-xs col-10"></div>
      <div className="placeholder placeholder-xs col-12"></div>
      <div className="placeholder placeholder-xs col-11"></div>
      <div className="placeholder placeholder-xs col-8"></div>
      <div className="placeholder placeholder-xs col-10"></div>
    </div>
  </div>
);

export const PlaceholderCard6: React.FC = () => (
  <div className="card">
    <ul className="list-group list-group-flush placeholder-glow">
      {[1, 2, 3, 4].map((i) => (
        <li key={i} className="list-group-item">
          <div className="row align-items-center">
            <div className="col-auto">
              <div className="avatar avatar-rounded placeholder"></div>
            </div>
            <div className="col-7">
              <div className="placeholder placeholder-xs col-9"></div>
              <div className="placeholder placeholder-xs col-7"></div>
            </div>
            <div className="col-2 ms-auto text-end">
              <div className="placeholder placeholder-xs col-8"></div>
              <div className="placeholder placeholder-xs col-10"></div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
