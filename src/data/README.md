# Timeline 数据配置说明

## 📁 文件结构

```
Birthday/
├── src/
│   └── data/
│       ├── timelineData.js    # 时间线数据配置文件
│       └── README.md          # 本说明文件
└── public/
    └── timeline-images/       # 时间线图片文件夹
        └── README.md          # 图片使用说明
```

## 📝 如何修改时间线内容

### 1. 修改文字内容

编辑 `src/data/timelineData.js` 文件，找到要修改的事件，修改以下字段：

- `date`: 日期（例如：'2024年4月23日'）
- `title`: 标题（例如：'我们在一起了'）
- `description`: 描述文字

### 2. 添加照片

**步骤：**
1. 将照片文件放入 `public/timeline-images/` 文件夹
   - ✅ 支持格式：**JPG, PNG, GIF, WebP**（推荐）
   - ⚠️ **HEIC/HEIF 格式不支持**（仅在 Safari 浏览器支持，其他浏览器无法显示）
   - 建议文件大小：< 2MB
   - 建议宽度：800-1200px

2. **如果照片是 HEIC 格式，需要先转换：**
   - iPhone/iPad：在分享时选择"存储到文件"，系统会自动转换为 JPG
   - 在线转换：https://cloudconvert.com/heic-to-jpg
   - Mac 预览：用"预览"打开后导出为 JPG
   - 修改设置：iPhone 设置 → 相机 → 格式 → 选择"最兼容"

3. 在 `timelineData.js` 中，找到对应事件的 `image` 字段
   - 设置为：`image: '/timeline-images/你的照片文件名'`
   - 例如：`image: '/timeline-images/anniversary.jpg'`
   - 如果不需要图片，保持 `image: null`

**示例：**
```javascript
{
  date: '2024年4月23日',
  title: '我们在一起了',
  description: '那个晚上，我鼓起勇气向你表白，神经末梢的酥麻感至今难忘',
  icon: '💕',
  color: '#ff6b9d',
  image: '/timeline-images/together.jpg'  // 添加照片
}
```

### 3. 修改图标和颜色

- `icon`: 可以使用任意 emoji 或文字（例如：'💕', '🎂', '✨'）
- `color`: 十六进制颜色代码（例如：'#ff6b9d'），用于 marker 的背景色

### 4. 添加新事件

复制一个现有的事件对象，修改相应字段即可：

```javascript
{
  date: '2024年某月',
  title: '新的事件标题',
  description: '事件描述',
  icon: '🎉',
  color: '#ff6b9d',
  image: '/timeline-images/new-event.jpg',  // 可选
  isSpecial: false  // 可选，设置为 true 会显示金色发光效果
}
```

### 5. 标记特殊事件

设置 `isSpecial: true` 可以让事件显示特殊的金色发光效果：

```javascript
{
  date: '2024年11月24日',
  title: '你的18岁生日',
  description: '今天是你18岁的生日，愿你的每一天都充满阳光和快乐！',
  icon: '🎂',
  color: '#ffd700',
  isSpecial: true,  // 特殊标记
  image: null
}
```

## 🖼️ 图片使用注意事项

1. **文件路径格式**：
   - 本地图片：`'/timeline-images/文件名.jpg'`
   - 远程图片：直接使用完整 URL（例如：`'https://example.com/image.jpg'`）

2. **图片命名建议**：
   - 使用英文和数字
   - 避免特殊字符和空格
   - 例如：`first-meet.jpg`, `anniversary-2024.png`

3. **图片优化**：
   - 压缩图片以减少加载时间
   - 使用 WebP 格式可以获得更好的压缩比
   - 建议宽度在 800-1200px 之间

## 🔄 修改后刷新

修改 `timelineData.js` 文件后，保存文件，React 开发服务器会自动重新加载页面。

如果修改了图片，确保：
1. 图片文件已放入 `public/timeline-images/` 文件夹
2. 文件路径在 `timelineData.js` 中正确配置
3. 刷新浏览器页面查看效果

## 💡 示例配置

完整的事件配置示例：

```javascript
{
  date: '2024年6月15日',
  title: '第一次旅行',
  description: '一起去了海边，你帮我拍了好多好看的照片，每一张都是珍贵的回忆',
  icon: '✈️',
  color: '#a8e6cf',
  image: '/timeline-images/travel-beach.jpg',
  isSpecial: false
}
```

## ❓ 常见问题

**Q: 图片不显示怎么办？**
A: 检查以下几点：
- 图片文件是否在 `public/timeline-images/` 文件夹中
- 文件路径是否正确（注意大小写）
- 文件扩展名是否正确
- 浏览器控制台是否有错误信息

**Q: 如何删除一个事件？**
A: 在 `timelineData.js` 中删除对应的对象即可。

**Q: 可以添加视频吗？**
A: 目前只支持图片。如需视频功能，可以联系开发者添加。

