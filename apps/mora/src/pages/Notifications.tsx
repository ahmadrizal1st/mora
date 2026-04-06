import BaseLayout from '../layouts/BaseLayout';
import { NavbarNotifications } from '../components/cards/NavbarNotifications';

export default function Notifications() {
  return (
    <BaseLayout pageTitle="Notification" pageIcon="arrow-left" containerFlushMobile={true}>
      <div className="row justify-content-center g-0">
        <div className="col-12 col-lg-7 col-xl-6">
          <NavbarNotifications isPage={true} />
        </div>
      </div>
    </BaseLayout>
  );
}
