import { createFileRoute } from '@tanstack/react-router'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { NavbarNotifications } from '@/shared/components/cards/NavbarNotifications'

export const Route = createFileRoute('/notifications')({
  component: NotificationsPage,
})

function NotificationsPage() {
  return (
    <BaseLayout 
      pageTitle="Notifikasi" 
      pagePretitle="Overview"
      containerFlushMobile
    >
      <div className="container-xl">
        <div className="row justify-content-center py-4">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '12px' }}>
              <NavbarNotifications isPage limit={100} />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
