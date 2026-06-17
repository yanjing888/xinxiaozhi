import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { buildFrontendOrigins, loadPortsConfig } from './ports-config'

async function bootstrap() {
  const ports = loadPortsConfig()
  const app = await NestFactory.create(AppModule)

  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
    : buildFrontendOrigins(ports.frontendPort)

  app.setGlobalPrefix('api')
  app.enableCors({ origin: corsOrigin, credentials: true })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  const port = Number(process.env.PORT) || ports.backendPort
  await app.listen(port)
  console.log(`芯小智 API 运行于 http://localhost:${port}/api`)
  console.log(`前端端口配置: ${ports.frontendPort}（见 config/ports.json）`)
}

bootstrap()
