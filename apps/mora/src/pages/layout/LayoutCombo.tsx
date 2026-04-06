import HomepageLayout from '../../layouts/HomepageLayout';
import { DashboardContent, dashboardHeaderActions } from '../../components/parts/DashboardContent';

export default function LayoutCombo() {
  return (
    <HomepageLayout
      pageHeader="Combo layout"
      sidebar
      sidebarDark
      navbarHideBrand
      navbarHidePageMenu
      navbarClass="d-none d-lg-flex"
      navbarCondensed
      pageActions={dashboardHeaderActions}
    >
      <DashboardContent />
    </HomepageLayout>
  );
}
