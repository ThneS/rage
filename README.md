# RAG 参数调测平台

一个用于 RAG（检索增强生成）系统参数调优的全栈平台，支持文档处理、向量化、搜索和生成等完整流程。

## 功能特性

- 📄 **文档管理**：支持多种格式文档上传和处理
- ⚙️ **参数调优**：可视化的参数配置和调优界面
- 🔍 **向量搜索**：基于 Milvus 的高性能向量搜索
- 🤖 **模型集成**：支持 OpenAI、DeepSeek 等多种模型
- 📊 **实时监控**：处理流程的实时状态监控
- 🎛️ **系统设置**：完整的前后端配置管理

## 技术栈

### 后端
- **框架**：FastAPI
- **语言**：Python 3.11+
- **数据库**：SQLite/PostgreSQL
- **向量数据库**：Milvus
- **文档处理**：LangChain, LlamaIndex

### 前端
- **框架**：React 18
- **语言**：TypeScript
- **构建工具**：Vite
- **UI 库**：Ant Design
- **状态管理**：Redux Toolkit

### DevOps
- **CI/CD**：GitHub Actions
- **容器化**：Docker + Docker Compose
- **镜像仓库**：GitHub Container Registry
- **部署方式**：Docker 容器化部署

## 🛠️ 开发工具

为了提供更好的跨平台开发体验，我们提供了三种版本的开发工具脚本：

### 脚本版本对比

| 平台 | 脚本文件 | 适用场景 | 推荐指数 |
|------|----------|----------|----------|
| **Python** | `scripts/dev.py` | 跨平台，功能最全 | ⭐⭐⭐⭐⭐ |
| **Shell** | `scripts/dev.sh` | Linux/macOS，性能最佳 | ⭐⭐⭐⭐ |
| **批处理** | `scripts/dev.bat` | Windows 原生支持 | ⭐⭐⭐ |

### 可用命令

所有脚本都支持以下命令：

#### 开发相关
- `install` - 安装所有依赖
- `install-backend` - 只安装后端依赖
- `install-frontend` - 只安装前端依赖
- `dev` - 显示开发环境启动说明
- `dev-backend` - 启动后端开发服务器
- `dev-frontend` - 启动前端开发服务器

#### 构建相关
- `build` - 构建前后端项目
- `build-frontend` - 只构建前端
- `build-backend` - 只构建后端
- `clean` - 清理构建产物

#### 测试相关
- `test` - 运行所有测试
- `test-frontend` - 运行前端测试
- `test-backend` - 运行后端测试

#### Docker 相关
- `docker-build` - 构建 Docker 镜像
- `docker-up` - 启动 Docker 服务
- `docker-down` - 停止 Docker 服务
- `docker-logs` - 查看 Docker 日志

#### 其他
- `status` - 检查服务状态
- `help` - 显示帮助信息

### 使用示例

```bash
# Linux/macOS - Shell 版本
./scripts/dev.sh install
./scripts/dev.sh docker-up

# Windows - 批处理版本
scripts\dev.bat install
scripts\dev.bat docker-up

# 任何平台 - Python 版本
python scripts/dev.py install
python scripts/dev.py docker-up
```

## 快速开始

### 开发环境

#### 前置要求
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose (可选)

#### 使用开发工具脚本

**Linux/macOS:**
```bash
# 安装依赖
./scripts/dev.sh install

# 启动开发环境 (需要两个终端)
# 终端 1:
./scripts/dev.sh dev-backend

# 终端 2:
./scripts/dev.sh dev-frontend
```

**Windows:**
```cmd
# 安装依赖
scripts\dev.bat install

# 启动开发环境 (需要两个命令提示符)
# 命令提示符 1:
scripts\dev.bat dev-backend

# 命令提示符 2:
scripts\dev.bat dev-frontend
```

**Python 版本 (跨平台):**
```bash
# 安装依赖
python scripts/dev.py install

# 启动开发环境
python scripts/dev.py dev-backend  # 终端 1
python scripts/dev.py dev-frontend # 终端 2
```

### Docker 部署

#### 开发环境部署
```bash
# 一键部署（包含 Milvus）
# Linux/macOS:
./scripts/dev.sh docker-up
# 或者: python scripts/dev.py docker-up

# Windows:
scripts\dev.bat docker-up

# 访问应用
# 前端: http://localhost
# 后端 API: http://localhost:8000
# API 文档: http://localhost:8000/docs
```

#### 生产环境部署
```bash
# 使用构建脚本
# Linux/macOS:
./scripts/build.sh
./scripts/deploy.sh

# Windows:
scripts\build.bat
scripts\deploy.bat

# 或使用生产配置
docker-compose -f deploy/docker-compose.prod.yml up -d
```

## 🚀 CI/CD 流水线

本项目使用 GitHub Actions 实现自动化的 CI/CD 流水线：

### 流水线概览
```
代码推送 → 测试 → 构建镜像 → 自动部署
```

### 触发条件
- **main 分支推送** → 自动部署到生产环境
- **develop 分支推送** → 自动部署到开发环境
- **Pull Request** → 运行测试验证
- **手动触发** → 完整流水线

### 自动化功能
- ✅ 前后端并行测试（类型检查、ESLint、单元测试）
- ✅ Docker 镜像自动构建和推送
- ✅ 基于分支的环境部署
- ✅ 镜像推送到 GitHub Container Registry

### 查看状态
- 在 GitHub Actions 页面查看流水线状态
- 在 Packages 页面查看构建的镜像
- 支持手动重新运行失败的作业

详细配置说明请参考 [CI/CD 文档](.github/README.md)。

## 部署方案

### 方案一：Docker 容器化部署（推荐）

**优势**：
- 环境一致性好
- 部署简单快速
- 易于扩展和维护
- 支持多环境部署

**部署步骤**：
1. 克隆项目代码
2. 配置环境变量
3. 运行构建脚本
4. 启动服务

```bash
git clone <repository-url>
cd rage
cp backend/env.example backend/.env
# 编辑 .env 文件配置

# Linux/macOS:
./scripts/dev.sh install
./scripts/dev.sh docker-up

# Windows:
scripts\dev.bat install
scripts\dev.bat docker-up

# Python (跨平台):
python scripts/dev.py install
python scripts/dev.py docker-up
```

### 方案二：传统部署

**适用场景**：
- 需要更细粒度的控制
- 已有的服务器环境
- 特殊的网络要求

**部署步骤**：
1. 安装 Python、Node.js 环境
2. 安装并配置 PostgreSQL、Redis、Milvus
3. 构建前后端应用
4. 配置 Nginx 反向代理
5. 使用 systemd 或 PM2 管理进程

### 方案三：云原生部署

**适用场景**：
- Kubernetes 环境
- 需要高可用和自动扩展
- 微服务架构

**特性**：
- 支持 Helm Chart 部署
- 自动扩缩容
- 服务发现和负载均衡
- 滚动更新

## 配置说明

### 环境变量

#### 后端配置 (.env)
```bash
# API 配置
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_BASE=https://api.openai.com/v1
DEEPSEEK_API_KEY=your_deepseek_api_key

# 数据库配置
DATABASE_URL=sqlite:///./rage.db
# 生产环境使用 PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost:5432/rage_db

# Milvus 配置
MILVUS_HOST=localhost
MILVUS_PORT=19530

# 应用配置
DEBUG=false
LOG_LEVEL=INFO
```

#### 前端配置
前端配置通过设置页面进行管理，支持：
- 连接设置（主机、端口、协议）
- 主题配置（明亮/暗黑模式、主色调）
- 语言设置（中文/英文）
- 功能开关（自动保存、通知等）

## 监控和维护

### 日志管理
- 后端日志：`backend/logs/`
- Nginx 日志：`logs/nginx/`
- 容器日志：`docker-compose logs [service]`

### 健康检查
```bash
# 检查服务状态
curl http://localhost:8000/
curl http://localhost/

# 查看容器状态
docker-compose ps

# 查看服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 备份和恢复
```bash
# 数据备份
docker-compose exec postgres pg_dump -U rage rage_db > backup.sql
docker cp rage-milvus:/var/lib/milvus ./milvus_backup

# 数据恢复
docker-compose exec postgres psql -U rage rage_db < backup.sql
docker cp ./milvus_backup rage-milvus:/var/lib/milvus
```

## 性能优化

### 前端优化
- 代码分割和懒加载
- 静态资源 CDN 加速
- Gzip 压缩
- 缓存策略

### 后端优化
- 数据库连接池
- Redis 缓存
- 异步处理
- API 限流

### 基础设施优化
- 负载均衡
- 数据库读写分离
- 向量数据库集群
- 容器资源限制

## 故障排除

### 常见问题

1. **Milvus 连接失败**
   ```bash
   # 检查 Milvus 服务状态
   docker-compose logs milvus
   # 重启 Milvus 服务
   docker-compose restart milvus
   ```

2. **前端无法访问后端 API**
   ```bash
   # 检查网络连接
   docker-compose exec frontend curl backend:8000
   # 检查 nginx 配置
   docker-compose exec frontend cat /etc/nginx/nginx.conf
   ```

3. **文件上传失败**
   ```bash
   # 检查上传目录权限
   ls -la backend/uploads/
   # 检查磁盘空间
   df -h
   ```

## 开发指南

### 项目结构
```
rage/
├── backend/                 # 后端应用
│   ├── app/                # 应用代码
│   ├── requirements.txt    # Python 依赖
│   └── Dockerfile         # 后端镜像
├── frontend/               # 前端应用
│   ├── src/               # 源代码
│   ├── package.json       # Node 依赖
│   └── Dockerfile         # 前端镜像
├── scripts/               # 部署脚本
├── deploy/                # 部署配置
└── docker-compose.yml     # 开发环境配置
```

### 贡献指南
1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 支持

如有问题或建议，请创建 Issue 或联系维护者。

## 🎯 开发环境特性

本项目专门针对开发环境进行了优化：

### Milvus Standalone 模式
- **简化部署**: 使用单容器 Milvus，无需 etcd 和 MinIO
- **快速启动**: 30-60秒启动时间 vs 传统集群模式的 2-3分钟
- **资源节约**: 内存占用 ~512MB vs 集群模式 ~2GB
- **易于调试**: 集中式日志，问题排查更简单

### 热重载支持
- **后端**: uvicorn --reload 自动重启
- **前端**: Vite HMR 热更新
- **实时开发**: 代码修改立即生效

详细说明请参考 [开发环境配置文档](DEVELOPMENT.md)。