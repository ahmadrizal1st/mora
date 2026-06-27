import { Chart } from '@/shared/components/ui/Chart'

interface ReportChartsCardProps {
  series: {
    months: string[]
    income: number[]
    expense: number[]
  }
  netWorth: number[]
}

export function ReportChartsCard({ series, netWorth }: ReportChartsCardProps) {
  const chartFormatter = (val: number) => {
    if (val === undefined || val === null) return ''
    const abs = Math.abs(val)
    if (abs >= 1000000) return `${(abs / 1000000).toFixed(0)}M`
    if (abs >= 1000) return `${(abs / 1000).toFixed(0)}K`
    return abs.toString()
  }

  const tooltipFormatter = (val: number) => `Rp ${Math.abs(val).toLocaleString('id-ID')}`

  return (
    <div className="d-flex flex-column gap-3 h-100">
      {/* 6 Bulan Terakhir */}
      <div className="card shadow-sm border-0 rounded-4 flex-grow-1">
        <div className="card-header border-0 pb-0">
          <h3 className="card-title text-secondary fw-bold" style={{ fontSize: '11px', letterSpacing: '1px' }}>
            6 BULAN TERAKHIR
          </h3>
        </div>
        <div className="card-body">
          <Chart
            chartId="report-bar-history"
            chartData={{
              type: 'bar',
              height: 14,
              series: [
                { name: 'Income', data: series.income },
                { name: 'Expense', data: series.expense.map(v => Math.abs(v)) }
              ],
              categories: series.months,
              legend: false,
              datalabels: false,
              stacked: false,
              xaxis: {
                labels: { style: { fontSize: '10px', colors: '#9e9e9e' } },
                axisBorder: { show: false },
                axisTicks: { show: false }
              },
              yaxis: {
                tickAmount: 4,
                labels: {
                  style: { fontSize: '10px', colors: '#9e9e9e' },
                  formatter: chartFormatter
                }
              },
              grid: {
                show: false,
                xaxis: { lines: { show: false } },
                yaxis: { lines: { show: false } }
              },
              colors: ['#2ecc71', '#e74c3c'],
              plotOptions: {
                bar: {
                  columnWidth: '40%',
                  borderRadius: 4
                }
              },
              extend: {
                tooltip: {
                  y: { formatter: tooltipFormatter }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Tren Kekayaan Bersih */}
      <div className="card shadow-sm border-0 rounded-4 flex-grow-1">
        <div className="card-header border-0 pb-0">
          <h3 className="card-title text-secondary fw-bold" style={{ fontSize: '11px', letterSpacing: '1px' }}>
            TREN KEKAYAAN BERSIH
          </h3>
        </div>
        <div className="card-body">
          <Chart
            chartId="report-networth-line"
            chartData={{
              type: 'area',
              height: 12,
              series: [
                { name: 'Net Worth', data: netWorth }
              ],
              categories: series.months,
              legend: false,
              datalabels: false,
              colors: ['#3b5998'],
              stroke: { curve: 'smooth', width: 3 },
              xaxis: {
                labels: { style: { fontSize: '10px', colors: '#9e9e9e' } },
                axisBorder: { show: false },
                axisTicks: { show: false }
              },
              yaxis: {
                tickAmount: 3,
                labels: {
                  style: { fontSize: '10px', colors: '#9e9e9e' },
                  formatter: chartFormatter
                }
              },
              grid: {
                borderColor: '#f1f3f4',
                strokeDashArray: 3,
              },
              extend: {
                tooltip: {
                  y: { formatter: tooltipFormatter }
                }
              }
            }}
          />
          <div className="d-flex justify-content-between align-items-end mt-3">
            <div className="text-secondary small">Sekarang: {tooltipFormatter(netWorth[netWorth.length - 1] || 0)}</div>
            <div className="fw-bold text-success small">
              + {tooltipFormatter((netWorth[netWorth.length - 1] || 0) - (netWorth[0] || 0))} dari awal
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
