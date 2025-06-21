# 🚀 RAG 参数调测平台部署指南

本文档介绍如何部署 RAG 参数调测平台的各种方式。

## 🚀 部署方案对比

| 部署方式 | 适用场景 | 复杂度 | 推荐度 |
|------|----------|--------|----------|
| Docker 开发环境 | 本地开发、快速验证 | 低 | ⭐⭐⭐⭐⭐ |
| Docker 基础环境 | 简单部署、演示 | 低 | ⭐⭐⭐⭐ |
| 传统部署 | 单机部署、特殊需求 | 中 | ⭐⭐⭐ |

## 🐳 Docker 部署（推荐）

### 开发环境

**特点**：
- 快速启动，适合开发和测试
- 包含完整的开发工具链
- 支持热重载和调试

```bash
# 使用开发工具脚本
./scripts/dev.sh docker-up

# 或直接使用 docker-compose
docker compose -f docker/docker-compose.dev.yml up -d
```

**服务架构**：
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │───▶│   Backend   │───▶│   Milvus    │
│ (Vite Dev)  │    │  (FastAPI)  │    │ (Vector DB) │
│   :5173     │    │   :8000     │    │   :19530    │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 基础环境

**特点**：
- 简化的配置，易于部署
- 使用 SQLite 数据库
- Milvus Standalone 模式
- 适合演示和小规模使用

```bash
# 使用基础配置
docker compose -f docker/docker-compose.yml up -d
```

**服务架构**：
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Frontend   │───▶│   Backend   │───▶│   Milvus    │
│ (Static)    │    │  (FastAPI)  │    │ (Standalone)│
│   :5173     │    │   :8000     │    │   :19530    │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 🔧 传统部署

适用于需要精细控制或特殊环境要求的场景。

### 环境准备

```bash
# 安装 Python 3.11+
pip install --upgrade pip

# 安装 Node.js 18+
# 从 https://nodejs.org/ 下载安装

# 安装 Milvus (使用 Docker)
docker run -d \
  --name milvus-standalone \
  -p 19530:19530 \
  -p 9091:9091 \
  -v milvus_data:/var/lib/milvus \
  milvusdb/milvus:v2.3.4 \
  milvus run standalone
```

### 后端部署

```bash
cd backend

# 创建虚拟环境
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# 或 .venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp env.example .env
# 编辑 .env 文件

# 启动服务
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 前端部署

```bash
cd frontend

# 安装依赖
npm install

# 构建生产版本
npm run build

# 使用简单的静态文件服务器
npx serve -s dist -l 5173
```

## 🔐 环境配置

### 后端环境变量

```bash
# API 配置
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_BASE=https://api.openai.com/v1
DEEPSEEK_API_KEY=your_deepseek_api_key

# 数据库配置
DATABASE_URL=sqlite:///./rage.db

# Milvus 配置
MILVUS_HOST=localhost
MILVUS_PORT=19530

# 应用配置
DEBUG=false
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:5173"]

# 文件上传
MAX_UPLOAD_SIZE=100MB
UPLOAD_PATH=./uploads
```

### 前端配置

前端配置通过界面设置页面管理，包括：
- API 连接配置
- 主题和语言设置
- 功能开关配置

## 📊 监控和维护

### 健康检查

```bash
# 检查服务状态
curl -f http://localhost:8000/ || echo "后端服务异常"
curl -f http://localhost:5173/ || echo "前端服务异常"

# 检查数据库连接
curl -f http://localhost:8000/health || echo "数据库连接异常"

# 检查 Milvus 连接
curl -f http://localhost:9091/healthz || echo "Milvus 服务异常"
```

### 日志管理

```bash
# Docker 环境
docker compose -f docker/docker-compose.dev.yml logs -f backend
docker compose -f docker/docker-compose.dev.yml logs -f frontend
docker compose -f docker/docker-compose.dev.yml logs -f milvus
```

### 数据备份

```bash
# SQLite 备份
cp backend/rage.db backup_$(date +%Y%m%d).db

# Milvus 数据备份
docker cp milvus-standalone:/var/lib/milvus ./milvus_backup_$(date +%Y%m%d)

# 上传文件备份
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/uploads/
```

## 🚨 故障排除

### 常见问题

1. **Milvus 连接失败**
   ```bash
   # 检查 Milvus 状态
   docker ps | grep milvus
   docker logs milvus-standalone

   # 重启 Milvus
   docker restart milvus-standalone
   ```

2. **前端无法访问后端**
   ```bash
   # 检查后端服务
   curl http://localhost:8000/

   # 检查 CORS 配置
   grep CORS_ORIGINS backend/.env
   ```

3. **文件上传失败**
   ```bash
   # 检查上传目录权限
   ls -la backend/uploads/
   chmod 755 backend/uploads/

   # 检查磁盘空间
   df -h
   ```

### 性能优化

1. **数据库优化**
   - 定期清理日志表
   - 优化查询索引

2. **缓存优化**
   - 配置浏览器缓存
   - 优化静态资源

3. **容器优化**
   - 调整资源限制
   - 启用健康检查

## 🔄 更新和回滚

### 更新部署

```bash
# Docker 环境
docker compose -f docker/docker-compose.dev.yml pull
docker compose -f docker/docker-compose.dev.yml up -d
```

### 回滚操作

```bash
# Docker 环境
docker compose -f docker/docker-compose.dev.yml down
docker compose -f docker/docker-compose.dev.yml up -d
```

## 📞 技术支持

如遇到部署问题，请：
1. 查看相关日志文件
2. 检查环境配置
3. 参考故障排除部分
4. 创建 GitHub Issue 寻求帮助

---

部署成功后，访问应用并在设置页面完成初始配置即可开始使用！