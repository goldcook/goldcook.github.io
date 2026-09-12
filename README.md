# goldcook.github.io

Goldcook 的个人主页，一份以温暖 16-bit RPG 为视觉语言的人生游戏存档。

页面采用“开场 → 世界地图 → 独立场景”的结构，地图是内容目录，各场景可随时返回地图重新选择。

## 本地预览

```bash
python3 -m http.server 4173
```

打开 <http://localhost:4173>。

## 更新内容

- `index.html`：页面结构、固定文案和 SEO 信息。
- `content.js`：五区地图、成长/生活/思考内容、游戏与原创 BGM。
- `styles.css`：像素游戏视觉、桌面单屏场景与移动端响应式布局。
- `script.js`：地图交互、菜单与可切换的悬浮 Web Audio BGM。

## 音乐说明

三段“最近最爱 · 像素印象”均通过 Web Audio API 实时生成。它们只借鉴宽泛的音乐气质，不包含第三方音频文件或受版权保护的可识别旋律。

## 发布

推送到 `main` 后，GitHub Pages 会自动更新：<https://goldcook.github.io/>。
