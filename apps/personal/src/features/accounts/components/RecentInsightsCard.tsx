import { Icon } from '@/shared/components/ui/Icon'

export interface Insight {
  title: string
  desc: string
  icon: string
  color: string
}

interface RecentInsightsCardProps {
  insights?: Insight[]
}

export function RecentInsightsCard({ insights = [] }: RecentInsightsCardProps) {
  return (
    <div className="card shadow-sm border-0 flex-grow-1">
      <div className="card-body p-3">
        <div className="text-secondary text-uppercase fw-semibold fs-5 mb-4">Recent Insights</div>

        {insights.length === 0 ? (
          <div className="text-center py-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <div className="d-flex justify-content-center text-secondary mb-3">
              <Icon icon="category-2" size={40} stroke={1.5} style={{ opacity: 0.6 }} />
            </div>
            <div className="text-muted small">Belum ada insight.</div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {insights.slice(0, 3).map((insight, idx) => (
              <div key={idx} className="d-flex gap-2 align-items-start">
                <div
                  className={`d-flex align-items-center justify-content-center bg-${insight.color} text-white shadow-sm`}
                  style={{ width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0 }}
                >
                  <Icon icon={insight.icon} size="sm" style={{ transform: 'scale(0.8)' }} />
                </div>
                <div>
                  <div className="fw-bold text-body" style={{ fontSize: '0.8rem' }}>{insight.title}</div>
                  <div className="text-secondary lh-sm mt-1" style={{ fontSize: '0.7rem' }}>
                    {insight.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
