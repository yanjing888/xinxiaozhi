# 芯小智 — RISC-V 智能助教 Web 端

RISC-V 指令集专属智能助教，对接 Dify 对话型 API（流式输出）。

## 快速启动

```bash
# 安装依赖
npm install

# 配置 API（复制并填入 Key，若已有 .env.local 可跳过）
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

浏览器访问 `http://localhost:5173`

## 环境变量

| 变量 | 说明 |
|------|------|
| `VITE_DIFY_BASE_URL` | Dify API 地址，如 `http://188.18.18.149:5001/v1` |
| `VITE_DIFY_API_KEY` | Dify 应用 API Key |

开发模式下请求通过 Vite 代理 `/api/dify` 转发，避免 CORS 问题。

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- react-markdown + 语法高亮（RISC-V 汇编 / C）

## 构建

```bash
npm run build
npm run preview
```
