# Docker 镜像使用指南

## 📦 镜像信息

### 可用镜像
- **后端**: `ghcr.io/thnes/rage-backend:latest`
- **前端**: `ghcr.io/thnes/rage-frontend:latest`

### 镜像标签
- `latest`: 最新版本（main 分支）
- `<commit-sha>`: 特定提交版本（推荐生产环境使用）

## 🚀 快速开始

### 1. 简单运行

```bash
# 拉取镜像
docker pull ghcr.io/thnes/rage-backend:latest
docker pull ghcr.io/thnes/rage-frontend:latest

# 运行后端
docker run -d \
  --name rage-backend \
  -p 8000:8000 \
  ghcr.io/thnes/rage-backend:latest

# 运行前端
docker run -d \
  --name rage-frontend \
  -p 80:80 \
  ghcr.io/thnes/rage-frontend:latest
```

### 2. 使用 Docker Compose（推荐）

```bash
# 使用生产环境配置
docker-compose -f docker-compose.prod.yml up -d

# 或使用部署脚本
./scripts/deploy-prod.sh
```

## 🔧 配置选项

### 后端环境变量

```bash
ENVIRONMENT=production          # 运行环境
LOG_LEVEL=INFO                 # 日志级别
CORS_ORIGINS=http://localhost   # CORS 允许的源
MAX_FILE_SIZE=104857600        # 最大文件大小（字节）
```

### 前端环境变量

```bash
NODE_ENV=production                    # Node 环境
REACT_APP_API_URL=http://localhost:8000  # 后端 API 地址
```

## 📁 数据持久化

### 后端数据卷

```bash
./data:/app/data           # 数据文件
./logs:/app/logs           # 日志文件
./uploads:/app/uploads     # 上传文件
```

### 目录结构

```
rage/
├── data/              # 应用数据
├── logs/              # 日志文件
├── uploads/           # 上传的文件
└── backups/           # 备份文件
```

## 🔐 私有镜像访问

如果镜像是私有的，需要先登录：

```bash
# 登录 GitHub Container Registry
docker login ghcr.io -u ThneS

# 输入 Personal Access Token 作为密码
```

## 🏥 健康检查

### 检查服务状态

```bash
# 查看容器状态
docker-compose -f docker-compose.prod.yml ps

# 查看服务日志
docker-compose -f docker-compose.prod.yml logs -f

# 健康检查
curl http://localhost:8000/health  # 后端
curl http://localhost:80           # 前端
```

### 服务地址

- **前端**: http://localhost
- **后端 API**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs

## 🔄 更新部署

### 方法一：使用部署脚本

```bash
./scripts/deploy-prod.sh
```

### 方法二：手动更新

```bash
# 拉取最新镜像
docker-compose -f docker-compose.prod.yml pull

# 重启服务
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

## 🛠 故障排除

### 常见问题

1. **镜像拉取失败**
   ```bash
   # 检查网络连接
   docker pull hello-world

   # 检查认证
   docker login ghcr.io
   ```

2. **服务启动失败**
   ```bash
   # 查看日志
   docker-compose -f docker-compose.prod.yml logs backend
   docker-compose -f docker-compose.prod.yml logs frontend
   ```

3. **端口冲突**
   ```bash
   # 检查端口占用
   netstat -tulpn | grep :8000
   netstat -tulpn | grep :80
   ```

### 清理资源

```bash
# 停止所有服务
docker-compose -f docker-compose.prod.yml down

# 清理未使用的镜像
docker image prune -f

# 清理未使用的容器
docker container prune -f
```

## 📋 生产环境建议

### 安全配置

1. **使用非 root 用户运行**
2. **配置防火墙规则**
3. **使用 HTTPS**
4. **定期备份数据**

### 监控配置

1. **设置日志轮转**
2. **配置健康检查**
3. **监控资源使用**
4. **设置告警**

### 性能优化

1. **调整内存限制**
2. **配置缓存**
3. **使用负载均衡**
4. **优化数据库连接**

## 🔗 相关链接

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)