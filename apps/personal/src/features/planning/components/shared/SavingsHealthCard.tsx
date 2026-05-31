import { useState, useEffect, useMemo } from 'react';
import { Chart } from '@/shared/components/ui/Chart';
import { Icon } from '@/shared/components/ui/Icon';
import { formatCurrency } from '@/shared/utils/currencyUtils';

// Helper to interpolate between two colors
const lerpColor = (color1: number[], color2: number[], t: number) => {
  const r = Math.round(color1[0] + (color2[0] - color1[0]) * t);
  const g = Math.round(color1[1] + (color2[1] - color1[1]) * t);
  const b = Math.round(color1[2] + (color2[2] - color1[2]) * t);
  return `rgb(${r},${g},${b})`;
};

export function SavingsHealthCard() {
  const [showBubble, setShowBubble] = useState(false);
  const score = 790;
  const min = 300;
  const max = 850;
  const range = max - min;
  const percentage = ((score - min) / range) * 100;
  const pct = (score - min) / range;
  
  // Define standard colors for interpolation
  const red = [226, 75, 74];
  const yellow = [239, 159, 39];
  const green = [29, 158, 117];

  // Calculate the exact color at the current score position (Continuous Sync)
  const activeColor = useMemo(() => {
    if (pct <= 0.5) {
      // Low–mid: merah → kuning
      const t = pct / 0.5;
      return lerpColor(red, yellow, t);
    } else {
      // Mid–high: kuning → hijau
      const t = (pct - 0.5) / 0.5;
      return lerpColor(yellow, green, t);
    }
  }, [pct]);

  // Calculate dynamic color stops for the gradient
  const gradientStops = useMemo(() => {
    if (pct <= 0.5) {
      return [
        { offset: 0, color: '#E24B4A', opacity: 1 },
        { offset: 100, color: activeColor, opacity: 1 }
      ];
    } else {
      return [
        { offset: 0, color: '#E24B4A', opacity: 1 },
        { offset: 50, color: '#EF9F27', opacity: 1 },
        { offset: 100, color: activeColor, opacity: 1 }
      ];
    }
  }, [pct, activeColor]);

  // Calculate rotation for the white bubble
  const rotation = useMemo(() => -90 + (percentage / 100) * 180 - 1, [percentage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  const chartData = useMemo(() => ({
    type: 'radialBar' as const,
    height: 42,
    series: [{ name: 'Health', data: [percentage] }],
    sparkline: true,
    animations: true,
    extend: {
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          hollow: { size: '70%' },
          track: {
            background: 'var(--tblr-bg-surface-secondary, #f1f5f9)',
            strokeWidth: '100%',
          },
          dataLabels: {
            show: false
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 1,
          opacityFrom: 1,
          opacityTo: 1,
          colorStops: gradientStops
        }
      },
      stroke: {
        lineCap: 'round',
      }
    }
  }), [percentage, gradientStops]);

  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
      <div className="card-header border-bottom py-3 px-4 bg-surface">
        <h3 className="card-title fw-bold m-0 d-flex align-items-center gap-2">
          <Icon icon="activity" size="sm" className="text-primary" />
          Financial Health Score
        </h3>
      </div>
      <div className="card-body p-4">
        <div className="text-center">
          <div className="position-relative mx-auto" style={{ width: '300px', height: '300px', marginBottom: '-100px' }}>
            <Chart chartId="healthGauge" chartData={chartData as any} />
            
            {/* Custom Centered Score */}
            <div className="position-absolute w-100 text-center" style={{ top: '50%', transform: 'translateY(-50%)' }}>
              <div className="display-3 fw-bold lh-1" style={{ color: activeColor, fontFeatureSettings: '"tnum" 1', letterSpacing: '-0.02em' }}>{score}</div>
              <div className="text-muted fw-semibold small mt-1">out of 850</div>
            </div>

            {/* White Bubble Indicator - Appears after animation */}
            <div 
              className="position-absolute top-0 start-0 w-100 h-100" 
              style={{ 
                transform: `rotate(${rotation}deg)`,
                pointerEvents: 'none',
                zIndex: 10,
                opacity: showBubble ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
              }}
            >
              <div 
                style={{ 
                  position: 'absolute',
                  top: '33px',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(-50%)',
                  width: '28px',
                  height: '28px',
                  backgroundColor: 'var(--tblr-bg-surface)',
                  borderRadius: '50%',
                  border: `5px solid ${activeColor}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              />
            </div>

            {/* Range markers below the semi-circle */}
            <div className="d-flex justify-content-between px-4 position-absolute w-100" style={{ bottom: '40%' }}>
              <span className="small text-muted fw-bold">300</span>
              <span className="small text-muted fw-bold">850</span>
            </div>
          </div>
          
          <div className="text-muted small mb-1">May 26, 2024</div>
          <div className="text-secondary opacity-50 mb-1" style={{ fontSize: '10px' }}>VantageScore 3.0 from Banking App</div>
          <div className="text-body small cursor-pointer fw-bold d-flex align-items-center justify-content-center gap-1 mt-1">
            Refresh Score <Icon icon="refresh" size="xs" />
          </div>
        </div>

        <hr className="my-2 opacity-50" />

        <div className="space-y-3">
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-secondary small fw-medium">Average Daily Balance</span>
            <span className="fw-bold text-body">{formatCurrency(1748.09 * 15000)}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-secondary small fw-medium">Last Statement Balance</span>
            <span className="fw-bold text-body">{formatCurrency(2300.03 * 15000)}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-secondary small fw-medium">Routing Number</span>
            <span className="fw-bold text-body">1267231469</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-secondary small fw-medium">Account Number</span>
            <span className="fw-bold text-body">2343</span>
          </div>
        </div>
      </div>
    </div>
  );
}