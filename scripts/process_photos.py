#!/usr/bin/env python3
"""
按时间戳排序照片并移动到网站文件夹
支持 JPG, PNG, HEIC 格式
"""

import os
import shutil
from pathlib import Path
from datetime import datetime
from PIL import Image
from PIL.ExifTags import TAGS
import subprocess

def get_photo_timestamp(file_path):
    """获取照片的时间戳（优先使用EXIF数据）"""
    file_path = Path(file_path)
    
    # 首先尝试从EXIF获取
    try:
        if file_path.suffix.upper() in ['.JPG', '.JPEG', '.PNG']:
            with Image.open(file_path) as img:
                exifdata = img.getexif()
                for tag_id in exifdata:
                    tag = TAGS.get(tag_id, tag_id)
                    if tag == 'DateTimeOriginal' or tag == 'DateTime':
                        date_str = exifdata.get(tag_id)
                        if date_str:
                            # 解析 EXIF 日期格式: "2024:07:04 18:23:06"
                            try:
                                dt = datetime.strptime(date_str, "%Y:%m:%d %H:%M:%S")
                                return dt.timestamp()
                            except:
                                pass
                    elif tag == 'DateTimeDigitized':
                        date_str = exifdata.get(tag_id)
                        if date_str:
                            try:
                                dt = datetime.strptime(date_str, "%Y:%m:%d %H:%M:%S")
                                return dt.timestamp()
                            except:
                                pass
    except Exception as e:
        print(f"读取 {file_path.name} 的 EXIF 失败: {e}")
    
    # 对于 HEIC 格式，尝试使用 exiftool（如果可用）
    if file_path.suffix.upper() in ['.HEIC', '.HEIF']:
        try:
            result = subprocess.run(
                ['exiftool', '-s3', '-DateTimeOriginal', str(file_path)],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0 and result.stdout.strip():
                date_str = result.stdout.strip()
                try:
                    dt = datetime.strptime(date_str, "%Y:%m:%d %H:%M:%S")
                    return dt.timestamp()
                except:
                    pass
        except:
            pass
    
    # 如果无法获取EXIF，使用文件修改时间
    stat = file_path.stat()
    return stat.st_mtime

def process_photos(source_dir, dest_dir):
    """处理照片：按时间戳排序并移动到目标文件夹"""
    source_path = Path(source_dir)
    dest_path = Path(dest_dir)
    
    # 创建目标文件夹
    dest_path.mkdir(parents=True, exist_ok=True)
    
    # 支持的图片格式
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.heic', '.heif', '.webp', '.JPG', '.JPEG', '.PNG', '.GIF', '.HEIC', '.HEIF', '.WEBP'}
    
    # 获取所有照片文件
    photos = []
    for file_path in source_path.iterdir():
        if file_path.is_file() and file_path.suffix in image_extensions:
            try:
                timestamp = get_photo_timestamp(file_path)
                photos.append((timestamp, file_path))
            except Exception as e:
                print(f"处理 {file_path.name} 时出错: {e}")
    
    # 按时间戳排序
    photos.sort(key=lambda x: x[0])
    
    print(f"找到 {len(photos)} 张照片")
    print(f"开始按时间戳排序并移动到 {dest_path}...\n")
    
    # 复制文件并重命名（保留扩展名）
    copied_files = []
    for i, (timestamp, file_path) in enumerate(photos, 1):
        date = datetime.fromtimestamp(timestamp)
        # 生成新文件名：按序号_原文件名
        # 保留原扩展名
        extension = file_path.suffix
        # 清理文件名，移除特殊字符
        safe_name = file_path.stem.replace(' ', '_').replace('(', '').replace(')', '')
        new_name = f"{i:03d}_{safe_name}{extension}"
        dest_file = dest_path / new_name
        
        try:
            # 复制文件
            shutil.copy2(file_path, dest_file)
            copied_files.append((new_name, date.strftime("%Y-%m-%d %H:%M:%S")))
            print(f"[{i:3d}/{len(photos)}] {file_path.name} -> {new_name} ({date.strftime('%Y-%m-%d %H:%M:%S')})")
        except Exception as e:
            print(f"复制 {file_path.name} 失败: {e}")
    
    print(f"\n完成！已复制 {len(copied_files)} 张照片到 {dest_path}")
    
    # 生成文件列表（供参考）
    list_file = dest_path / "photo_list.txt"
    with open(list_file, 'w', encoding='utf-8') as f:
        f.write("照片列表（按时间戳排序）\n")
        f.write("=" * 50 + "\n\n")
        for name, date in copied_files:
            f.write(f"{name}\n")
            f.write(f"  时间: {date}\n\n")
    
    print(f"文件列表已保存到: {list_file}")

if __name__ == "__main__":
    source_dir = "/Users/jarredren/Downloads/Time"
    dest_dir = "/Users/jarredren/Birthday/public/timeline-images"
    
    print("照片处理脚本")
    print("=" * 50)
    print(f"源文件夹: {source_dir}")
    print(f"目标文件夹: {dest_dir}")
    print("=" * 50 + "\n")
    
    process_photos(source_dir, dest_dir)

