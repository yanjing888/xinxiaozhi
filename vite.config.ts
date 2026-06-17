import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

interface PortsConfig {
  frontendPort: number
  backendPort: number
}

function loadPortsConfig(): PortsConfig {
  const defaults = { frontendPort: 5173, backendPort: 8081 }
  try {
    const raw = readFileSync(resolve(process.cwd(), 'config/ports.json'), 'utf-8')
    const parsed = JSON.parse(raw) as Partial<PortsConfig>
    return {
      frontendPort: Number(parsed.frontendPort) || defaults.frontendPort,
      backendPort: Number(parsed.backendPort) || defaults.backendPort,
    }
  } catch {
    return defaults
  }
}

const ports = loadPortsConfig()

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: ports.frontendPort,
    host: true,
    proxy: {
      '/api': {
        target: `http://localhost:${ports.backendPort}`,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: ports.frontendPort,
    host: true,
    proxy: {
      '/api': {
        target: `http://localhost:${ports.backendPort}`,
        changeOrigin: true,
      },
    },
  },
})
