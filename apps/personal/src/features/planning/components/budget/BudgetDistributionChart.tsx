import { Chart } from '@/shared/components/ui/Chart';
import { Icon } from '@/shared/components/ui/Icon';
import { MOCK_BUDGET_DATA } from '../../data/mockPlanningData';

export function BudgetDistributionChart() {
  const { totalBudget } = MOCK_BUDGET_DATA;
  
  // Custom colors to match the reference image
  const colors = [
    '#4E5D78', // Other (Dark Blue/Grey)
    '#7c6fff', // Bills (Purple)
    '#FF8A65', // Entertainment (Orange/Coral)
    '#E24B4A', // Health (Red)
    '#4FC3F7', // Education (Light Blue)
    '#D4E157'  // Clothes (Lime/Mustard)
  ];

  const chartData = {
    type: 'donut' as const,
    height: 18,
    series: [
      { name: 'Other', data: [totalBudget * 0.2], color: colors[0] },
      { name: 'Bills', data: [totalBudget * 0.25], color: colors[1] },
      { name: 'Entertainment', data: [totalBudget * 0.15], color: colors[2] },
      { name: 'Health', data: [totalBudget * 0.1], color: colors[3] },
      { name: 'Education', data: [totalBudget * 0.2], color: colors[4] },
      { name: 'Clothes', data: [totalBudget * 0.1], color: colors[5] }
    ],
    extend: {
      stroke: { 
        show: true, 
        width: 6, 
        colors: ['#fff'] // Gaps between segments
      },
      legend: { 
        show: true,
        position: 'right',
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: 'inherit',
        markers: { radius: 4, width: 10, height: 10 },
        itemMargin: { vertical: 4 }
      },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              name: { 
                show: true, 
                fontSize: '11px', 
                fontWeight: 600, 
                color: '#888',
                offsetY: -5
              },
              value: { 
                show: true, 
                fontSize: '18px', 
                fontWeight: 800, 
                color: '#333',
                offsetY: 10,
                formatter: (val: string) => `${Math.round(Number(val) / 1000).toLocaleString()}.000`
              },
              total: {
                show: true,
                label: 'Total Budget',
                fontSize: '11px',
                fontWeight: 600,
                color: '#888',
                formatter: () => {
                  return 'Rp ' + Math.round(totalBudget / 1000).toLocaleString() + '.000';
                }
              }
            }
          }
        }
      }
    }
  };

  return (
    <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>

      <div className="card-body p-4 d-flex flex-column">

        <div className="d-flex align-items-center justify-content-between mb-2">
          <h4 className="fw-bold m-0 text-secondary text-uppercase small text-ls-sm">Allocation</h4>
          <Icon icon="chart-pie" size="xs" className="text-muted" />
        </div>
        <div className="flex-fill d-flex align-items-center justify-content-center mt-n3">
          <div style={{ width: '100%' }}>
            <Chart chartId="budgetDistributionDonut" chartData={chartData as any} />
          </div>
        </div>
      </div>
    </div>
  );
}



