// src/pages/Colors.tsx
import { useState } from 'react';
import BaseLayout from '../layouts/BaseLayout';
import siteData from '../data/site.json';
const { colors: siteColors, lightColors, grayColors, socialColors } = siteData;

type GradientDirection = 'to-t' | 'to-te' | 'to-r' | 'to-be' | 'to-b' | 'to-bs' | 'to-s' | 'to-ts';

export default function Colors() {
  const allColorKeys = [
    ...Object.keys(siteColors),
    'inverted', 'white', 'transparent',
  ];

  const [colorFrom, setColorFrom] = useState(allColorKeys[0]);
  const [colorTo, setColorTo] = useState('transparent');
  const [colorVia, setColorVia] = useState('');
  const [direction, setDirection] = useState<GradientDirection>('to-r');

  const gradientClass = [
    'bg-gradient',
    `bg-gradient-from-${colorFrom}`,
    `bg-gradient-to-${colorTo}`,
    colorVia ? `bg-gradient-via-${colorVia}` : '',
    `bg-gradient-${direction}`,
  ].filter(Boolean).join(' ');

  return (
    <BaseLayout pageTitle="Colors" pagePretitle="Colors">
      <div className="row row-cards">

        {/* Base colors */}
        <div className="col-3">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                {Object.entries(siteColors).map(([key, color]) => (
                  <div key={key} className="col-12">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <div className={`avatar bg-${key} text-${key}-fg avatar-square`}>
                          {color.abbr}
                        </div>
                      </div>
                      <div className="col">
                        {color.title}<br />
                        <code>{color.hex}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Light colors */}
        <div className="col-3">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                {Object.entries(lightColors).map(([key, color]) => (
                  <div key={key} className="col-12">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <div className={`avatar bg-${key}-lt text-${key}-lt-fg avatar-square`}>
                          {color.abbr}
                        </div>
                      </div>
                      <div className="col">
                        {color.title}<br />
                        <code>{color.hex}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gray colors */}
        <div className="col-3">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                {Object.entries(grayColors).map(([key, color]) => (
                  <div key={key} className="col-12">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <div className={`avatar bg-${key} text-${key}-fg avatar-square`}>
                          {color.abbr}
                        </div>
                      </div>
                      <div className="col">
                        {color.title}<br />
                        <code>{color.hex}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social colors */}
        <div className="col-3">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                {Object.entries(socialColors).map(([key, color]) => (
                  <div key={key} className="col-12">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <div className={`avatar bg-${key} text-${key}-fg avatar-square`}>
                          <i className={`ti ti-brand-${color.icon}`} />
                        </div>
                      </div>
                      <div className="col">
                        {color.title}<br />
                        <code>{color.hex}</code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gradient builder */}
        <div className="col-12">
          <div className="row">
            <div className="col-6">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Gradient</h3>
                  <div className="row g-4">
                    <div className="col">
                      <div>
                        <label className="form-label">From</label>
                        <select className="form-select" value={colorFrom} onChange={e => setColorFrom(e.target.value)}>
                          {allColorKeys.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="mt-3">
                        <label className="form-label">To</label>
                        <select className="form-select" value={colorTo} onChange={e => setColorTo(e.target.value)}>
                          {allColorKeys.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col">
                      <div>
                        <label className="form-label">Via</label>
                        <select className="form-select" value={colorVia} onChange={e => setColorVia(e.target.value)}>
                          <option value=""></option>
                          {allColorKeys.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="mt-3">
                        <label className="form-label">Direction</label>
                        <select className="form-select" value={direction} onChange={e => setDirection(e.target.value as GradientDirection)}>
                          <option value="to-t">to top</option>
                          <option value="to-te">to top right</option>
                          <option value="to-r">to right</option>
                          <option value="to-be">to bottom right</option>
                          <option value="to-b">to bottom</option>
                          <option value="to-bs">to bottom left</option>
                          <option value="to-s">to left</option>
                          <option value="to-ts">to top left</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="border rounded bg-pattern-transparent overflow-hidden">
                        <div className={`${gradientClass} border rounded`}>
                          <div className="px-4 py-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <div className="space-y">
                        {allColorKeys.map(c => (
                          <div key={c} className={`border rounded bg-gradient bg-gradient-from-${c} bg-gradient-to-transparent px-4 py-2`} />
                        ))}
                      </div>
                    </div>
                    <div className="col">
                      <div className="space-y">
                        {allColorKeys.map(c => (
                          <div key={c} className={`border rounded bg-gradient bg-gradient-to-${c} bg-gradient-from-transparent px-4 py-2`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </BaseLayout>
  );
}
