// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { useAuthStore } from './features/auth/store/authStore'

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

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: undefined!, // injected below
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuthStore()
  return <RouterProvider router={router} context={{ auth }} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={clientId || ''}>
    <InnerApp />
  </GoogleOAuthProvider>
)