# 给亲爱的yyx - 一周年纪念网站

这是一个专门为一周年纪念日制作的浪漫网站。

## 部署到 Vercel

### 方法一：通过 Vercel CLI（最简单）

1. 安装 Vercel CLI（如果还没有安装）：
```bash
npm i -g vercel
```

2. 在项目目录下登录 Vercel：
```bash
vercel login
```

3. 部署项目：
```bash
vercel
```

4. 按照提示完成部署即可。

### 方法二：通过 GitHub（推荐）

1. 在 GitHub 上创建一个新的仓库

2. 将代码推送到 GitHub：
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <你的GitHub仓库URL>
git push -u origin main
```

3. 访问 [vercel.com](https://vercel.com)

4. 使用 GitHub 账号登录

5. 点击 "Add New Project"

6. 选择刚才创建的仓库

7. Vercel 会自动检测这是一个静态网站，直接点击 "Deploy" 即可

8. 部署完成后，Vercel 会提供一个 URL，例如：`https://your-project.vercel.app`

## 文件说明

- `index.html` - 主页面
- `style.css` - 样式文件
- `script.js` - 交互脚本
- `background.jpg` - 背景图片

## 自定义域名（可选）

如果你有自己的域名，可以在 Vercel 项目设置中添加自定义域名。

