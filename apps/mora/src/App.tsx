import AppRouter from './routes'
import people from './data/people.json'
import photos from './data/photos.json'
import activity from './data/activity.json'
import chats from './data/chats.json'
import mails from './data/mails.json'
import faq from './data/faq.json'
import jobs from './data/jobs.json'
import projects from './data/projects.json'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeSettings } from './components/layout/ThemeSettings'
import { BottomNav } from './components/layout/BottomNav'


// Until real data is wired up, pass empty arrays.
// The components handle empty arrays gracefully with default fallbacks.
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppRouter
          people={people}
          commits={[]}
          tasks={[]}
          mails={mails}
          chats={chats}
          cryptoCurrencies={[]}
          cryptoOrders={{ sell_orders: [], buy_orders: [] }}
          cryptoMarkets={[]}
          photos={photos}
          projects={projects}
          activity={activity}
          faq={faq}
          jobs={jobs}
        />
        <BottomNav />
        <ThemeSettings />
      </ThemeProvider>
    </AuthProvider>
  )
}