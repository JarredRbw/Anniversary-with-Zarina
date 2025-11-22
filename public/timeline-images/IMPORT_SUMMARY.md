# 照片导入总结

## 📊 导入统计

- **总照片数**: 108 张
- **HEIC 格式**: 67 张 ⚠️
- **JPG 格式**: 41 张 ✅
- **时间范围**: 2008年12月 - 2025年11月

## ⚠️ 重要提示：HEIC 格式照片

您的照片中有 **67 张 HEIC 格式**的照片。这些照片在大多数网页浏览器中**无法显示**（只有 Safari 浏览器支持）。

### 🔧 转换 HEIC 为 JPG 的方法

#### 方法 1：批量转换（推荐）

1. **使用在线工具批量转换**：
   - https://cloudconvert.com/heic-to-jpg
   - 上传所有 HEIC 文件，批量转换为 JPG

2. **使用 macOS 预览应用**：
   ```bash
   # 在终端中运行以下命令（需要先安装 ImageMagick 或使用脚本）
   # 或者使用 Automator 创建批量转换工作流
   ```

3. **使用 Python 脚本批量转换**：
   ```bash
   # 需要先安装：pip install pillow pillow-heif
   # 可以创建一个转换脚本
   ```

#### 方法 2：在 iPhone/iPad 上转换

1. 打开"照片"应用
2. 选择多张照片
3. 点击"分享" → "存储到文件"
4. 系统会自动将 HEIC 转换为 JPG

#### 方法 3：修改 iPhone 默认格式

1. 设置 → 相机 → 格式
2. 选择"最兼容"（之后拍摄的照片会保存为 JPG）

## 📝 照片列表

所有照片已按时间戳排序，并重命名为 `001_xxx`, `002_xxx` 等格式。

详细的照片列表请查看：`photo_list.txt`

## 📋 照片命名规则

- 格式：`001_原文件名.扩展名`
- 例如：`001_L1200515.JPG`, `008_IMG_6193.HEIC`
- 所有照片按时间戳从早到晚排序

## 🎯 下一步

1. **转换 HEIC 照片**：将 HEIC 格式的照片转换为 JPG
2. **更新配置文件**：在 `src/data/timelineData.js` 中添加照片路径
3. **测试显示**：在浏览器中查看照片是否正确显示

## 📁 文件位置

- 照片文件夹：`public/timeline-images/`
- 照片列表：`public/timeline-images/photo_list.txt`
- 配置文件：`src/data/timelineData.js`

## 🔗 快速链接

- 配置文件：`src/data/timelineData.js`
- 使用说明：`src/data/README.md`
- 图片说明：`public/timeline-images/README.md`

