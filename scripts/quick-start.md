# RAG 参数调测平台 - 快速开始指南

本指南将帮助您快速启动和运行 RAG 参数调测平台。

## 🚀 一键启动 (推荐)

### 使用 Docker (最简单)

```bash
# 1. 克隆项目
git clone <repository-url>
cd rage

# 2. 配置环境变量
cp backend/env.example backend/.env
# 编辑 .env 文件，填入您的 API Keys

# 3. 启动服务
# Linux/macOS:
./scripts/dev.sh docker-up

# Windows:
scripts\dev.bat docker-up

# Python (任何平台):
python scripts/dev.py docker-up
```

**访问地址:**
- 前端: http://localhost
- 后端 API: http://localhost:8000
- API 文档: http://localhost:8000/docs

## 🛠️ 开发环境

### 前置要求

- **Node.js 18+**
- **Python 3.11+**
- **Docker & Docker Compose** (可选，用于 Milvus)

### 方式一：使用开发工具脚本 (推荐)

#### Linux/macOS

```bash
# 1. 安装所有依赖
./scripts/dev.sh install

# 2. 启动开发环境 (需要两个终端窗口)
# 终端 1 - 启动后端:
./scripts/dev.sh dev-backend

# 终端 2 - 启动前端:
./scripts/dev.sh dev-frontend
```

#### Windows

```cmd
# 1. 安装所有依赖
scripts\dev.bat install

# 2. 启动开发环境 (需要两个命令提示符窗口)
# 命令提示符 1 - 启动后端:
scripts\dev.bat dev-backend

# 命令提示符 2 - 启动前端:
scripts\dev.bat dev-frontend
```

#### Python 版本 (跨平台)

```bash
# 1. 安装所有依赖
python scripts/dev.py install

# 2. 启动开发环境 (需要两个终端窗口)
# 终端 1 - 启动后端:
python scripts/dev.py dev-backend

# 终端 2 - 启动前端:
python scripts/dev.py dev-frontend
```

### 方式二：手动启动

#### 后端启动

```bash
cd backend

# 创建虚拟环境
python -m venv .venv

# 激活虚拟环境
# Linux/macOS:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 启动服务
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 前端启动

```bash
cd frontend

# 安装依赖
npm ci

# 启动开发服务器
npm run dev
```

## 📋 可用命令

### 开发工具脚本命令

| 命令 | Linux/macOS | Windows | Python | 说明 |
|------|-------------|---------|--------|------|
| 查看帮助 | `./scripts/dev.sh help` | `scripts\dev.bat help` | `python scripts/dev.py help` | 显示所有可用命令 |
| 安装依赖 | `./scripts/dev.sh install` | `scripts\dev.bat install` | `python scripts/dev.py install` | 安装前后端依赖 |
| 构建项目 | `./scripts/dev.sh build` | `scripts\dev.bat build` | `python scripts/dev.py build` | 构建前后端项目 |
| 运行测试 | `./scripts/dev.sh test` | `scripts\dev.bat test` | `python scripts/dev.py test` | 运行所有测试 |
| 清理缓存 | `./scripts/dev.sh clean` | `scripts\dev.bat clean` | `python scripts/dev.py clean` | 清理构建产物 |
| Docker 构建 | `./scripts/dev.sh docker-build` | `scripts\dev.bat docker-build` | `python scripts/dev.py docker-build` | 构建 Docker 镜像 |
| Docker 启动 | `./scripts/dev.sh docker-up` | `scripts\dev.bat docker-up` | `python scripts/dev.py docker-up` | 启动 Docker 服务 |
| Docker 停止 | `./scripts/dev.sh docker-down` | `scripts\dev.bat docker-down` | `python scripts/dev.py docker-down` | 停止 Docker 服务 |
| 检查状态 | `./scripts/dev.sh status` | `scripts\dev.bat status` | `python scripts/dev.py status` | 检查服务状态 |

### 示例工作流

#### 日常开发

```bash
# 1. 安装/更新依赖
./scripts/dev.sh install

# 2. 启动开发环境
./scripts/dev.sh dev-backend &  # 后台启动后端
./scripts/dev.sh dev-frontend   # 前台启动前端

# 3. 开发完成后运行测试
./scripts/dev.sh test

# 4. 构建项目
./scripts/dev.sh build
```

#### Docker 开发

```bash
# 1. 构建镜像
./scripts/dev.sh docker-build

# 2. 启动服务
./scripts/dev.sh docker-up

# 3. 查看日志
./scripts/dev.sh docker-logs

# 4. 停止服务
./scripts/dev.sh docker-down
```

## 🔧 环境配置

### 后端配置 (.env)

```bash
# API Keys (必填)
OPENAI_API_KEY=your_openai_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 数据库配置
DATABASE_URL=sqlite:///./rage.db

# Milvus 配置
MILVUS_HOST=localhost
MILVUS_PORT=19530

# 应用配置
DEBUG=true
LOG_LEVEL=INFO
```

### 前端配置

前端配置通过应用内的设置页面进行管理，包括：
- 连接设置
- 主题配置
- 语言设置

## 🐛 常见问题

### 1. Python 虚拟环境问题

**问题**: 虚拟环境创建失败
**解决**: 确保 Python 3.11+ 已安装，并且有足够的磁盘空间

```bash
# 检查 Python 版本
python --version

# 手动创建虚拟环境
python -m venv backend/.venv
```

### 2. Node.js 依赖安装失败

**问题**: npm install 失败
**解决**: 清理缓存并重新安装

```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 3. Docker 服务启动失败

**问题**: docker-compose 启动失败
**解决**: 检查端口占用和 Docker 服务状态

```bash
# 检查端口占用
netstat -tlnp | grep :8000
netstat -tlnp | grep :19530

# 重启 Docker 服务
sudo systemctl restart docker  # Linux
# 或重启 Docker Desktop (Windows/macOS)
```

### 4. Milvus 连接失败

**问题**: 无法连接到 Milvus
**解决**: 确保 Milvus 服务正在运行

```bash
# 检查 Milvus 容器状态
docker ps | grep milvus

# 重启 Milvus 服务
./scripts/dev.sh docker-down
./scripts/dev.sh docker-up
```

## 📞 获取帮助

1. **查看日志**: 使用 `./scripts/dev.sh docker-logs` 查看服务日志
2. **检查状态**: 使用 `./scripts/dev.sh status` 检查服务状态
3. **查看文档**: 参考 `README.md` 和 `DEPLOYMENT.md`
4. **提交 Issue**: 在 GitHub 仓库提交问题报告

## 🎯 下一步

成功启动后，您可以：

1. **上传文档**: 在文档管理页面上传测试文档
2. **配置参数**: 在设置页面配置模型和连接参数
3. **测试功能**: 体验完整的 RAG 流程
4. **查看 API**: 访问 http://localhost:8000/docs 查看 API 文档

祝您使用愉快！ 🚀