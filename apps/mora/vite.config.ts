import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import os from 'os'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  const valetPath = `${os.homedir()}/.config/valet/Certificates`
  const domain = env.VITE_DOMAIN || 'mora.test'
  const apiUrl = env.VITE_API_URL || 'https://vistamora.test'

  const keyPath = `${valetPath}/${domain}.key`
  const certPath = `${valetPath}/${domain}.crt`

  const httpsConfig =
    fs.existsSync(keyPath) && fs.existsSync(certPath)
      ? {
          key: fs.readFileSync(keyPath),
          cert: fs.readFileSync(certPath),
        }
      : undefined

  if (!httpsConfig && domain !== 'localhost') {
    console.warn(`\n[Vite] SSL certificates not found for ${domain}.`)
    console.warn(`[Vite] Please run: valet secure ${domain.replace('.test', '')}\n`)
  }

  return {
    plugins: [react()],
    server: {
      https: httpsConfig,
      port: 5173,
      host: domain,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
