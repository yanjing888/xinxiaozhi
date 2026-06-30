# 芯小智 — RISC-V 智能助教 Web 端

RISC-V 指令集专属智能助教。前端 React + 后端 NestJS + MySQL，对话由 Dify 提供 AI 能力。

## 架构

```
浏览器 → React (Vite) → NestJS API → MySQL
                              ↘ Dify (流式对话)
```

## 端口配置（现场改这一处）

编辑项目根目录 **`config/ports.json`**：

```json
{
  "frontendPort": 5173,
  "backendPort": 8081
}
```

- 前端 Vite 开发服务器、代理目标端口均从此读取
- 后端 API 监听端口、CORS 允许的前端地址均从此读取
- 修改后需**重启**前后端服务

端口只从 `config/ports.json` 读取；若端口冲突，修改该文件后重启前后端服务。`CORS_ORIGIN` 仍可在多域名部署时覆盖默认前端来源。

## 快速启动

### 1. 启动 MySQL

```bash
docker compose up -d
```

### 2. 配置后端

```bash
cd backend
cp .env.example .env
# 编辑 .env，填入 DIFY_API_KEY、JWT_SECRET 等
npm install
```

### 3. 启动前后端

在项目根目录：

```bash
npm install
npm run dev:all
```

- 前端：http://localhost:{frontendPort}（见 `config/ports.json`）
- 后端 API：http://localhost:{backendPort}/api

也可分开启动：

```bash
npm run dev:api   # 仅后端
npm run dev       # 仅前端
```

### 4. 前端环境变量（可选）

```bash
cp .env.example .env.local
```

默认 `VITE_API_BASE_URL=/api`，开发时由 Vite 代理到 `8081`。

## 数据库表

| 表 | 说明 |
|---|---|
| `users` | 用户账号 |
| `chat_sessions` | 对话会话 |
| `chat_messages` | 消息记录 |

开发环境 TypeORM `synchronize: true` 会自动建表。

## 技术栈

- 前端：React 19 + TypeScript + Vite + Tailwind CSS 4
- 后端：NestJS + TypeORM + MySQL + JWT
- AI：Dify 对话 API（Key 仅存后端）

## 构建

```bash
npm run build
npm run build:api
```
