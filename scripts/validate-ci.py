#!/usr/bin/env python3
"""
CI 配置验证脚本
"""
import json
import sys
from pathlib import Path

def validate_frontend_scripts():
    """验证前端脚本配置"""
    package_json_path = Path("frontend/package.json")

    if not package_json_path.exists():
        print("❌ frontend/package.json 不存在")
        return False

    with open(package_json_path, 'r') as f:
        package_data = json.load(f)

    scripts = package_data.get('scripts', {})
    required_scripts = ['type-check', 'lint', 'build', 'test']

    print("📋 检查前端脚本:")
    all_good = True

    for script in required_scripts:
        if script in scripts:
            print(f"  ✅ {script}: {scripts[script]}")
        else:
            print(f"  ❌ {script}: 缺失")
            all_good = False

    return all_good

def validate_backend_tests():
    """验证后端测试配置"""
    tests_dir = Path("backend/tests")

    print("\n📋 检查后端测试:")

    if not tests_dir.exists():
        print("  ❌ backend/tests 目录不存在")
        return False

    test_files = list(tests_dir.glob("test_*.py"))

    if test_files:
        print(f"  ✅ 找到 {len(test_files)} 个测试文件:")
        for test_file in test_files:
            print(f"    - {test_file.name}")
        return True
    else:
        print("  ⚠️  没有找到测试文件 (test_*.py)")
        return False

def validate_ci_config():
    """验证 CI 配置"""
    import yaml

    ci_config_path = Path(".github/workflows/ci.yml")

    if not ci_config_path.exists():
        print("❌ CI 配置文件不存在")
        return False

    try:
        with open(ci_config_path, 'r') as f:
            ci_config = yaml.safe_load(f)

        print("\n📋 检查 CI 配置:")

        # 检查作业
        jobs = ci_config.get('jobs', {})
        expected_jobs = ['test', 'build', 'deploy']

        for job in expected_jobs:
            if job in jobs:
                print(f"  ✅ {job} 作业存在")
            else:
                print(f"  ❌ {job} 作业缺失")
                return False

        return True

    except yaml.YAMLError as e:
        print(f"❌ CI 配置 YAML 语法错误: {e}")
        return False

def main():
    """主函数"""
    print("🔍 验证 CI/CD 配置...\n")

    checks = [
        validate_frontend_scripts(),
        validate_backend_tests(),
        validate_ci_config()
    ]

    if all(checks):
        print("\n✅ 所有检查通过！CI/CD 配置正确。")
        return 0
    else:
        print("\n❌ 部分检查失败，请修复后重试。")
        return 1

if __name__ == "__main__":
    sys.exit(main())