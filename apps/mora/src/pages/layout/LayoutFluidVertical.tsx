import HomepageLayout from '../../layouts/HomepageLayout';
import { DashboardContent, dashboardHeaderActions } from '../../components/parts/DashboardContent';

export default function LayoutFluidVertical() {
  return (
    <HomepageLayout pageHeader="Fluid vertical layout" bodyClass="layout-fluid" sidebar sidebarDark hideTopbar pageActions={dashboardHeaderActions}>
      <DashboardContent />
    </HomepageLayout>
  );
}
