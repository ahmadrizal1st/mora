import { Chart, DropdownGrouping } from '@/shared/components/ui';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import type { FC } from 'react';
import type { Account } from '@/features/transaction/types/transaction.types';

type GroupBy = 'day' | 'week' | 'month' | 'year';

interface ChartSeriesItem {
  name: string;
  color: string;
  data: number[];
}

interface AccountsSummaryChartProps {
  accountsWithHistory: Account[];
  effectiveSelected: Set<string>;
  toggleAccount: (id: string) => void;
  groupBy: GroupBy;
  setGroupBy: (val: GroupBy) => void;
  totalWealth: number;
  chartSeries: ChartSeriesItem[];
  chartLabels: string[];
}

export const AccountsSummaryChart: FC<AccountsSummaryChartProps> = ({
  accountsWithHistory,
  effectiveSelected,
  toggleAccount,
  groupBy,
  setGroupBy,
  totalWealth,
  chartSeries,
  chartLabels,
}) => {
  if (accountsWithHistory.length === 0) return null;

  return (
    <div className="row mt-4">
      <div className="col-12">
        <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '1.25rem' }}>
          <div className="card-body p-4">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
              <div>
                <h3 className="h2 mb-1 fw-bold text-dark">Tren Kekayaan Bersih</h3>
                <div className="text-secondary small fw-medium">Perbandingan saldo antar akun Anda secara historis</div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <DropdownGrouping value={groupBy} onChange={setGroupBy} />
                <div className="text-end border-start ps-3 d-none d-sm-block">
                  <div className="text-secondary small fw-bold text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Total Kekayaan</div>
                  <div className="h2 fw-bold mb-0 text-primary" style={{ letterSpacing: '-0.5px' }}>
                    {formatCurrency(totalWealth)}
                  </div>
                </div>
              </div>
            </div>

            {/* Account filter toggles */}
            <div className="d-flex flex-wrap gap-2 mb-4 p-2 bg-light rounded-3" style={{ width: 'fit-content' }}>
              {accountsWithHistory.map((acc) => {
                const isActive = effectiveSelected.has(acc.id);
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => toggleAccount(acc.id)}
                    className="btn btn-sm border-0 transition-all"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 16px',
                      borderRadius: '2rem',
                      backgroundColor: isActive ? acc.color : 'transparent',
                      color: isActive ? (parseInt(acc.color.slice(1), 16) > 0xbbbbbb ? '#1d273b' : 'white') : '#6e7687',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: isActive ? `0 4px 12px ${acc.color}40` : 'none',
                    }}
                  >
                    {!isActive && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: acc.color,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    {acc.name}
                  </button>
                );
              })}
            </div>

            {/* Chart */}
            <div style={{ minHeight: '350px', margin: '0 -10px' }}>
              {chartSeries.length === 0 ? (
                <div className="text-center text-muted py-5">
                  Pilih minimal satu akun untuk ditampilkan.
                </div>
              ) : (
                <Chart
                  chartId="total-wealth-trend"
                  chartData={{
                    type: 'line',
                    stacked: false,
                    series: chartSeries,
                    strokeWidth: [3],
                    categories: chartLabels,
                    strokeCurve: 'smooth',
                    animations: true,
                    datalabels: false,
                    legend: false,
                    grid: {
                      strokeDashArray: 4,
                      borderColor: 'rgba(32, 107, 196, 0.15)',
                      padding: { top: 20, right: 20, bottom: 0, left: 20 },
                    },
                    xaxis: {
                      tooltip: { enabled: false },
                      axisBorder: { show: false },
                      tickAmount: 10,
                      labels: {
                        style: { colors: '#9199a0', fontWeight: 500 },
                        formatter: (val: string) => {
                          if (!val) return '';
                          if (val.includes('-W')) return val.split('-')[1];
                          if (/^\d{4}$/.test(val)) return val;
                          if (/^\d{4}-\d{2}$/.test(val)) {
                            const [y, m] = val.split('-');
                            const date = new Date(Number(y), Number(m) - 1, 1);
                            return date.toLocaleDateString('id-ID', { month: 'short' });
                          }
                          const date = new Date(val);
                          if (isNaN(date.getTime())) return val;
                          return date.toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                          });
                        },
                      },
                    },
                    yaxis: {
                      labels: {
                        style: { colors: '#9199a0', fontWeight: 500 },
                        formatter: (val: number) => {
                          const absVal = Math.abs(val);
                          const sign = val < 0 ? '-' : '';
                          if (absVal >= 1000000) return sign + (absVal / 1000000).toFixed(1) + 'jt';
                          if (absVal >= 1000) return sign + (absVal / 1000).toFixed(0) + 'rb';
                          return val.toString();
                        },
                      },
                    },
                    extend: {
                      chart: {
                        animations: {
                          enabled: true,
                          easing: 'easeinout',
                          speed: 600,
                          animateGradually: { enabled: false },
                          dynamicAnimation: { enabled: true, speed: 400 }
                        }
                      },
                      markers: {
                        size: 0,
                        strokeWidth: 0,
                        hover: { size: 5 }
                      },
                      tooltip: {
                        container: 'body',
                        shared: true,
                        intersect: false,
                        theme: 'dark',
                        x: {
                          show: true,
                          formatter: (_val: unknown, { dataPointIndex }: { dataPointIndex: number }) => {
                            const label = chartLabels[dataPointIndex];
                            if (!label) return _val;
                            if (/^\d{4}$/.test(String(label))) return label;
                            if (String(label).includes('-W')) return label;
                            const date = new Date(label);
                            if (isNaN(date.getTime())) return label;
                            return date.toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            });
                          }
                        },
                        y: {
                          formatter: (val: number) => formatCurrency(val),
                        },
                      },
                    },
                  }}
                  height={25}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
