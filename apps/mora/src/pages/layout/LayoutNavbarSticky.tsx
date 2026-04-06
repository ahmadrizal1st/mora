import HomepageLayout from '../../layouts/HomepageLayout';
import { DashboardContent, dashboardHeaderActions } from '../../components/parts/DashboardContent';

export default function LayoutNavbarSticky() {
  return (
    <HomepageLayout pageHeader="Navbar sticky" navbarSticky pageActions={dashboardHeaderActions}>
      <DashboardContent />
    </HomepageLayout>
  );
}
