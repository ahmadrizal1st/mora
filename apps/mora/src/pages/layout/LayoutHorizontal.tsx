import HomepageLayout from '../../layouts/HomepageLayout';
import { DashboardContent, dashboardHeaderActions } from '../../components/parts/DashboardContent';

export default function LayoutHorizontal() {
  return (
    <HomepageLayout pageHeader="Horizontal layout" pageActions={dashboardHeaderActions}>
      <DashboardContent />
    </HomepageLayout>
  );
}
