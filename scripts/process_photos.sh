#!/bin/bash

# 按时间戳排序照片并移动到网站文件夹
SOURCE_DIR="/Users/jarredren/Downloads/Time"
DEST_DIR="/Users/jarredren/Birthday/public/timeline-images"

# 创建目标文件夹
mkdir -p "$DEST_DIR"

echo "照片处理脚本"
echo "=========================================="
echo "源文件夹: $SOURCE_DIR"
echo "目标文件夹: $DEST_DIR"
echo "=========================================="
echo ""

# 临时文件存储照片和时间戳
TEMP_FILE=$(mktemp)

cd "$SOURCE_DIR" || exit 1

# 获取所有照片文件并按时间戳排序
file_count=0
shopt -s nullglob

for file in *.{JPG,JPEG,PNG,GIF,HEIC,HEIF,WEBP} *.jpg *.jpeg *.png *.gif *.heic *.heif *.webp; do
    [ -f "$file" ] || continue
    
    # 尝试获取时间戳
    timestamp=""
    timestamp_seconds=""
    
    # 方法1: 使用 exiftool 获取 EXIF 时间
    if command -v exiftool &> /dev/null; then
        timestamp=$(exiftool -DateTimeOriginal -s3 "$file" 2>/dev/null || exiftool -CreateDate -s3 "$file" 2>/dev/null || echo "")
        if [ -n "$timestamp" ]; then
            # 转换格式: 2024:07:04 18:23:06 -> 2024-07-04 18:23:06
            timestamp=$(echo "$timestamp" | sed 's/:/-/g; s/-/-/g' | cut -d' ' -f1,2 | cut -d'.' -f1)
            timestamp_seconds=$(date -j -f "%Y-%m-%d %H:%M:%S" "$timestamp" "+%s" 2>/dev/null || echo "")
        fi
    fi
    
    # 方法2: 使用 mdls 获取创建时间（macOS）
    if [ -z "$timestamp_seconds" ] && command -v mdls &> /dev/null; then
        creation_date=$(mdls -name kMDItemContentCreationDate "$file" 2>/dev/null | grep -o '[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\} [0-9]\{2\}:[0-9]\{2\}:[0-9]\{2\}' || echo "")
        if [ -n "$creation_date" ]; then
            timestamp="$creation_date"
            timestamp_seconds=$(date -j -f "%Y-%m-%d %H:%M:%S" "$creation_date" "+%s" 2>/dev/null || echo "")
        fi
    fi
    
    # 方法3: 使用文件修改时间
    if [ -z "$timestamp_seconds" ]; then
        timestamp_seconds=$(stat -f %m "$file" 2>/dev/null || echo "")
        if [ -n "$timestamp_seconds" ]; then
            timestamp=$(date -r "$timestamp_seconds" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "")
        fi
    fi
    
    if [ -n "$timestamp_seconds" ]; then
        echo "$timestamp_seconds|$file|$timestamp"
        ((file_count++))
    fi
done | sort -t'|' -k1 -n > "$TEMP_FILE"

echo "找到 $file_count 张照片"
echo "开始按时间戳排序并复制到目标文件夹..."
echo ""

# 按排序顺序复制文件
counter=1
while IFS='|' read -r timestamp_seconds filename timestamp; do
    # 生成新文件名：序号_原文件名
    extension="${filename##*.}"
    basename="${filename%.*}"
    safe_name=$(echo "$basename" | sed 's/[^a-zA-Z0-9_-]/_/g')
    new_name=$(printf "%03d_%s.%s" "$counter" "$safe_name" "$extension")
    
    # 复制文件
    if cp "$SOURCE_DIR/$filename" "$DEST_DIR/$new_name" 2>/dev/null; then
        echo "[$(printf "%3d" $counter)/$file_count] $filename -> $new_name ($timestamp)"
        ((counter++))
    else
        echo "错误: 无法复制 $filename"
    fi
done < "$TEMP_FILE"

echo ""
echo "完成！已复制 $((counter - 1)) 张照片到 $DEST_DIR"

# 生成文件列表（重新读取临时文件）
list_file="$DEST_DIR/photo_list.txt"
{
    echo "照片列表（按时间戳排序）"
    echo "=========================================="
    echo ""
    counter=1
    while IFS='|' read -r timestamp_seconds filename timestamp; do
        extension="${filename##*.}"
        basename="${filename%.*}"
        safe_name=$(echo "$basename" | sed 's/[^a-zA-Z0-9_-]/_/g')
        new_name=$(printf "%03d_%s.%s" "$counter" "$safe_name" "$extension")
        echo "$new_name"
        echo "  原文件名: $filename"
        echo "  时间: $timestamp"
        echo ""
        ((counter++))
    done < "$TEMP_FILE"
} > "$list_file" 2>/dev/null

echo "文件列表已保存到: $list_file"

# 清理临时文件
rm -f "$TEMP_FILE"
