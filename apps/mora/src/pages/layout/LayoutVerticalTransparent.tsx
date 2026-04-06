import HomepageLayout from '../../layouts/HomepageLayout';
import { DashboardContent, dashboardHeaderActions } from '../../components/parts/DashboardContent';

export default function LayoutVerticalTransparent() {
  return (
    <HomepageLayout pageHeader="Vertical transparent layout" sidebar navbarTransparent hideTopbar pageActions={dashboardHeaderActions}>
      <DashboardContent />
    </HomepageLayout>
  );
}
