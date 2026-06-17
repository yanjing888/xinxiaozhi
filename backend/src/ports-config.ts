import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export interface PortsConfig {
  frontendPort: number
  backendPort: number
}

const DEFAULT_PORTS: PortsConfig = {
  frontendPort: 5173,
  backendPort: 8081,
}

export function loadPortsConfig(): PortsConfig {
  try {
    const configPath = resolve(__dirname, '../../config/ports.json')
    const raw = readFileSync(configPath, 'utf-8')
    const parsed = JSON.parse(raw) as Partial<PortsConfig>
    return {
      frontendPort: Number(parsed.frontendPort) || DEFAULT_PORTS.frontendPort,
      backendPort: Number(parsed.backendPort) || DEFAULT_PORTS.backendPort,
    }
  } catch {
    return DEFAULT_PORTS
  }
}

export function buildFrontendOrigins(frontendPort: number) {
  return [
    `http://localhost:${frontendPort}`,
    `http://127.0.0.1:${frontendPort}`,
  ]
}
