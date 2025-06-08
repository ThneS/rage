import os
import shutil
from typing import Optional
from fastapi import UploadFile
from app.core.config import settings


def get_file_extension(filename: str) -> str:
    """获取文件扩展名"""
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""


async def save_upload_file(file: UploadFile) -> str:
    """保存上传的文件"""
    # 确保上传目录存在
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # 生成文件路径
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)

    # 保存文件
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()

    return file_path


def get_file_size(file_path: str) -> int:
    """获取文件大小（字节）"""
    return os.path.getsize(file_path)


def delete_file(file_path: str) -> None:
    """删除文件"""
    if os.path.exists(file_path):
        os.remove(file_path)


def ensure_directory(directory: str) -> None:
    """确保目录存在"""
    os.makedirs(directory, exist_ok=True)


def get_file_info(file_path: str) -> dict:
    """获取文件信息"""
    return {
        "size": get_file_size(file_path),
        "extension": get_file_extension(file_path),
        "exists": os.path.exists(file_path),
        "is_file": os.path.isfile(file_path),
        "is_dir": os.path.isdir(file_path),
    }