import AppRouter from './routes'
// Unused logic removed
import { ThemeProvider } from '@/shared/context/ThemeContext'
import { AuthProvider } from '@/features/auth/hooks/useAuth'
import { ThemeSettings } from '@/shared/components/layout/ThemeSettings'
import { BottomNav } from '@/shared/components/layout/BottomNav'

// Until real data is wired up, pass empty arrays.
// The components handle empty arrays gracefully with default fallbacks.
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppRouter />
        <BottomNav />
        <ThemeSettings />
      </ThemeProvider>
    </AuthProvider>
  )
}