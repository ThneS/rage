# RAGE - RAG 评估与调优系统

RAGE (RAG Evaluation and Tuning System) 是一个用于评估和优化 RAG (Retrieval-Augmented Generation) 系统的工具。它提供了完整的文档处理流程，包括文档加载、分块、向量化、检索和评估等功能。

## 功能特点

- 📄 文档管理：支持多种格式文档的上传和管理
- 🔧 灵活的加载工具：支持 LangChain、LlamaIndex 和 Unstructured 等多种文档加载工具
- 📊 分块策略：支持多种文本分块策略，包括按字符、句子、段落等
- 🔍 向量检索：支持多种向量数据库和检索策略
- 📈 评估系统：提供全面的 RAG 系统评估指标
- 🎯 调优建议：基于评估结果提供系统优化建议

## 系统要求

- Python 3.8+
- Node.js 16+
- SQLite 3
- 其他依赖见 requirements.txt 和 package.json

## 快速开始

### 后端设置

1. 创建并激活虚拟环境：

```bash
# 在 backend 目录下
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# 或
.venv\Scripts\activate  # Windows
```

2. 安装依赖：

```bash
pip install -r requirements.txt
```

3. 初始化数据库：

```bash
# 在 backend 目录下
alembic upgrade head
```

4. 启动后端服务：

```bash
uvicorn app.main:app --reload --port 8000
```

### 前端设置

1. 安装依赖：

```bash
# 在 frontend 目录下
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 构建生产版本：

```bash
npm run build
```

## 项目结构

```
rage/
├── backend/                # 后端服务
│   ├── app/
│   │   ├── api/           # API 接口
│   │   ├── core/          # 核心配置
│   │   ├── models/        # 数据模型
│   │   ├── schemas/       # Pydantic 模型
│   │   └── services/      # 业务逻辑
│   ├── alembic/           # 数据库迁移
│   └── tests/             # 测试文件
├── frontend/              # 前端应用
│   ├── src/
│   │   ├── components/    # React 组件
│   │   ├── pages/        # 页面组件
│   │   ├── services/     # API 服务
│   │   └── utils/        # 工具函数
│   └── public/           # 静态资源
└── uploads/              # 文档上传目录
```

## 使用指南

### 文档加载

1. 访问文档加载页面
2. 选择或上传文档
3. 配置加载工具（LangChain/LlamaIndex/Unstructured）
4. 点击"开始加载"处理文档

### 文档分块

1. 在分块页面选择已加载的文档
2. 配置分块策略（字符/句子/段落）
3. 设置分块参数
4. 执行分块操作

### 向量化与检索

1. 选择分块后的文档
2. 配置向量化参数
3. 选择向量数据库
4. 执行向量化
5. 配置检索策略
6. 测试检索效果

### 系统评估

1. 选择要评估的检索系统
2. 配置评估参数
3. 运行评估
4. 查看评估报告
5. 根据建议优化系统

## 开发指南

### 后端开发

- 使用 FastAPI 框架
- 遵循 RESTful API 设计规范
- 使用 Pydantic 进行数据验证
- 使用 SQLAlchemy 进行数据库操作
- 使用 Alembic 管理数据库迁移

### 前端开发

- 使用 React + TypeScript
- 使用 Ant Design 组件库
- 使用 React Query 管理服务端状态
- 使用 React Router 管理路由
- 使用 Axios 处理 HTTP 请求

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。