# 基础镜像
FROM python:3.11-slim as base

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 创建必要的目录
RUN mkdir -p uploads logs

# 开发环境阶段
FROM base as development

# 开发环境特定配置
ENV DEBUG=true \
    LOG_LEVEL=DEBUG

# 安装开发依赖（如果有的话）
# RUN pip install --no-cache-dir -r requirements-dev.txt

# 暴露端口
EXPOSE 8000

# 开发模式启动命令（支持热重载）
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# 生产环境阶段
FROM base as production

# 复制应用代码
COPY . .

# 生产环境配置
ENV DEBUG=false \
    LOG_LEVEL=INFO

# 暴露端口
EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# 生产模式启动命令
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]