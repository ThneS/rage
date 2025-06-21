"""
基本测试用例
"""
import pytest
from fastapi.testclient import TestClient

def test_placeholder():
    """占位测试，确保 pytest 可以运行"""
    assert True

# 如果需要测试 API，可以取消注释以下代码
# from app.main import app
#
# client = TestClient(app)
#
# def test_read_root():
#     """测试根路径"""
#     response = client.get("/")
#     assert response.status_code == 200