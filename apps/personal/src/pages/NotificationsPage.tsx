import BaseLayout from '@/shared/layouts/BaseLayout'
import { NavbarNotifications } from '@/shared/components/cards/NavbarNotifications'

export default function NotificationsPage() {
  return (
    <BaseLayout pageTitle="Notification" containerFlushMobile={true}>
      <div className="row justify-content-center g-0">
        <div className="col-12 col-lg-8 col-xl-7">
          <NavbarNotifications isPage={true} />
        </div>
      </div>
    </BaseLayout>
  )
}
