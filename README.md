# RAG 参数调测平台

> 🚧 **开发中** - 一个用于 RAG（检索增强生成）系统参数调优的全栈平台

## 📋 项目状态

### ✅ 已完成功能
- 📄 **文档上传管理**：支持多种格式文档上传
- 🔧 **参数配置界面**：可视化的参数配置表单
- 🎨 **前端框架**：基于 React + TypeScript + Ant Design
- ⚙️ **后端框架**：基于 FastAPI + Python
- 🐳 **容器化部署**：Docker + Docker Compose 支持
- 🔄 **CI/CD 流水线**：自动化构建和部署

### 🚧 开发中功能 (TODO)

#### 1. 🔍 检索和生成后端接口
- [ ] 向量搜索接口实现
- [ ] 文档检索逻辑
- [ ] 生成结果接口
- [ ] 搜索结果排序和过滤

#### 2. 📊 参数配置功能实现
- [ ] 分块参数的实际处理逻辑
- [ ] 向量化参数的后端实现
- [ ] 搜索参数的功能对接
- [ ] 生成参数的模型调用

#### 3. 🤖 大模型集成
- [ ] 模型文件加载到镜像
- [ ] 本地模型推理服务
- [ ] 模型切换和配置
- [ ] 模型性能优化

#### 4. ⚙️ 设置页面完善
- [ ] 系统配置管理
- [ ] 用户偏好设置
- [ ] 模型配置界面
- [ ] 数据库连接配置

## 🛠️ 技术栈

### 后端
- **框架**：FastAPI
- **语言**：Python 3.11+
- **文档处理**：LangChain, LlamaIndex
- **向量数据库**：Milvus（计划）

### 前端
- **框架**：React 18 + TypeScript
- **构建工具**：Vite
- **UI 库**：Ant Design
- **状态管理**：Redux Toolkit

### DevOps
- **CI/CD**：GitHub Actions
- **容器化**：Docker + Docker Compose
- **镜像仓库**：GitHub Container Registry

## 🚀 快速开始

### 开发环境

#### 前置要求
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose

#### 使用开发脚本

```bash
# 安装依赖
python scripts/dev.py install

# 启动开发环境（需要两个终端）
python scripts/dev.py dev-backend   # 终端 1: 后端服务
python scripts/dev.py dev-frontend  # 终端 2: 前端服务
```

### Docker 部署

```bash
# 开发环境
docker-compose up -d

# 生产环境
docker-compose -f docker-compose.prod.yml up -d

# 访问地址
# 前端: http://localhost
# 后端: http://localhost:8000
# API 文档: http://localhost:8000/docs
```

## 📁 项目结构

```
rage/
├── frontend/           # React 前端
│   ├── src/
│   │   ├── components/ # 组件库
│   │   ├── pages/      # 页面组件
│   │   ├── services/   # API 服务
│   │   └── types/      # TypeScript 类型
│   └── package.json
├── backend/            # FastAPI 后端
│   ├── app/
│   │   ├── api/        # API 路由
│   │   ├── models/     # 数据模型
│   │   ├── services/   # 业务逻辑
│   │   └── main.py     # 应用入口
│   └── requirements.txt
├── scripts/            # 开发工具脚本
├── .github/workflows/  # CI/CD 配置
└── docker-compose.yml  # Docker 配置
```

## 🔧 开发工具

我们提供了跨平台的开发工具脚本：

```bash
# 查看所有可用命令
python scripts/dev.py help

# 常用命令
python scripts/dev.py install        # 安装依赖
python scripts/dev.py dev           # 显示开发说明
python scripts/dev.py build         # 构建项目
python scripts/dev.py test          # 运行测试
python scripts/dev.py docker-up     # Docker 部署
python scripts/dev.py status        # 检查状态
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关文档

- [Docker 使用指南](DOCKER_USAGE.md)
- [开发环境配置](DEVELOPMENT.md)
- [部署指南](DEPLOYMENT.md)
- [快速开始](QUICKSTART.md)