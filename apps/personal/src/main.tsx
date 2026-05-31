import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { App } from './app/App'

import '@tabler/core/dist/css/tabler.min.css'
import '@tabler/core/dist/css/tabler-flags.min.css'
import '@tabler/core/dist/css/tabler-payments.min.css'
import 'jsvectormap/dist/jsvectormap.min.css'
import '@tabler/core/dist/css/tabler-vendors.min.css'
import '@tabler/core/dist/css/tabler-themes.min.css'
import '@tabler/core/dist/js/tabler.min.js'
import ApexCharts from 'apexcharts'
import './styles/demo.scss'
import './styles/gradients.scss'
import './styles/patterns.scss'
import './index.css'
import 'mapbox-gl/dist/mapbox-gl.css'

declare global {
  interface Window {
    ApexCharts: typeof ApexCharts
  }
}

window.ApexCharts = ApexCharts

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={clientId || ''}>
    <App />
  </GoogleOAuthProvider>
)
