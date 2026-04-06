import HomepageLayout from '../../layouts/HomepageLayout';
import { DashboardContent, dashboardHeaderActions } from '../../components/parts/DashboardContent';

export default function LayoutVertical() {
  return (
    <HomepageLayout
      pageHeader="Vertical layout"
      sidebar
      sidebarDark
      hideTopbar
      pageActions={dashboardHeaderActions}
    >
      <DashboardContent />
    </HomepageLayout>
  );
}
