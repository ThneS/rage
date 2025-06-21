# 基础阶段
FROM node:18-alpine AS base

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装所有依赖（包括开发依赖）
RUN npm ci

# 开发环境阶段
FROM base AS development

# 开发环境配置
ENV NODE_ENV=development

# 暴露 Vite 开发服务器端口
EXPOSE 5173

# 开发模式启动命令
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# 构建阶段
FROM base AS builder

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 构建完成后，dist 目录包含构建产物