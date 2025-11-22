# Timeline 图片文件夹

请将时间线的照片放在这个文件夹下。

## 使用方法

1. 将照片文件（jpg, png, gif 等）放入此文件夹
2. 在 `src/data/timelineData.js` 文件中，找到对应的事件
3. 将 `image` 字段设置为 `/timeline-images/你的照片文件名`
   - 例如：如果照片是 `first-meet.jpg`，则设置为 `image: '/timeline-images/first-meet.jpg'`

## 支持格式

- ✅ **JPG / JPEG**（推荐）
- ✅ **PNG**
- ✅ **GIF**
- ✅ **WebP**（推荐，压缩比更高）
- ⚠️ **HEIC / HEIF**（⚠️ 仅在 Safari 浏览器支持，其他浏览器无法显示）

## ⚠️ HEIC 格式说明

**重要提示：** iOS 设备默认保存的 HEIC 格式图片在大多数网页浏览器中**无法显示**（只有 Safari 支持）。

### 如果您有 HEIC 格式的照片，需要先转换为 JPG 或 PNG：

#### 方法 1：在 iPhone/iPad 上转换（推荐）
1. 打开"照片"应用
2. 选择要转换的照片
3. 点击"分享"按钮
4. 选择"存储到文件"或直接发送给自己
5. 在发送时，系统会自动转换为 JPG 格式

#### 方法 2：使用在线转换工具
- https://cloudconvert.com/heic-to-jpg
- https://convertio.co/zh/heic-jpg/
- https://www.zamzar.com/convert/heic-to-jpg/

#### 方法 3：使用 Mac 上的"预览"应用
1. 用"预览"打开 HEIC 文件
2. 文件 → 导出为...
3. 选择格式为"JPEG"
4. 保存

#### 方法 4：在 iPhone 上修改默认格式
1. 设置 → 相机 → 格式
2. 选择"最兼容"（会自动保存为 JPG）

## 注意事项

- 文件名建议使用英文和数字，避免中文文件名
- 建议图片大小不超过 2MB，以获得更好的加载速度
- 建议图片宽度在 800-1200px 之间，以获得最佳显示效果
- **强烈建议使用 JPG 或 PNG 格式，以确保所有浏览器都能正常显示**

