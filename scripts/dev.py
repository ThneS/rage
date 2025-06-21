#!/usr/bin/env python3
"""
RAG 参数调测平台 - 开发工具脚本
替代 Makefile，支持跨平台使用
"""

import os
import sys
import subprocess
import argparse
import platform
import shutil
from pathlib import Path
import json
import time

# 颜色定义
class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    PURPLE = '\033[0;35m'
    CYAN = '\033[0;36m'
    WHITE = '\033[1;37m'
    NC = '\033[0m'  # No Color

def log_info(message):
    print(f"{Colors.GREEN}[INFO]{Colors.NC} {message}")

def log_warn(message):
    print(f"{Colors.YELLOW}[WARN]{Colors.NC} {message}")

def log_error(message):
    print(f"{Colors.RED}[ERROR]{Colors.NC} {message}")

def log_step(message):
    print(f"{Colors.BLUE}[STEP]{Colors.NC} {message}")

def run_command(cmd, cwd=None, shell=True, check=True):
    """运行命令并处理错误"""
    try:
        log_info(f"Running: {cmd}")
        if isinstance(cmd, str):
            result = subprocess.run(cmd, shell=shell, cwd=cwd, check=check,
                                  capture_output=False, text=True)
        else:
            result = subprocess.run(cmd, shell=False, cwd=cwd, check=check,
                                  capture_output=False, text=True)
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        log_error(f"Command failed: {cmd}")
        log_error(f"Exit code: {e.returncode}")
        return False
    except Exception as e:
        log_error(f"Error running command: {e}")
        return False

def get_project_root():
    """获取项目根目录"""
    script_dir = Path(__file__).parent
    return script_dir.parent

def check_dependencies():
    """检查依赖"""
    log_step("检查依赖...")

    # 检查 Python
    if sys.version_info < (3, 11):
        log_warn(f"Python 版本 {sys.version} 可能不兼容，推荐 3.11+")

    # 检查 Node.js
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        node_version = result.stdout.strip()
        log_info(f"Node.js: {node_version}")
    except FileNotFoundError:
        log_error("Node.js 未安装")
        return False

    # 检查 npm
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        npm_version = result.stdout.strip()
        log_info(f"npm: {npm_version}")
    except FileNotFoundError:
        log_error("npm 未安装")
        return False

    # 检查 Docker (可选)
    try:
        result = subprocess.run(['docker', '--version'], capture_output=True, text=True)
        docker_version = result.stdout.strip()
        log_info(f"Docker: {docker_version}")
    except FileNotFoundError:
        log_warn("Docker 未安装，无法使用容器相关功能")

    return True

def install_backend():
    """安装后端依赖"""
    log_step("安装后端依赖...")

    project_root = get_project_root()
    backend_dir = project_root / "backend"
    venv_dir = backend_dir / ".venv"

    # 创建虚拟环境
    if not venv_dir.exists():
        log_info("创建虚拟环境...")
        if not run_command([sys.executable, "-m", "venv", str(venv_dir)]):
            return False

    # 确定激活脚本路径
    if platform.system() == "Windows":
        activate_script = venv_dir / "Scripts" / "activate.bat"
        pip_path = venv_dir / "Scripts" / "pip"
    else:
        activate_script = venv_dir / "bin" / "activate"
        pip_path = venv_dir / "bin" / "pip"

    # 安装依赖
    log_info("安装 Python 依赖...")
    requirements_file = backend_dir / "requirements.txt"
    if not run_command([str(pip_path), "install", "-r", str(requirements_file)]):
        return False

    log_info("后端依赖安装完成")
    return True

def install_frontend():
    """安装前端依赖"""
    log_step("安装前端依赖...")

    project_root = get_project_root()
    frontend_dir = project_root / "frontend"

    if not run_command(["npm", "ci"], cwd=frontend_dir):
        return False

    log_info("前端依赖安装完成")
    return True

def install_all():
    """安装所有依赖"""
    log_step("安装所有依赖...")

    if not check_dependencies():
        return False

    if not install_backend():
        return False

    if not install_frontend():
        return False

    log_info("所有依赖安装完成")
    return True

def build_frontend():
    """构建前端"""
    log_step("构建前端...")

    project_root = get_project_root()
    frontend_dir = project_root / "frontend"

    # 类型检查
    log_info("运行类型检查...")
    if not run_command(["npm", "run", "type-check"], cwd=frontend_dir, check=False):
        log_warn("类型检查有警告")

    # ESLint
    log_info("运行 ESLint...")
    if not run_command(["npm", "run", "lint"], cwd=frontend_dir, check=False):
        log_warn("ESLint 检查有警告")

    # 构建
    log_info("构建生产版本...")
    if not run_command(["npm", "run", "build"], cwd=frontend_dir):
        return False

    log_info("前端构建完成")
    return True

def build_backend():
    """构建后端"""
    log_step("构建后端...")

    project_root = get_project_root()
    backend_dir = project_root / "backend"
    venv_dir = backend_dir / ".venv"

    # 确定 Python 路径
    if platform.system() == "Windows":
        python_path = venv_dir / "Scripts" / "python"
    else:
        python_path = venv_dir / "bin" / "python"

    # 编译检查
    log_info("运行编译检查...")
    main_file = backend_dir / "app" / "main.py"
    if not run_command([str(python_path), "-m", "py_compile", str(main_file)]):
        return False

    log_info("后端构建完成")
    return True

def build_all():
    """构建所有项目"""
    log_step("构建所有项目...")

    if not build_frontend():
        return False

    if not build_backend():
        return False

    log_info("所有项目构建完成")
    return True

def clean():
    """清理构建产物"""
    log_step("清理构建产物...")

    project_root = get_project_root()

    # 清理前端
    frontend_dist = project_root / "frontend" / "dist"
    if frontend_dist.exists():
        shutil.rmtree(frontend_dist)
        log_info("清理前端构建产物")

    frontend_cache = project_root / "frontend" / "node_modules" / ".cache"
    if frontend_cache.exists():
        shutil.rmtree(frontend_cache)
        log_info("清理前端缓存")

    # 清理后端 Python 缓存
    backend_dir = project_root / "backend"
    for root, dirs, files in os.walk(backend_dir):
        # 删除 __pycache__ 目录
        if "__pycache__" in dirs:
            pycache_dir = Path(root) / "__pycache__"
            shutil.rmtree(pycache_dir)

        # 删除 .pyc 文件
        for file in files:
            if file.endswith('.pyc'):
                os.remove(Path(root) / file)

    log_info("清理完成")
    return True

def dev_frontend():
    """启动前端开发服务器"""
    log_step("启动前端开发服务器...")

    project_root = get_project_root()
    frontend_dir = project_root / "frontend"

    return run_command(["npm", "run", "dev"], cwd=frontend_dir, check=False)

def dev_backend():
    """启动后端开发服务器"""
    log_step("启动后端开发服务器...")

    project_root = get_project_root()
    backend_dir = project_root / "backend"
    venv_dir = backend_dir / ".venv"

    # 确定 uvicorn 路径
    if platform.system() == "Windows":
        uvicorn_path = venv_dir / "Scripts" / "uvicorn"
    else:
        uvicorn_path = venv_dir / "bin" / "uvicorn"

    return run_command([
        str(uvicorn_path), "app.main:app",
        "--reload", "--host", "0.0.0.0", "--port", "8000"
    ], cwd=backend_dir, check=False)

def dev_all():
    """启动完整开发环境"""
    log_step("启动完整开发环境...")
    log_info("请在两个终端窗口中分别运行:")
    log_info("1. python scripts/dev.py dev-backend")
    log_info("2. python scripts/dev.py dev-frontend")
    log_info("或者使用 Docker: python scripts/dev.py docker-up")

def test_frontend():
    """运行前端测试"""
    log_step("运行前端测试...")

    project_root = get_project_root()
    frontend_dir = project_root / "frontend"

    # 类型检查
    log_info("运行类型检查...")
    if not run_command(["npm", "run", "type-check"], cwd=frontend_dir, check=False):
        log_warn("类型检查有警告")

    # ESLint
    log_info("运行 ESLint...")
    if not run_command(["npm", "run", "lint"], cwd=frontend_dir, check=False):
        log_warn("ESLint 检查有警告")

    # 单元测试 (如果配置了)
    package_json = frontend_dir / "package.json"
    if package_json.exists():
        with open(package_json, 'r', encoding='utf-8') as f:
            pkg = json.load(f)
            if "test" in pkg.get("scripts", {}):
                log_info("运行单元测试...")
                run_command(["npm", "test"], cwd=frontend_dir, check=False)

    return True

def test_backend():
    """运行后端测试"""
    log_step("运行后端测试...")

    project_root = get_project_root()
    backend_dir = project_root / "backend"
    venv_dir = backend_dir / ".venv"

    # 确定 pytest 路径
    if platform.system() == "Windows":
        pytest_path = venv_dir / "Scripts" / "pytest"
    else:
        pytest_path = venv_dir / "bin" / "pytest"

    # 检查测试目录
    tests_dir = backend_dir / "tests"
    if tests_dir.exists():
        log_info("运行后端测试...")
        return run_command([str(pytest_path), "tests/", "-v"], cwd=backend_dir, check=False)
    else:
        log_warn("未找到测试目录")
        return True

def test_all():
    """运行所有测试"""
    log_step("运行所有测试...")

    frontend_ok = test_frontend()
    backend_ok = test_backend()

    if frontend_ok and backend_ok:
        log_info("所有测试完成")
        return True
    else:
        log_warn("部分测试失败")
        return False

def docker_build():
    """构建 Docker 镜像"""
    log_step("构建 Docker 镜像...")

    project_root = get_project_root()

    # 构建后端镜像
    log_info("构建后端 Docker 镜像...")
    if not run_command([
        "docker", "build", "-t", "rage-backend:latest", "./backend"
    ], cwd=project_root):
        return False

    # 构建前端镜像
    log_info("构建前端 Docker 镜像...")
    if not run_command([
        "docker", "build", "-t", "rage-frontend:latest", "./frontend"
    ], cwd=project_root):
        return False

    log_info("Docker 镜像构建完成")
    return True

def docker_up():
    """启动 Docker 服务"""
    log_step("启动 Docker 服务...")

    project_root = get_project_root()

    # 优先使用开发环境配置
    dev_compose = project_root / "docker-compose.dev.yml"
    if dev_compose.exists():
        log_info("使用开发环境配置 (Milvus Standalone 模式)")
        return run_command(["docker", "compose", "-f", "docker-compose.dev.yml", "up", "-d"], cwd=project_root, check=False)
    else:
        log_info("使用默认配置")
        return run_command(["docker", "compose", "up", "-d"], cwd=project_root, check=False)

def docker_down():
    """停止 Docker 服务"""
    log_step("停止 Docker 服务...")

    project_root = get_project_root()

    # 检查并停止开发环境配置
    dev_compose = project_root / "docker-compose.dev.yml"
    if dev_compose.exists():
        log_info("停止开发环境服务")
        run_command(["docker", "compose", "-f", "docker-compose.dev.yml", "down"], cwd=project_root, check=False)

    # 也停止默认配置
    return run_command(["docker", "compose", "down"], cwd=project_root, check=False)

def docker_logs():
    """查看 Docker 日志"""
    log_step("查看 Docker 日志...")

    project_root = get_project_root()

    # 优先使用开发环境配置
    dev_compose = project_root / "docker-compose.dev.yml"
    if dev_compose.exists():
        return run_command(["docker", "compose", "-f", "docker-compose.dev.yml", "logs", "-f"], cwd=project_root, check=False)
    else:
        return run_command(["docker", "compose", "logs", "-f"], cwd=project_root, check=False)

def status():
    """检查服务状态"""
    log_step("检查服务状态...")

    # 检查后端服务
    try:
        import requests
        response = requests.get("http://localhost:8000/", timeout=5)
        if response.status_code == 200:
            log_info("✓ 后端服务运行正常")
        else:
            log_warn("✗ 后端服务响应异常")
    except Exception:
        log_warn("✗ 后端服务无法访问")

    # 检查前端服务
    try:
        import requests
        response = requests.get("http://localhost/", timeout=5)
        if response.status_code == 200:
            log_info("✓ 前端服务运行正常")
        else:
            log_warn("✗ 前端服务响应异常")
    except Exception:
        log_warn("✗ 前端服务无法访问")

def show_help():
    """显示帮助信息"""
    help_text = f"""
{Colors.CYAN}RAG 参数调测平台 - 开发工具{Colors.NC}

{Colors.WHITE}用法:{Colors.NC}
    python scripts/dev.py <command>

{Colors.WHITE}可用命令:{Colors.NC}

{Colors.YELLOW}开发相关:{Colors.NC}
    install          安装所有依赖
    install-backend  只安装后端依赖
    install-frontend 只安装前端依赖
    dev              显示开发环境启动说明
    dev-backend      启动后端开发服务器
    dev-frontend     启动前端开发服务器

{Colors.YELLOW}构建相关:{Colors.NC}
    build            构建前后端项目
    build-frontend   只构建前端
    build-backend    只构建后端
    clean            清理构建产物

{Colors.YELLOW}测试相关:{Colors.NC}
    test             运行所有测试
    test-frontend    运行前端测试
    test-backend     运行后端测试

{Colors.YELLOW}Docker 相关:{Colors.NC}
    docker-build     构建 Docker 镜像
    docker-up        启动 Docker 服务
    docker-down      停止 Docker 服务
    docker-logs      查看 Docker 日志

{Colors.YELLOW}其他:{Colors.NC}
    status           检查服务状态
    help             显示此帮助信息

{Colors.WHITE}示例:{Colors.NC}
    python scripts/dev.py install
    python scripts/dev.py build
    python scripts/dev.py docker-up
    """
    print(help_text)

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='RAG 参数调测平台开发工具')
    parser.add_argument('command', nargs='?', default='help', help='要执行的命令')

    args = parser.parse_args()
    command = args.command

    # 命令映射
    commands = {
        'help': show_help,
        'install': install_all,
        'install-backend': install_backend,
        'install-frontend': install_frontend,
        'dev': dev_all,
        'dev-backend': dev_backend,
        'dev-frontend': dev_frontend,
        'build': build_all,
        'build-frontend': build_frontend,
        'build-backend': build_backend,
        'clean': clean,
        'test': test_all,
        'test-frontend': test_frontend,
        'test-backend': test_backend,
        'docker-build': docker_build,
        'docker-up': docker_up,
        'docker-down': docker_down,
        'docker-logs': docker_logs,
        'status': status,
    }

    if command in commands:
        try:
            success = commands[command]()
            if success is False:
                sys.exit(1)
        except KeyboardInterrupt:
            log_info("操作被用户中断")
            sys.exit(1)
        except Exception as e:
            log_error(f"执行命令时出错: {e}")
            sys.exit(1)
    else:
        log_error(f"未知命令: {command}")
        show_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
