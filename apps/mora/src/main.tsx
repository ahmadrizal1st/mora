// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

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

// Initialize ApexCharts globally for use in components
window.ApexCharts = ApexCharts as any

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)