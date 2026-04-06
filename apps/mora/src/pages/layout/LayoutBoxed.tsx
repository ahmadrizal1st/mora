import HomepageLayout from '../../layouts/HomepageLayout';
import { DashboardContent, dashboardHeaderActions } from '../../components/parts/DashboardContent';

export default function LayoutBoxed() {
  return (
    <HomepageLayout pageHeader="Boxed layout" bodyClass="layout-boxed" pageActions={dashboardHeaderActions}>
      <DashboardContent />
    </HomepageLayout>
  );
}
