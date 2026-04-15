// src/components/cards/charts/SocialReferralsCard.tsx
import { Chart } from '../../ui/Chart'
import { DropdownDays } from '../../ui/DropdownDays'
import chartsData from '../../../data/charts.json'

export function SocialReferralsCard() {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex">
          <h3 className="card-title">Social referrals</h3>
          <div className="ms-auto">
            <DropdownDays />
          </div>
        </div>
        <Chart
          chartId="social-referrals"
          chartData={(chartsData as any)['social-referrals']}
          height={15}
        />
      </div>
    </div>
  )
}