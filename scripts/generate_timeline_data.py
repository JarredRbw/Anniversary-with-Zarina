#!/usr/bin/env python3
"""
根据图片文件名生成时间线配置
按日期从后往前排序（最新的在前）
"""

import os
import re
from datetime import datetime

dest_dir = "/Users/jarredren/Birthday/public/timeline-images"
output_file = "/Users/jarredren/Birthday/src/data/timelineData.js"

# 获取所有图片文件
photos = []
for filename in os.listdir(dest_dir):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        match = re.match(r'(\d{4})\.(\d{1,2})\.(\d{1,2})', filename)
        if match:
            year, month, day = map(int, match.groups())
            try:
                date = datetime(year, month, day)
                photos.append((date, filename))
            except:
                pass

# 按日期从前往后排序（最早的在前，最新的在后）
# 注意：时间线显示时，越新的越靠下
photos.sort()

# 图标选项
icons = ['💕', '📸', '✨', '🎉', '🌙', '☀️', '🌸', '🍂', '❄️', '🌈', '💝', '🎊', '🌺', '🌼', '🍁', '🌿', '🦋', '🌟', '💫', '🎈']

# 颜色选项
colors = ['#ff6b9d', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ffb6c1', '#ffd89b', '#d4a574', '#b8e0d2', '#ffaaa5', '#ffd3b6', '#b0e0e6', '#ff69b4', '#6c5ce7', '#ff7675', '#fdcb6e', '#e17055', '#d63031', '#c45a7a', '#ffd700']

# 生成时间线数据
timeline_data = []

for i, (date, filename) in enumerate(photos):
    # 格式化日期
    date_str = date.strftime('%Y年%m月%d日')
    
    # 简单描述（用户说会手动修改）
    description = f'这一天我们一起度过了美好的时光，留下了珍贵的回忆'
    
    # 选择图标和颜色（循环使用）
    icon = icons[i % len(icons)]
    color = colors[i % len(colors)]
    
    timeline_data.append({
        'date': date_str,
        'title': f'{date.strftime("%m月%d日")}的美好时光',
        'description': description,
        'icon': icon,
        'color': color,
        'image': f'/timeline-images/{filename}'
    })

# 在最底部添加18岁生日事件（金色）
timeline_data.append({
    'date': '2024年11月24日',
    'title': '你的18岁生日',
    'description': '今天是你18岁的生日，愿你的每一天都充满阳光和快乐！',
    'icon': '🎂',
    'color': '#ffd700',
    'isSpecial': True,
    'image': None  # 生日事件暂时没有图片
})

# 生成JavaScript代码
js_code = """// Timeline 数据配置文件
// 自动根据图片文件名生成，按日期从前往后排序（最早的在前，最新的在后）
// 可以手动修改描述和内容

export const timelineData = [
"""

for event in timeline_data:
    js_code += "  {\n"
    js_code += f"    date: '{event['date']}',\n"
    js_code += f"    title: '{event['title']}',\n"
    js_code += f"    description: '{event['description']}',\n"
    js_code += f"    icon: '{event['icon']}',\n"
    js_code += f"    color: '{event['color']}',\n"
    if event.get('isSpecial'):
        js_code += f"    isSpecial: true, // 特殊标记，会显示金色发光效果\n"
    if event.get('image'):
        js_code += f"    image: '{event['image']}'\n"
    else:
        js_code += "    image: null\n"
    js_code += "  },\n"

js_code += """];

// 使用说明：
// 1. 照片已按日期从后往前排序（最新的在前）
// 2. 可以手动修改每个事件的 title 和 description
// 3. 最底部的18岁生日事件标记为特殊事件（金色发光效果）
// 4. 添加照片：将 image 设置为 '/timeline-images/文件名'
// 5. 移除事件：删除对应的对象即可
"""

# 写入文件
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f"已生成时间线配置：{output_file}")
print(f"共 {len(timeline_data)} 个事件（{len(photos)} 张图片 + 1 个生日事件）")
print(f"日期范围：{photos[-1][0].strftime('%Y年%m月%d日')} - {photos[0][0].strftime('%Y年%m月%d日')}")

