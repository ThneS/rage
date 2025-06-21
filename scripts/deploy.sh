#!/bin/bash

# RAG 参数调测平台部署脚本
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."

    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi

    log_info "依赖检查通过"
}

# 构建镜像
build_images() {
    log_info "构建 Docker 镜像..."

    # 构建后端镜像
    log_info "构建后端镜像..."
    docker build -t rage-backend:latest ./backend

    # 构建前端镜像
    log_info "构建前端镜像..."
    docker build -t rage-frontend:latest ./frontend

    log_info "镜像构建完成"
}

# 部署服务
deploy_services() {
    log_info "部署服务..."

    # 创建必要的目录
    mkdir -p logs/nginx
    mkdir -p backend/uploads
    mkdir -p backend/logs

    # 停止现有服务
    log_info "停止现有服务..."
    docker-compose down || true

    # 启动服务
    log_info "启动服务..."
    docker-compose up -d

    log_info "等待服务启动..."
    sleep 30

    # 检查服务状态
    check_services
}

# 检查服务状态
check_services() {
    log_info "检查服务状态..."

    # 检查后端服务
    if curl -f http://localhost:8000/ &> /dev/null; then
        log_info "后端服务运行正常"
    else
        log_error "后端服务启动失败"
        docker-compose logs backend
        exit 1
    fi

    # 检查前端服务
    if curl -f http://localhost/ &> /dev/null; then
        log_info "前端服务运行正常"
    else
        log_error "前端服务启动失败"
        docker-compose logs frontend
        exit 1
    fi

    log_info "所有服务运行正常"
}

# 主函数
main() {
    log_info "开始部署 RAG 参数调测平台..."

    check_dependencies
    build_images
    deploy_services

    log_info "部署完成！"
    log_info "访问地址: http://localhost"
    log_info "API 文档: http://localhost:8000/docs"
}

# 如果直接运行脚本
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi