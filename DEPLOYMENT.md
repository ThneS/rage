# 部署指南

RAG 参数调测平台的完整部署指南，包含多种部署方案和配置说明。

## 🚀 快速部署

### 一键部署（推荐）

```bash
# 克隆项目
git clone <repository-url>
cd rage

# 配置环境变量
cp backend/env.example backend/.env
# 编辑 .env 文件，配置 API Keys 等

# 启动服务
docker-compose up -d

# 访问应用
echo "前端: http://localhost"
echo "后端: http://localhost:8000"
echo "API文档: http://localhost:8000/docs"
```

## 📋 部署方案对比

| 方案 | 适用场景 | 复杂度 | 推荐指数 |
|------|----------|--------|----------|
| Docker 开发环境 | 本地开发、快速验证 | 低 | ⭐⭐⭐⭐⭐ |
| Docker 生产环境 | 中小型生产部署 | 中 | ⭐⭐⭐⭐ |
| 传统部署 | 单机部署、特殊需求 | 中 | ⭐⭐⭐ |
| Kubernetes | 大规模生产、微服务 | 高 | ⭐⭐⭐⭐ |

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
docker-compose up -d
```

**服务架构**：
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │   Milvus    │
│  (React)    │───▶│  (FastAPI)  │───▶│ (Vector DB) │
│   :80       │    │   :8000     │    │   :19530    │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 生产环境

**特点**：
- 优化的性能配置
- 包含 PostgreSQL、Redis、Nginx
- 支持负载均衡和高可用

```bash
# 使用生产配置
docker-compose -f deploy/docker-compose.prod.yml up -d

# 或使用部署脚本
./scripts/deploy.sh
```

**服务架构**：
```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Nginx  │───▶│Frontend │    │ Backend │───▶│PostgreSQL│
│   :80   │    │ (React) │    │(FastAPI)│    │  :5432  │
│   :443  │    │         │    │  :8000  │    └─────────┘
└─────────┘    └─────────┘    └─────────┘           │
                                   │                │
                              ┌─────────┐    ┌─────────┐
                              │  Redis  │    │ Milvus  │
                              │  :6379  │    │ :19530  │
                              └─────────┘    └─────────┘
```

## 🔧 传统部署

适用于需要精细控制或特殊环境要求的场景。

### 环境准备

```bash
# 安装 Python 3.11+
curl -sSL https://install.python-poetry.org | python3 -

# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装数据库
sudo apt-get install postgresql redis-server

# 安装 Milvus
wget https://github.com/milvus-io/milvus/releases/download/v2.3.4/milvus-standalone-docker-compose.yml
docker-compose -f milvus-standalone-docker-compose.yml up -d
```

### 后端部署

```bash
cd backend

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

# 使用 Nginx 提供静态文件服务
sudo cp -r dist/* /var/www/html/
```

### Nginx 配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## ☸️ Kubernetes 部署

适用于大规模生产环境和微服务架构。

### 基础配置

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: rage
---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: rage-config
  namespace: rage
data:
  DATABASE_URL: "postgresql://rage:password@postgres:5432/rage_db"
  MILVUS_HOST: "milvus"
  MILVUS_PORT: "19530"
```

### 后端部署

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: rage
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: ghcr.io/your-org/rage-backend:latest
        ports:
        - containerPort: 8000
        envFrom:
        - configMapRef:
            name: rage-config
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

### 前端部署

```yaml
# frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: rage
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: ghcr.io/your-org/rage-frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"
```

### 服务和 Ingress

```yaml
# services.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: rage
spec:
  selector:
    app: backend
  ports:
  - port: 8000
    targetPort: 8000
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: rage
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: rage-ingress
  namespace: rage
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8000
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
# 生产环境推荐 PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost:5432/rage_db

# Milvus 配置
MILVUS_HOST=localhost
MILVUS_PORT=19530

# 应用配置
DEBUG=false
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost", "https://your-domain.com"]

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
curl -f http://localhost/ || echo "前端服务异常"

# 检查数据库连接
curl -f http://localhost:8000/health || echo "数据库连接异常"

# 检查 Milvus 连接
curl -f http://localhost:9091/healthz || echo "Milvus 服务异常"
```

### 日志管理

```bash
# Docker 环境
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f milvus

# Kubernetes 环境
kubectl logs -f deployment/backend -n rage
kubectl logs -f deployment/frontend -n rage
```

### 数据备份

```bash
# PostgreSQL 备份
docker-compose exec postgres pg_dump -U rage rage_db > backup_$(date +%Y%m%d).sql

# Milvus 数据备份
docker cp rage-milvus:/var/lib/milvus ./milvus_backup_$(date +%Y%m%d)

# 上传文件备份
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz backend/uploads/
```

## 🚨 故障排除

### 常见问题

1. **Milvus 连接失败**
   ```bash
   # 检查 Milvus 状态
   docker-compose ps milvus
   docker-compose logs milvus

   # 重启 Milvus
   docker-compose restart milvus
   ```

2. **前端无法访问后端**
   ```bash
   # 检查网络连通性
   docker-compose exec frontend curl backend:8000

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

4. **数据库连接问题**
   ```bash
   # 检查数据库服务
   docker-compose ps postgres

   # 测试数据库连接
   docker-compose exec postgres psql -U rage rage_db -c "SELECT 1;"
   ```

### 性能优化

1. **数据库优化**
   - 定期清理日志表
   - 优化查询索引
   - 配置连接池

2. **缓存优化**
   - 启用 Redis 缓存
   - 配置 CDN 加速
   - 优化静态资源

3. **容器优化**
   - 调整资源限制
   - 启用健康检查
   - 配置重启策略

## 🔄 更新和回滚

### 更新部署

```bash
# Docker 环境
docker-compose pull
docker-compose up -d

# Kubernetes 环境
kubectl set image deployment/backend backend=ghcr.io/your-org/rage-backend:new-tag -n rage
kubectl set image deployment/frontend frontend=ghcr.io/your-org/rage-frontend:new-tag -n rage
```

### 回滚操作

```bash
# Docker 环境
docker-compose down
docker-compose up -d

# Kubernetes 环境
kubectl rollout undo deployment/backend -n rage
kubectl rollout undo deployment/frontend -n rage
```

## 📞 技术支持

如遇到部署问题，请：
1. 查看相关日志文件
2. 检查环境配置
3. 参考故障排除部分
4. 创建 GitHub Issue 寻求帮助

---

部署成功后，访问应用并在设置页面完成初始配置即可开始使用！