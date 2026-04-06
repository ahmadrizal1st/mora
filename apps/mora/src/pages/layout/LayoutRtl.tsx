import HomepageLayout from '../../layouts/HomepageLayout';
import { DashboardContent, dashboardHeaderActions } from '../../components/parts/DashboardContent';

export default function LayoutRtl() {
  return (
    <HomepageLayout title="RTL mode" pageHeader="RTL mode" rtl pageActions={dashboardHeaderActions}>
      <DashboardContent />
    </HomepageLayout>
  );
}
