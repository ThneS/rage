# 开发指南

RAG 参数调测平台的开发环境配置和开发流程指南。

## 🚀 快速开始

### 环境要求
- **Node.js**: 18+
- **Python**: 3.11+
- **Docker**: 20.10+ (可选，推荐)
- **Git**: 2.30+

### 一键启动开发环境

```bash
# 克隆项目
git clone <repository-url>
cd rage

# 安装依赖
./scripts/dev.sh install  # Linux/macOS
# 或 scripts\dev.bat install  # Windows
# 或 python scripts/dev.py install  # 跨平台

# 启动开发环境
./scripts/dev.sh docker-up
```

访问地址：
- 前端：http://localhost
- 后端：http://localhost:8000
- API 文档：http://localhost:8000/docs

## 📁 项目结构

```
rage/
├── backend/                    # 后端服务
│   ├── app/                   # 应用代码
│   │   ├── api/              # API 路由
│   │   ├── core/             # 核心配置
│   │   ├── models/           # 数据模型
│   │   ├── services/         # 业务逻辑
│   │   └── main.py           # 应用入口
│   ├── requirements.txt       # Python 依赖
│   └── Dockerfile            # 后端镜像
├── frontend/                  # 前端应用
│   ├── src/                  # 源代码
│   │   ├── components/       # React 组件
│   │   ├── pages/           # 页面组件
│   │   ├── services/        # API 服务
│   │   ├── store/           # 状态管理
│   │   └── types/           # TypeScript 类型
│   ├── package.json         # Node 依赖
│   └── Dockerfile           # 前端镜像
├── scripts/                  # 开发脚本
│   ├── dev.py              # Python 开发工具
│   ├── dev.sh              # Shell 开发工具
│   └── dev.bat             # Windows 批处理
├── .github/                 # GitHub Actions
│   └── workflows/
│       └── ci.yml          # CI/CD 配置
└── docker-compose.yml       # 开发环境配置
```

## 🛠️ 开发工具

### 开发脚本功能

| 命令 | 功能 | 示例 |
|------|------|------|
| `install` | 安装所有依赖 | `./scripts/dev.sh install` |
| `dev-backend` | 启动后端开发服务器 | `./scripts/dev.sh dev-backend` |
| `dev-frontend` | 启动前端开发服务器 | `./scripts/dev.sh dev-frontend` |
| `test` | 运行所有测试 | `./scripts/dev.sh test` |
| `build` | 构建项目 | `./scripts/dev.sh build` |
| `docker-up` | 启动 Docker 开发环境 | `./scripts/dev.sh docker-up` |
| `docker-down` | 停止 Docker 环境 | `./scripts/dev.sh docker-down` |
| `clean` | 清理构建产物 | `./scripts/dev.sh clean` |

### 跨平台支持

```bash
# Linux/macOS - Shell 版本（推荐）
./scripts/dev.sh <command>

# Windows - 批处理版本
scripts\dev.bat <command>

# 任何平台 - Python 版本
python scripts/dev.py <command>
```

## 🔧 本地开发

### 方式一：Docker 开发环境（推荐）

**优势**：
- 环境一致性好
- 依赖管理简单
- 包含完整服务栈

```bash
# 启动完整开发环境
./scripts/dev.sh docker-up

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 方式二：本地开发环境

**优势**：
- 调试更方便
- 热重载更快
- 资源占用少

#### 后端开发

```bash
cd backend

# 创建虚拟环境
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# 或 .venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp env.example .env
# 编辑 .env 文件

# 启动开发服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 前端开发

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 数据库服务

```bash
# 仅启动数据库服务
docker-compose up -d milvus postgres redis
```

## 📝 开发流程

### Git 工作流

```bash
# 1. 创建功能分支
git checkout -b feature/your-feature-name

# 2. 开发和提交
git add .
git commit -m "feat: add new feature"

# 3. 推送分支
git push origin feature/your-feature-name

# 4. 创建 Pull Request
# 在 GitHub 上创建 PR 到 develop 分支
```

### 代码规范

#### 前端规范

```bash
# 类型检查
npm run type-check

# 代码格式化
npm run lint
npm run lint:fix

# 构建测试
npm run build
```

#### 后端规范

```bash
# 类型检查
mypy app/ --ignore-missing-imports

# 代码格式化
black app/
isort app/

# 运行测试
pytest tests/
```

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式化
refactor: 代码重构
test: 测试相关
chore: 构建工具、依赖更新
```

## 🧪 测试

### 自动化测试

CI/CD 流水线会自动运行：
- 前端：类型检查、ESLint、构建测试
- 后端：类型检查、单元测试

### 本地测试

```bash
# 运行所有测试
./scripts/dev.sh test

# 分别运行测试
./scripts/dev.sh test-frontend
./scripts/dev.sh test-backend

# 手动运行测试
cd frontend && npm run type-check && npm run lint
cd backend && mypy app/ && pytest tests/
```

### 测试覆盖率

```bash
# 后端测试覆盖率
cd backend
pytest tests/ --cov=app --cov-report=html
# 查看 htmlcov/index.html
```

## 🐛 调试

### 后端调试

#### VS Code 调试配置

```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: FastAPI",
            "type": "python",
            "request": "launch",
            "program": "${workspaceFolder}/backend/.venv/bin/uvicorn",
            "args": [
                "app.main:app",
                "--reload",
                "--host", "0.0.0.0",
                "--port", "8000"
            ],
            "cwd": "${workspaceFolder}/backend",
            "env": {
                "PYTHONPATH": "${workspaceFolder}/backend"
            }
        }
    ]
}
```

#### 日志调试

```python
# backend/app/core/logging.py
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)
logger.debug("Debug message")
```

### 前端调试

#### 浏览器调试

- 使用 Chrome DevTools
- React Developer Tools 扩展
- Redux DevTools 扩展

#### VS Code 调试

```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch Chrome",
            "type": "chrome",
            "request": "launch",
            "url": "http://localhost:3000",
            "webRoot": "${workspaceFolder}/frontend/src"
        }
    ]
}
```

## 📊 性能优化

### 开发环境优化

#### Milvus 优化配置

```yaml
# docker-compose.yml 中的 Milvus 配置
milvus:
  image: milvusdb/milvus:v2.3.4
  environment:
    ETCD_USE_EMBED: true
    ETCD_DATA_DIR: /var/lib/milvus/etcd
    COMMON_STORAGETYPE: local
  # 开发环境资源限制
  deploy:
    resources:
      limits:
        memory: 512M
```

#### 前端开发优化

```javascript
// vite.config.ts
export default defineConfig({
  server: {
    hmr: {
      overlay: false  // 关闭错误覆盖层
    }
  },
  build: {
    sourcemap: true  // 开发环境启用 sourcemap
  }
})
```

### 构建优化

```bash
# 并行构建
./scripts/dev.sh build

# 清理缓存
./scripts/dev.sh clean
```

## 🔧 常见问题

### 1. 端口冲突

```bash
# 检查端口占用
lsof -i :8000
lsof -i :3000

# 修改端口配置
# 后端：修改 uvicorn 启动参数
# 前端：修改 vite.config.ts 中的 server.port
```

### 2. 依赖安装失败

```bash
# 清理缓存
npm cache clean --force  # 前端
pip cache purge          # 后端

# 重新安装
./scripts/dev.sh install
```

### 3. Docker 服务启动失败

```bash
# 查看日志
docker-compose logs milvus

# 重启服务
docker-compose restart milvus

# 重建服务
docker-compose up -d --force-recreate milvus
```

### 4. 热重载不工作

```bash
# 检查文件监听限制 (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# 重启开发服务器
./scripts/dev.sh dev-frontend
```

## 🚀 CI/CD 集成

### 本地验证 CI/CD

```bash
# 验证 YAML 语法
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))"

# 本地运行测试（模拟 CI）
./scripts/dev.sh test

# 本地构建镜像（模拟 CI）
./scripts/dev.sh docker-build
```

### 分支策略

- `main`: 生产环境，自动部署
- `develop`: 开发环境，自动部署
- `feature/*`: 功能分支，运行测试

### Pull Request 流程

1. 创建功能分支
2. 开发和测试
3. 推送到 GitHub
4. 创建 PR 到 develop
5. CI 自动运行测试
6. 代码审查
7. 合并到 develop

## 📚 开发资源

### 技术文档

- [FastAPI 官方文档](https://fastapi.tiangolo.com/)
- [React 官方文档](https://react.dev/)
- [Ant Design 组件库](https://ant.design/)
- [Milvus 向量数据库](https://milvus.io/docs)

### 开发工具推荐

- **IDE**: VS Code, PyCharm
- **API 测试**: Postman, Insomnia
- **数据库**: DBeaver, pgAdmin
- **容器**: Docker Desktop, Portainer

### 代码质量工具

- **Python**: black, isort, mypy, pytest
- **JavaScript**: ESLint, Prettier, TypeScript
- **Git**: pre-commit, commitizen

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 遵循代码规范
4. 添加测试用例
5. 更新文档
6. 提交 Pull Request

## 📞 获取帮助

- 查看 [故障排除文档](DEPLOYMENT.md#故障排除)
- 创建 [GitHub Issue](https://github.com/your-org/rage/issues)
- 查看 [API 文档](http://localhost:8000/docs)

---

开发愉快！🎉