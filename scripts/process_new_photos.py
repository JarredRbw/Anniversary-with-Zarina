#!/usr/bin/env python3
"""
处理新照片：按日期从后往前排序并移动到网站文件夹
"""

import os
import shutil
import re
from datetime import datetime
from pathlib import Path

source_dir = "/Users/jarredren/Downloads/NewTime"
dest_dir = "/Users/jarredren/Birthday/public/timeline-images"

# 创建目标文件夹
Path(dest_dir).mkdir(parents=True, exist_ok=True)

# 获取所有图片文件
photos = []
for filename in os.listdir(source_dir):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.heic', '.heif')):
        # 解析日期：YYYY.M.D.jpg 或 YYYY.M.DD.jpg
        match = re.match(r'(\d{4})\.(\d{1,2})\.(\d{1,2})', filename)
        if match:
            year, month, day = map(int, match.groups())
            try:
                date = datetime(year, month, day)
                photos.append((date, filename))
            except:
                pass

# 按日期从后往前排序（最新的在前）
photos.sort(reverse=True)

print(f"找到 {len(photos)} 张图片")
print(f"开始复制到 {dest_dir}...\n")

# 复制文件（保持原文件名，因为文件名就是日期）
copied_files = []
for i, (date, filename) in enumerate(photos, 1):
    dest_file = os.path.join(dest_dir, filename)
    try:
        shutil.copy2(os.path.join(source_dir, filename), dest_file)
        copied_files.append((filename, date))
        if i <= 5 or i > len(photos) - 5:
            print(f"[{i:2d}/{len(photos)}] {filename} ({date.strftime('%Y年%m月%d日')})")
    except Exception as e:
        print(f"复制 {filename} 失败: {e}")

print(f"\n完成！已复制 {len(copied_files)} 张照片")

# 生成照片列表文件
list_file = os.path.join(dest_dir, "photo_list.txt")
with open(list_file, 'w', encoding='utf-8') as f:
    f.write("照片列表（按日期从后往前排序，最新的在前）\n")
    f.write("=" * 50 + "\n\n")
    for filename, date in copied_files:
        f.write(f"{filename}\n")
        f.write(f"  日期: {date.strftime('%Y年%m月%d日')}\n\n")

print(f"照片列表已保存到: {list_file}")

