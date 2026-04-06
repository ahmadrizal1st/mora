import HomepageLayout from '../../layouts/HomepageLayout';
import { DashboardContent, dashboardHeaderActions } from '../../components/parts/DashboardContent';

export default function LayoutNavbarDark() {
  return (
    <HomepageLayout pageHeader="Navbar dark" navbarDark pageActions={dashboardHeaderActions}>
      <DashboardContent />
    </HomepageLayout>
  );
}
