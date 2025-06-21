#!/bin/bash

# RAG 参数调测平台构建脚本
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

# 构建前端
build_frontend() {
    log_info "构建前端..."

    cd frontend

    # 安装依赖
    log_info "安装前端依赖..."
    npm ci

    # 运行类型检查
    log_info "运行类型检查..."
    npm run type-check || log_warn "类型检查有警告"

    # 运行 ESLint
    log_info "运行 ESLint..."
    npm run lint || log_warn "ESLint 检查有警告"

    # 构建生产版本
    log_info "构建生产版本..."
    npm run build

    cd ..
    log_info "前端构建完成"
}

# 构建后端
build_backend() {
    log_info "构建后端..."

    cd backend

    # 创建虚拟环境（如果不存在）
    if [ ! -d ".venv" ]; then
        log_info "创建虚拟环境..."
        python -m venv .venv
    fi

    # 激活虚拟环境
    source .venv/bin/activate

    # 安装依赖
    log_info "安装后端依赖..."
    pip install -r requirements.txt

    # 运行测试（如果有）
    if [ -f "tests/__init__.py" ]; then
        log_info "运行测试..."
        python -m pytest tests/ || log_warn "测试有失败"
    fi

    # 类型检查
    if command -v mypy &> /dev/null; then
        log_info "运行类型检查..."
        mypy app/ || log_warn "类型检查有警告"
    fi

    cd ..
    log_info "后端构建完成"
}

# 构建 Docker 镜像
build_docker() {
    log_info "构建 Docker 镜像..."

    # 构建后端镜像
    log_info "构建后端 Docker 镜像..."
    docker build -t rage-backend:latest ./backend

    # 构建前端镜像
    log_info "构建前端 Docker 镜像..."
    docker build -t rage-frontend:latest ./frontend

    log_info "Docker 镜像构建完成"
}

# 清理构建产物
clean() {
    log_info "清理构建产物..."

    # 清理前端
    if [ -d "frontend/dist" ]; then
        rm -rf frontend/dist
        log_info "清理前端构建产物"
    fi

    # 清理 Docker 镜像（可选）
    if [ "$1" = "--docker" ]; then
        docker rmi rage-backend:latest rage-frontend:latest 2>/dev/null || true
        log_info "清理 Docker 镜像"
    fi

    log_info "清理完成"
}

# 显示帮助信息
show_help() {
    echo "RAG 参数调测平台构建脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  frontend    只构建前端"
    echo "  backend     只构建后端"
    echo "  docker      只构建 Docker 镜像"
    echo "  clean       清理构建产物"
    echo "  clean --docker  清理构建产物和 Docker 镜像"
    echo "  help        显示此帮助信息"
    echo ""
    echo "默认: 构建前端、后端和 Docker 镜像"
}

# 主函数
main() {
    case "${1:-all}" in
        "frontend")
            build_frontend
            ;;
        "backend")
            build_backend
            ;;
        "docker")
            build_docker
            ;;
        "clean")
            clean "$2"
            ;;
        "help")
            show_help
            ;;
        "all"|"")
            log_info "开始完整构建..."
            build_frontend
            build_backend
            build_docker
            log_info "构建完成！"
            ;;
        *)
            log_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
}

# 如果直接运行脚本
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi