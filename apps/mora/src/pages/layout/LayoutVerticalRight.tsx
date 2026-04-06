import HomepageLayout from '../../layouts/HomepageLayout';
import { DashboardContent, dashboardHeaderActions } from '../../components/parts/DashboardContent';

export default function LayoutVerticalRight() {
  return (
    <HomepageLayout pageHeader="Right vertical layout" sidebar sidebarEnd hideTopbar pageActions={dashboardHeaderActions}>
      <DashboardContent />
    </HomepageLayout>
  );
}
