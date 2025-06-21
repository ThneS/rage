# RAG 参数调测平台 - 快速启动指南

## 🚀 一键启动

### 前置条件
- Docker 和 Docker Compose 已安装
- 网络连接正常（用于拉取 Docker 镜像）

### 启动步骤

```bash
# 1. 配置环境变量
cp backend/env.example backend/.env
# 编辑 .env 文件，至少配置一个 API Key

# 2. 启动开发环境
./scripts/dev.sh docker-up
# 或 Windows: scripts\dev.bat docker-up
# 或 Python: python scripts/dev.py docker-up

# 3. 查看启动日志
./scripts/dev.sh docker-logs

# 4. 访问应用
# 前端: http://localhost:5173
# 后端: http://localhost:8000
# API 文档: http://localhost:8000/docs
```

## 🔧 网络问题解决

如果遇到 Docker 镜像拉取失败，可以尝试以下解决方案：

### 1. 配置 Docker 镜像加速器

**macOS/Windows (Docker Desktop):**
```json
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

**Linux:**
```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 2. 手动拉取镜像

```bash
# 拉取所需镜像
docker pull python:3.11-slim
docker pull node:18-alpine
docker pull milvusdb/milvus:v2.3.4
docker pull redis:7-alpine
docker pull nginx:alpine

# 然后重新启动
./scripts/dev.sh docker-up
```

### 3. 使用本地开发模式

如果 Docker 网络问题持续，可以使用本地开发模式：

```bash
# 后端
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 前端 (新终端)
cd frontend
npm install
npm run dev
```

## 📋 环境变量配置

### 最小配置 (`backend/.env`)

```env
# API Keys (至少配置一个)
OPENAI_API_KEY=your_openai_api_key_here
# 或
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 开发环境设置
DEBUG=true
LOG_LEVEL=DEBUG

# Milvus 配置 (Docker 模式)
MILVUS_HOST=milvus
MILVUS_PORT=19530

# 本地开发模式 Milvus 配置
# MILVUS_HOST=localhost
# MILVUS_PORT=19530
```

## 🐛 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口占用
   netstat -tlnp | grep :8000
   netstat -tlnp | grep :5173
   netstat -tlnp | grep :19530
   ```

2. **容器启动失败**
   ```bash
   # 查看容器状态
   docker ps -a

   # 查看容器日志
   docker logs rage-backend-dev
   docker logs rage-milvus-dev
   ```

3. **Milvus 连接失败**
   ```bash
   # 检查 Milvus 健康状态
   curl http://localhost:9091/healthz

   # 进入后端容器测试连接
   docker exec -it rage-backend-dev bash
   ping milvus
   ```

## 🎯 开发工作流

### 日常开发

```bash
# 启动开发环境
./scripts/dev.sh docker-up

# 实时查看日志
./scripts/dev.sh docker-logs

# 修改代码 -> 自动重载生效

# 运行测试
./scripts/dev.sh test

# 停止环境
./scripts/dev.sh docker-down
```

### 调试技巧

```bash
# 进入容器调试
docker exec -it rage-backend-dev bash
docker exec -it rage-milvus-dev bash

# 查看资源使用
docker stats

# 重启特定服务
docker restart rage-backend-dev
```

## 📊 服务状态检查

```bash
# 检查所有服务状态
./scripts/dev.sh status

# 手动检查
curl http://localhost:8000/        # 后端
curl http://localhost:5173/        # 前端
curl http://localhost:9091/healthz # Milvus
```

## 🚀 生产环境部署

```bash
# 使用生产配置
docker compose -f deploy/docker-compose.prod.yml up -d

# 或删除开发配置使用默认配置
mv docker-compose.dev.yml docker-compose.dev.yml.bak
./scripts/dev.sh docker-up
```

## 📞 获取帮助

1. 查看详细文档：`DEVELOPMENT.md`
2. 查看部署文档：`DEPLOYMENT.md`
3. 查看项目总结：`PROJECT_SUMMARY.md`
4. 运行帮助命令：`./scripts/dev.sh help`

---

**提示**: 如果遇到网络问题，建议先配置 Docker 镜像加速器，然后重试启动命令。