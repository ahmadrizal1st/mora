import React from 'react'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { Empty, Button, Icon } from '@/shared/components/ui'
import { useNavigate } from '@tanstack/react-router'

export function ComingSoonPage({ title }: { title: string }) {
  const navigate = useNavigate()

  return (
    <BaseLayout pageTitle={title} pagePretitle="COMING SOON">
      <div className="card border-0 shadow-sm">
        <div className="card-body py-5 text-center">
          <Empty
            title="Feature Coming Soon"
            description={`We are working hard to bring you the ${title} feature. Stay tuned!`}
            icon="rocket"
            action={
              <Button
                onClick={() => navigate({ to: '/dashboard' })}
                color="primary"
                text="Back to Dashboard"
                icon="home"
              />
            }
          />
        </div>
      </div>
    </BaseLayout>
  )
}
