#!/bin/bash

# RAG 参数调测平台 - 开发工具脚本 (Shell 版本)
# 适用于没有 Python 或 make 的环境

set -e

# 检测颜色支持
if [[ -t 1 ]] && command -v tput >/dev/null 2>&1 && tput colors >/dev/null 2>&1 && [[ $(tput colors) -ge 8 ]]; then
    # 颜色定义
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    PURPLE='\033[0;35m'
    CYAN='\033[0;36m'
    WHITE='\033[1;37m'
    NC='\033[0m' # No Color
else
    # 无颜色支持
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    PURPLE=''
    CYAN=''
    WHITE=''
    NC=''
fi

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

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 获取项目根目录
get_project_root() {
    cd "$(dirname "${BASH_SOURCE[0]}")/.."
    pwd
}

# 检查依赖
check_dependencies() {
    log_step "检查依赖..."

    # 检查 Python
    if command -v python3 &> /dev/null; then
        PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
        log_info "Python: $PYTHON_VERSION"
    else
        log_error "Python3 未安装"
        return 1
    fi

    # 检查 Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        log_info "Node.js: $NODE_VERSION"
    else
        log_error "Node.js 未安装"
        return 1
    fi

    # 检查 npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        log_info "npm: $NPM_VERSION"
    else
        log_error "npm 未安装"
        return 1
    fi

    # 检查 Docker (可选)
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        log_info "Docker: $DOCKER_VERSION"
    else
        log_warn "Docker 未安装，无法使用容器相关功能"
    fi

    return 0
}

# 安装后端依赖
install_backend() {
    log_step "安装后端依赖..."

    PROJECT_ROOT=$(get_project_root)
    cd "$PROJECT_ROOT/backend"

    # 创建虚拟环境
    if [ ! -d ".venv" ]; then
        log_info "创建虚拟环境..."
        python3 -m venv .venv
    fi

    # 激活虚拟环境并安装依赖
    log_info "安装 Python 依赖..."
    source .venv/bin/activate
    pip install -r requirements.txt

    log_info "后端依赖安装完成"
}

# 安装前端依赖
install_frontend() {
    log_step "安装前端依赖..."

    PROJECT_ROOT=$(get_project_root)
    cd "$PROJECT_ROOT/frontend"

    npm ci

    log_info "前端依赖安装完成"
}

# 安装所有依赖
install_all() {
    log_step "安装所有依赖..."

    check_dependencies || return 1
    install_backend || return 1
    install_frontend || return 1

    log_info "所有依赖安装完成"
}

# 构建前端
build_frontend() {
    log_step "构建前端..."

    PROJECT_ROOT=$(get_project_root)
    cd "$PROJECT_ROOT/frontend"

    # 类型检查
    log_info "运行类型检查..."
    npm run type-check || log_warn "类型检查有警告"

    # ESLint
    log_info "运行 ESLint..."
    npm run lint || log_warn "ESLint 检查有警告"

    # 构建
    log_info "构建生产版本..."
    npm run build

    log_info "前端构建完成"
}

# 构建后端
build_backend() {
    log_step "构建后端..."

    PROJECT_ROOT=$(get_project_root)
    cd "$PROJECT_ROOT/backend"

    # 激活虚拟环境
    source .venv/bin/activate

    # 编译检查
    log_info "运行编译检查..."
    python -m py_compile app/main.py

    log_info "后端构建完成"
}

# 构建所有项目
build_all() {
    log_step "构建所有项目..."

    build_frontend || return 1
    build_backend || return 1

    log_info "所有项目构建完成"
}

# 清理构建产物
clean() {
    log_step "清理构建产物..."

    PROJECT_ROOT=$(get_project_root)

    # 清理前端
    if [ -d "$PROJECT_ROOT/frontend/dist" ]; then
        rm -rf "$PROJECT_ROOT/frontend/dist"
        log_info "清理前端构建产物"
    fi

    if [ -d "$PROJECT_ROOT/frontend/node_modules/.cache" ]; then
        rm -rf "$PROJECT_ROOT/frontend/node_modules/.cache"
        log_info "清理前端缓存"
    fi

    # 清理后端 Python 缓存
    find "$PROJECT_ROOT/backend" -name "*.pyc" -delete
    find "$PROJECT_ROOT/backend" -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

    log_info "清理完成"
}

# 启动前端开发服务器
dev_frontend() {
    log_step "启动前端开发服务器..."

    PROJECT_ROOT=$(get_project_root)
    cd "$PROJECT_ROOT/frontend"

    npm run dev
}

# 启动后端开发服务器
dev_backend() {
    log_step "启动后端开发服务器..."

    PROJECT_ROOT=$(get_project_root)
    cd "$PROJECT_ROOT/backend"

    # 激活虚拟环境
    source .venv/bin/activate

    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}

# 显示开发环境启动说明
dev_all() {
    log_step "启动完整开发环境..."
    log_info "请在两个终端窗口中分别运行:"
    log_info "1. ./scripts/dev.sh dev-backend"
    log_info "2. ./scripts/dev.sh dev-frontend"
    log_info "或者使用 Docker: ./scripts/dev.sh docker-up"
}

# 运行前端测试
test_frontend() {
    log_step "运行前端测试..."

    PROJECT_ROOT=$(get_project_root)
    cd "$PROJECT_ROOT/frontend"

    # 类型检查
    log_info "运行类型检查..."
    npm run type-check || log_warn "类型检查有警告"

    # ESLint
    log_info "运行 ESLint..."
    npm run lint || log_warn "ESLint 检查有警告"

    # 单元测试 (如果配置了)
    if grep -q '"test"' package.json; then
        log_info "运行单元测试..."
        npm test || log_warn "单元测试有失败"
    fi

    log_info "前端测试完成"
}

# 运行后端测试
test_backend() {
    log_step "运行后端测试..."

    PROJECT_ROOT=$(get_project_root)
    cd "$PROJECT_ROOT/backend"

    # 激活虚拟环境
    source .venv/bin/activate

    # 检查测试目录
    if [ -d "tests" ]; then
        log_info "运行后端测试..."
        pytest tests/ -v || log_warn "后端测试有失败"
    else
        log_warn "未找到测试目录"
    fi

    log_info "后端测试完成"
}

# 运行所有测试
test_all() {
    log_step "运行所有测试..."

    test_frontend
    test_backend

    log_info "所有测试完成"
}

# 构建 Docker 镜像
docker_build() {
    log_step "构建 Docker 镜像..."

    PROJECT_ROOT=$(get_project_root)
    cd "$PROJECT_ROOT"

    # 构建后端镜像
    log_info "构建后端 Docker 镜像..."
    docker build -t rage-backend:latest ./backend

    # 构建前端镜像
    log_info "构建前端 Docker 镜像..."
    docker build -t rage-frontend:latest ./frontend

    log_info "Docker 镜像构建完成"
}

# 启动 Docker 服务
docker_up() {
    log_step "启动 Docker 服务..."

    PROJECT_ROOT=$(get_project_root)
    cd "$PROJECT_ROOT"

    # 优先使用开发环境配置
    if [ -f "docker-compose.dev.yml" ]; then
        log_info "使用开发环境配置 (Milvus Standalone 模式)"
        docker compose -f docker-compose.dev.yml up -d
    else
        log_info "使用默认配置"
        docker compose up -d
    fi
}

# 停止 Docker 服务
docker_down() {
    log_step "停止 Docker 服务..."

    PROJECT_ROOT=$(get_project_root)
    cd "$PROJECT_ROOT"

    # 检查并停止开发环境配置
    if [ -f "docker-compose.dev.yml" ]; then
        log_info "停止开发环境服务"
        docker compose -f docker-compose.dev.yml down
    fi

    # 也停止默认配置
    docker compose down
}

# 查看 Docker 日志
docker_logs() {
    log_step "查看 Docker 日志..."

    PROJECT_ROOT=$(get_project_root)
    cd "$PROJECT_ROOT"

    # 优先使用开发环境配置
    if [ -f "docker-compose.dev.yml" ]; then
        docker compose -f docker-compose.dev.yml logs -f
    else
        docker compose logs -f
    fi
}

# 检查服务状态
status() {
    log_step "检查服务状态..."

    # 检查后端服务
    if curl -f http://localhost:8000/ &> /dev/null; then
        log_info "✓ 后端服务运行正常"
    else
        log_warn "✗ 后端服务无法访问"
    fi

    # 检查前端服务
    if curl -f http://localhost/ &> /dev/null; then
        log_info "✓ 前端服务运行正常"
    else
        log_warn "✗ 前端服务无法访问"
    fi
}

# 显示帮助信息
show_help() {
    printf "%bRAG 参数调测平台 - 开发工具%b\n\n" "${CYAN}" "${NC}"

    printf "%b用法:%b\n" "${WHITE}" "${NC}"
    printf "    ./scripts/dev.sh <command>\n\n"

    printf "%b可用命令:%b\n\n" "${WHITE}" "${NC}"

    printf "%b开发相关:%b\n" "${YELLOW}" "${NC}"
    printf "    install          安装所有依赖\n"
    printf "    install-backend  只安装后端依赖\n"
    printf "    install-frontend 只安装前端依赖\n"
    printf "    dev              显示开发环境启动说明\n"
    printf "    dev-backend      启动后端开发服务器\n"
    printf "    dev-frontend     启动前端开发服务器\n\n"

    printf "%b构建相关:%b\n" "${YELLOW}" "${NC}"
    printf "    build            构建前后端项目\n"
    printf "    build-frontend   只构建前端\n"
    printf "    build-backend    只构建后端\n"
    printf "    clean            清理构建产物\n\n"

    printf "%b测试相关:%b\n" "${YELLOW}" "${NC}"
    printf "    test             运行所有测试\n"
    printf "    test-frontend    运行前端测试\n"
    printf "    test-backend     运行后端测试\n\n"

    printf "%bDocker 相关:%b\n" "${YELLOW}" "${NC}"
    printf "    docker-build     构建 Docker 镜像\n"
    printf "    docker-up        启动 Docker 服务\n"
    printf "    docker-down      停止 Docker 服务\n"
    printf "    docker-logs      查看 Docker 日志\n\n"

    printf "%b其他:%b\n" "${YELLOW}" "${NC}"
    printf "    status           检查服务状态\n"
    printf "    help             显示此帮助信息\n\n"

    printf "%b示例:%b\n" "${WHITE}" "${NC}"
    printf "    ./scripts/dev.sh install\n"
    printf "    ./scripts/dev.sh build\n"
    printf "    ./scripts/dev.sh docker-up\n\n"
}

# 主函数
main() {
    local command=${1:-help}

    case "$command" in
        "help")
            show_help
            ;;
        "install")
            install_all
            ;;
        "install-backend")
            install_backend
            ;;
        "install-frontend")
            install_frontend
            ;;
        "dev")
            dev_all
            ;;
        "dev-backend")
            dev_backend
            ;;
        "dev-frontend")
            dev_frontend
            ;;
        "build")
            build_all
            ;;
        "build-frontend")
            build_frontend
            ;;
        "build-backend")
            build_backend
            ;;
        "clean")
            clean
            ;;
        "test")
            test_all
            ;;
        "test-frontend")
            test_frontend
            ;;
        "test-backend")
            test_backend
            ;;
        "docker-build")
            docker_build
            ;;
        "docker-up")
            docker_up
            ;;
        "docker-down")
            docker_down
            ;;
        "docker-logs")
            docker_logs
            ;;
        "status")
            status
            ;;
        *)
            log_error "未知命令: $command"
            show_help
            exit 1
            ;;
    esac
}

# 如果直接运行脚本
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi