import HomepageLayout from '../../layouts/HomepageLayout';
import { DashboardContent, dashboardHeaderActions } from '../../components/parts/DashboardContent';

export default function LayoutCondensed() {
  return (
    <HomepageLayout pageHeader="Condensed layout" navbarCondensed pageActions={dashboardHeaderActions}>
      <DashboardContent />
    </HomepageLayout>
  );
}
