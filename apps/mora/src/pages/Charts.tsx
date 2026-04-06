// src/pages/Charts.tsx
import React from 'react'
import BaseLayout from '../layouts/BaseLayout'
import { ActivityChartCard } from '../components/cards/charts/ActivityChartCard'
import { SocialReferralsCard } from '../components/cards/charts/SocialReferralsCard'
import { Chart } from '../components/ui/Chart'
import chartsData from '../data/charts.json'

export default function Charts() {
  const resolveChartData = (config: any) => {
    if (config.extend && (chartsData as any)[config.extend]) {
      return {
        ...(chartsData as any)[config.extend],
        ...config
      }
    }
    return config
  }

  // Group demo charts by category
  const categorizedCharts = {
    'Stacked Charts': Object.entries(chartsData).filter(([_, c]) => (c as any).demo && (c as any).stacked),
    'Line & Area Charts': Object.entries(chartsData).filter(([_, c]) => (c as any).demo && ((c as any).type === 'line' || (c as any).type === 'area') && !(c as any).stacked),
    'Bar Charts': Object.entries(chartsData).filter(([_, c]) => (c as any).demo && (c as any).type === 'bar' && !(c as any).stacked),
    'Pie & Donut Charts': Object.entries(chartsData).filter(([_, c]) => (c as any).demo && ((c as any).type === 'pie' || (c as any).type === 'donut')),
    'Other Charts': Object.entries(chartsData).filter(([_, c]) => (c as any).demo && !['line', 'area', 'bar', 'pie', 'donut'].includes((c as any).type as string) && !(c as any).stacked),
  }

  return (
    <BaseLayout pageTitle="Charts">
      <div className="row row-cards">
        <div className="col-12">
          <ActivityChartCard />
        </div>

        <div className="col-12">
          <SocialReferralsCard />
        </div>

        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Tasks Overview</h3>
            </div>
            <div className="card-body">
              <Chart chartId="tasks-overview" height={20} chartData={(chartsData as any)['tasks-overview']} />
            </div>
          </div>
        </div>

        {Object.entries(categorizedCharts).map(([category, charts]) => (
          <React.Fragment key={category}>
            {charts.length > 0 && (
              <>
                <div className="col-12 mt-4">
                  <h2 className="page-title">{category}</h2>
                </div>
                {charts.map(([chartId, config]) => {
                  const resolvedConfig = resolveChartData(config)
                  return (
                    <div key={chartId} className="col-md-6 col-lg-4">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">{(resolvedConfig as any).name || chartId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                        </div>
                        <div className="card-body">
                          <Chart chartId={chartId} height={15} chartData={resolvedConfig as any} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </BaseLayout>
  )
}
