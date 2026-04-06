import HomepageLayout from '../../layouts/HomepageLayout';
import { DashboardContent, dashboardHeaderActions } from '../../components/parts/DashboardContent';

export default function LayoutFluid() {
  return (
    <HomepageLayout pageHeader="Fluid layout" bodyClass="layout-fluid" pageActions={dashboardHeaderActions}>
      <DashboardContent />
    </HomepageLayout>
  );
}
