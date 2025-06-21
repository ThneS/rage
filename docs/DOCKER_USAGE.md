# 🐳 Docker 使用指南

本指南介绍如何使用 Docker 部署 RAG 参数调测平台。

## 🚀 快速开始

### 前提条件

- Docker 20.10+
- Docker Compose 2.0+

### 一键启动

```bash
# 克隆项目
git clone <repository-url>
cd rage

# 配置环境变量
cp backend/env.example backend/.env
# 编辑 .env 文件，配置必要的 API Keys

# 启动开发环境
docker compose -f docker/docker-compose.dev.yml up -d

# 或启动基础环境
docker compose -f docker/docker-compose.yml up -d
```

## 📋 部署方式

### 方式一：开发环境（推荐）

适合本地开发和测试：

```bash
# 启动开发环境
docker compose -f docker/docker-compose.dev.yml up -d

# 查看日志
docker compose -f docker/docker-compose.dev.yml logs -f

# 停止服务
docker compose -f docker/docker-compose.dev.yml down
```

**特点**：
- 支持热重载
- 完整的开发工具链
- 实时代码同步

### 方式二：基础环境

适合演示和简单部署：

```bash
# 启动基础环境
docker compose -f docker/docker-compose.yml up -d

# 查看服务状态
docker compose -f docker/docker-compose.yml ps

# 停止服务
docker compose -f docker/docker-compose.yml down
```

**特点**：
- 简化配置
- 快速启动
- 资源占用少

### 方式三：使用开发脚本

```bash
# 使用开发脚本启动
python scripts/dev.py docker-up

# 查看服务状态
python scripts/dev.py status

# 停止服务
python scripts/dev.py docker-down
```

## 🔧 配置说明

### 环境变量

后端环境变量 (`backend/.env`)：

```bash
# API 配置
OPENAI_API_KEY=your_openai_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# 数据库配置
DATABASE_URL=sqlite:///./rage.db

# Milvus 配置
MILVUS_HOST=milvus
MILVUS_PORT=19530

# 应用配置
DEBUG=true
LOG_LEVEL=DEBUG
CORS_ORIGINS=["http://localhost:5173"]
```

### 端口映射

| 服务 | 开发环境端口 | 基础环境端口 | 描述 |
|------|-------------|-------------|------|
| 前端 | 5173 | 5173 | React 应用 |
| 后端 | 8000 | 8000 | FastAPI 服务 |
| Milvus | 19530 | 19530 | 向量数据库 |
| Milvus Web | 9091 | 9091 | 监控界面 |

## 📁 数据持久化

### 数据卷

```bash
# 查看数据卷
docker volume ls | grep rage

# 备份数据
docker run --rm -v rage_backend_data:/data -v $(pwd):/backup alpine tar czf /backup/backend_backup.tar.gz -C /data .
docker run --rm -v rage_milvus_data:/data -v $(pwd):/backup alpine tar czf /backup/milvus_backup.tar.gz -C /data .
```

### 目录结构

```
rage/
├── backend/uploads/   # 上传文件
├── backend/logs/      # 日志文件
└── docker-volumes/    # Docker 数据卷
    ├── backend_data/
    └── milvus_data/
```

## 🏥 健康检查

### 检查服务状态

```bash
# 检查所有服务
docker compose -f docker/docker-compose.dev.yml ps

# 检查特定服务
docker compose -f docker/docker-compose.dev.yml logs backend
docker compose -f docker/docker-compose.dev.yml logs frontend
docker compose -f docker/docker-compose.dev.yml logs milvus
```

### 健康检查端点

```bash
# 后端健康检查
curl http://localhost:8000/

# Milvus 健康检查
curl http://localhost:9091/healthz

# 前端访问
curl http://localhost:5173/
```

## 🔄 更新和维护

### 更新镜像

```bash
# 拉取最新镜像
docker compose -f docker/docker-compose.dev.yml pull

# 重启服务
docker compose -f docker/docker-compose.dev.yml up -d --force-recreate
```

### 清理资源

```bash
# 停止所有服务
docker compose -f docker/docker-compose.dev.yml down

# 清理未使用的镜像
docker image prune -f

# 清理未使用的容器
docker container prune -f

# 清理未使用的数据卷（谨慎使用）
docker volume prune -f
```

## 🛠 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口占用
   lsof -i :8000
   lsof -i :5173
   lsof -i :19530
   ```

2. **容器启动失败**
   ```bash
   # 查看详细日志
   docker compose -f docker/docker-compose.dev.yml logs <service-name>

   # 重新构建镜像
   docker compose -f docker/docker-compose.dev.yml build --no-cache
   ```

3. **数据库连接问题**
   ```bash
   # 检查 Milvus 状态
   docker compose -f docker/docker-compose.dev.yml exec milvus curl localhost:9091/healthz
   ```

4. **权限问题**
   ```bash
   # 修复文件权限
   sudo chown -R $USER:$USER backend/uploads/
   sudo chown -R $USER:$USER backend/logs/
   ```

### 性能优化

1. **资源限制**
   - 根据机器配置调整容器资源限制
   - 监控内存和 CPU 使用情况

2. **存储优化**
   - 定期清理日志文件
   - 使用 SSD 存储提高 I/O 性能

3. **网络优化**
   - 使用本地 Docker 网络
   - 避免不必要的端口映射

## 📚 相关链接

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [项目部署指南](DEPLOYMENT.md)
- [开发环境配置](DEVELOPMENT.md)