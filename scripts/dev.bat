@echo off
REM RAG 参数调测平台 - 开发工具脚本 (Windows 批处理版本)
REM 适用于 Windows 环境

setlocal enabledelayedexpansion

REM 设置颜色代码
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "CYAN=[96m"
set "WHITE=[97m"
set "NC=[0m"

REM 日志函数
:log_info
echo %GREEN%[INFO]%NC% %~1
goto :eof

:log_warn
echo %YELLOW%[WARN]%NC% %~1
goto :eof

:log_error
echo %RED%[ERROR]%NC% %~1
goto :eof

:log_step
echo %BLUE%[STEP]%NC% %~1
goto :eof

REM 获取项目根目录
:get_project_root
cd /d "%~dp0\.."
set "PROJECT_ROOT=%CD%"
goto :eof

REM 检查依赖
:check_dependencies
call :log_step "检查依赖..."

REM 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    call :log_error "Python 未安装"
    exit /b 1
) else (
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do (
        call :log_info "Python: %%i"
    )
)

REM 检查 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    call :log_error "Node.js 未安装"
    exit /b 1
) else (
    for /f %%i in ('node --version') do (
        call :log_info "Node.js: %%i"
    )
)

REM 检查 npm
npm --version >nul 2>&1
if errorlevel 1 (
    call :log_error "npm 未安装"
    exit /b 1
) else (
    for /f %%i in ('npm --version') do (
        call :log_info "npm: %%i"
    )
)

REM 检查 Docker (可选)
docker --version >nul 2>&1
if errorlevel 1 (
    call :log_warn "Docker 未安装，无法使用容器相关功能"
) else (
    for /f "tokens=1,2,3" %%i in ('docker --version') do (
        call :log_info "Docker: %%i %%j %%k"
    )
)

goto :eof

REM 安装后端依赖
:install_backend
call :log_step "安装后端依赖..."

call :get_project_root
cd /d "%PROJECT_ROOT%\backend"

REM 创建虚拟环境
if not exist ".venv" (
    call :log_info "创建虚拟环境..."
    python -m venv .venv
    if errorlevel 1 exit /b 1
)

REM 激活虚拟环境并安装依赖
call :log_info "安装 Python 依赖..."
call .venv\Scripts\activate.bat
pip install -r requirements.txt
if errorlevel 1 exit /b 1

call :log_info "后端依赖安装完成"
goto :eof

REM 安装前端依赖
:install_frontend
call :log_step "安装前端依赖..."

call :get_project_root
cd /d "%PROJECT_ROOT%\frontend"

npm ci
if errorlevel 1 exit /b 1

call :log_info "前端依赖安装完成"
goto :eof

REM 安装所有依赖
:install_all
call :log_step "安装所有依赖..."

call :check_dependencies
if errorlevel 1 exit /b 1

call :install_backend
if errorlevel 1 exit /b 1

call :install_frontend
if errorlevel 1 exit /b 1

call :log_info "所有依赖安装完成"
goto :eof

REM 构建前端
:build_frontend
call :log_step "构建前端..."

call :get_project_root
cd /d "%PROJECT_ROOT%\frontend"

REM 类型检查
call :log_info "运行类型检查..."
npm run type-check
if errorlevel 1 call :log_warn "类型检查有警告"

REM ESLint
call :log_info "运行 ESLint..."
npm run lint
if errorlevel 1 call :log_warn "ESLint 检查有警告"

REM 构建
call :log_info "构建生产版本..."
npm run build
if errorlevel 1 exit /b 1

call :log_info "前端构建完成"
goto :eof

REM 构建后端
:build_backend
call :log_step "构建后端..."

call :get_project_root
cd /d "%PROJECT_ROOT%\backend"

REM 激活虚拟环境
call .venv\Scripts\activate.bat

REM 编译检查
call :log_info "运行编译检查..."
python -m py_compile app\main.py
if errorlevel 1 exit /b 1

call :log_info "后端构建完成"
goto :eof

REM 构建所有项目
:build_all
call :log_step "构建所有项目..."

call :build_frontend
if errorlevel 1 exit /b 1

call :build_backend
if errorlevel 1 exit /b 1

call :log_info "所有项目构建完成"
goto :eof

REM 清理构建产物
:clean
call :log_step "清理构建产物..."

call :get_project_root

REM 清理前端
if exist "%PROJECT_ROOT%\frontend\dist" (
    rmdir /s /q "%PROJECT_ROOT%\frontend\dist"
    call :log_info "清理前端构建产物"
)

if exist "%PROJECT_ROOT%\frontend\node_modules\.cache" (
    rmdir /s /q "%PROJECT_ROOT%\frontend\node_modules\.cache"
    call :log_info "清理前端缓存"
)

REM 清理后端 Python 缓存
for /r "%PROJECT_ROOT%\backend" %%f in (*.pyc) do del "%%f" 2>nul
for /r "%PROJECT_ROOT%\backend" %%d in (__pycache__) do if exist "%%d" rmdir /s /q "%%d" 2>nul

call :log_info "清理完成"
goto :eof

REM 启动前端开发服务器
:dev_frontend
call :log_step "启动前端开发服务器..."

call :get_project_root
cd /d "%PROJECT_ROOT%\frontend"

npm run dev
goto :eof

REM 启动后端开发服务器
:dev_backend
call :log_step "启动后端开发服务器..."

call :get_project_root
cd /d "%PROJECT_ROOT%\backend"

REM 激活虚拟环境
call .venv\Scripts\activate.bat

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
goto :eof

REM 显示开发环境启动说明
:dev_all
call :log_step "启动完整开发环境..."
call :log_info "请在两个命令提示符窗口中分别运行:"
call :log_info "1. scripts\dev.bat dev-backend"
call :log_info "2. scripts\dev.bat dev-frontend"
call :log_info "或者使用 Docker: scripts\dev.bat docker-up"
goto :eof

REM 运行前端测试
:test_frontend
call :log_step "运行前端测试..."

call :get_project_root
cd /d "%PROJECT_ROOT%\frontend"

REM 类型检查
call :log_info "运行类型检查..."
npm run type-check
if errorlevel 1 call :log_warn "类型检查有警告"

REM ESLint
call :log_info "运行 ESLint..."
npm run lint
if errorlevel 1 call :log_warn "ESLint 检查有警告"

REM 单元测试 (如果配置了)
findstr /c:"\"test\"" package.json >nul 2>&1
if not errorlevel 1 (
    call :log_info "运行单元测试..."
    npm test
    if errorlevel 1 call :log_warn "单元测试有失败"
)

call :log_info "前端测试完成"
goto :eof

REM 运行后端测试
:test_backend
call :log_step "运行后端测试..."

call :get_project_root
cd /d "%PROJECT_ROOT%\backend"

REM 激活虚拟环境
call .venv\Scripts\activate.bat

REM 检查测试目录
if exist "tests" (
    call :log_info "运行后端测试..."
    pytest tests\ -v
    if errorlevel 1 call :log_warn "后端测试有失败"
) else (
    call :log_warn "未找到测试目录"
)

call :log_info "后端测试完成"
goto :eof

REM 运行所有测试
:test_all
call :log_step "运行所有测试..."

call :test_frontend
call :test_backend

call :log_info "所有测试完成"
goto :eof

REM 构建 Docker 镜像
:docker_build
call :log_step "构建 Docker 镜像..."

call :get_project_root
cd /d "%PROJECT_ROOT%"

REM 构建后端镜像
call :log_info "构建后端 Docker 镜像..."
docker build -t rage-backend:latest .\backend
if errorlevel 1 exit /b 1

REM 构建前端镜像
call :log_info "构建前端 Docker 镜像..."
docker build -t rage-frontend:latest .\frontend
if errorlevel 1 exit /b 1

call :log_info "Docker 镜像构建完成"
goto :eof

REM 启动 Docker 服务
:docker_up
call :log_step "启动 Docker 服务..."

call :get_project_root
cd /d "%PROJECT_ROOT%"

REM 优先使用开发环境配置
if exist "docker-compose.dev.yml" (
    call :log_info "使用开发环境配置 (Milvus Standalone 模式)"
    docker compose -f docker-compose.dev.yml up -d
) else (
    call :log_info "使用默认配置"
    docker compose up -d
)
goto :eof

REM 停止 Docker 服务
:docker_down
call :log_step "停止 Docker 服务..."

call :get_project_root
cd /d "%PROJECT_ROOT%"

REM 检查并停止开发环境配置
if exist "docker-compose.dev.yml" (
    call :log_info "停止开发环境服务"
    docker compose -f docker-compose.dev.yml down
)

REM 也停止默认配置
docker compose down
goto :eof

REM 查看 Docker 日志
:docker_logs
call :log_step "查看 Docker 日志..."

call :get_project_root
cd /d "%PROJECT_ROOT%"

REM 优先使用开发环境配置
if exist "docker-compose.dev.yml" (
    docker compose -f docker-compose.dev.yml logs -f
) else (
    docker compose logs -f
)
goto :eof

REM 检查服务状态
:status
call :log_step "检查服务状态..."

REM 检查后端服务
curl -f http://localhost:8000/ >nul 2>&1
if errorlevel 1 (
    call :log_warn "✗ 后端服务无法访问"
) else (
    call :log_info "✓ 后端服务运行正常"
)

REM 检查前端服务
curl -f http://localhost/ >nul 2>&1
if errorlevel 1 (
    call :log_warn "✗ 前端服务无法访问"
) else (
    call :log_info "✓ 前端服务运行正常"
)

goto :eof

REM 显示帮助信息
:show_help
echo.
echo %CYAN%RAG 参数调测平台 - 开发工具%NC%
echo.
echo %WHITE%用法:%NC%
echo     scripts\dev.bat ^<command^>
echo.
echo %WHITE%可用命令:%NC%
echo.
echo %YELLOW%开发相关:%NC%
echo     install          安装所有依赖
echo     install-backend  只安装后端依赖
echo     install-frontend 只安装前端依赖
echo     dev              显示开发环境启动说明
echo     dev-backend      启动后端开发服务器
echo     dev-frontend     启动前端开发服务器
echo.
echo %YELLOW%构建相关:%NC%
echo     build            构建前后端项目
echo     build-frontend   只构建前端
echo     build-backend    只构建后端
echo     clean            清理构建产物
echo.
echo %YELLOW%测试相关:%NC%
echo     test             运行所有测试
echo     test-frontend    运行前端测试
echo     test-backend     运行后端测试
echo.
echo %YELLOW%Docker 相关:%NC%
echo     docker-build     构建 Docker 镜像
echo     docker-up        启动 Docker 服务
echo     docker-down      停止 Docker 服务
echo     docker-logs      查看 Docker 日志
echo.
echo %YELLOW%其他:%NC%
echo     status           检查服务状态
echo     help             显示此帮助信息
echo.
echo %WHITE%示例:%NC%
echo     scripts\dev.bat install
echo     scripts\dev.bat build
echo     scripts\dev.bat docker-up
echo.
goto :eof

REM 主函数
:main
set "command=%~1"
if "%command%"=="" set "command=help"

if "%command%"=="help" goto show_help
if "%command%"=="install" goto install_all
if "%command%"=="install-backend" goto install_backend
if "%command%"=="install-frontend" goto install_frontend
if "%command%"=="dev" goto dev_all
if "%command%"=="dev-backend" goto dev_backend
if "%command%"=="dev-frontend" goto dev_frontend
if "%command%"=="build" goto build_all
if "%command%"=="build-frontend" goto build_frontend
if "%command%"=="build-backend" goto build_backend
if "%command%"=="clean" goto clean
if "%command%"=="test" goto test_all
if "%command%"=="test-frontend" goto test_frontend
if "%command%"=="test-backend" goto test_backend
if "%command%"=="docker-build" goto docker_build
if "%command%"=="docker-up" goto docker_up
if "%command%"=="docker-down" goto docker_down
if "%command%"=="docker-logs" goto docker_logs
if "%command%"=="status" goto status

call :log_error "未知命令: %command%"
call :show_help
exit /b 1

REM 脚本入口点
call :main %*