import HomepageLayout from '../../layouts/HomepageLayout';
import { DashboardContent, dashboardHeaderActions } from '../../components/parts/DashboardContent';

export default function LayoutNavbarOverlap() {
  return (
    <HomepageLayout pageHeader="Navbar overlap layout" navbarOverlap navbarCondensed navbarDark pageActions={dashboardHeaderActions}>
      <DashboardContent />
    </HomepageLayout>
  );
}
