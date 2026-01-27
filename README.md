# Pear New Tab

Pear New Tab 是一款 Chrome 新标签页扩展，让你可以将浏览器书签文件夹转化为直观的工作区视图，快速访问常用网站。
用更直观的方式使用你的常用书签。

## 功能列表

1. [x] 工作区管理
    - [x] 从 Chrome 书签树中选择文件夹作为工作区
    - [x] 支持多个工作区，一键切换
    - [x] 支持删除工作区
    - [x] 工作区配置云端同步（chrome.storage.sync）
2. [ ] 书签展示
    - [x] 卡片式书签列表，清晰展示标题和网址
    - [x] 按文件夹分组展示书签
    - [x] 自动获取并显示网站 Favicon 图标
    - [ ] 支持书签多选功能
3. [ ] 拖拽排序
    - [x] 文件夹列拖拽排序
    - [ ] 同文件夹内书签拖拽调整顺序
4. [x] 主题切换
    - [x] 三种主题模式：明亮 / 暗黑 / 跟随系统
    - [x] 主题偏好本地持久化
    - [x] 实时响应系统主题变化

## Technology Stack

- 前端框架: React 19 + Vite 7 + node 24 + pnpm 10 + CRXJS
- UI 组件: Ant Design 6
- 样式方案: Tailwind CSS 4
- 状态管理: Valtio
- 拖拽功能: dnd-kit
- 扩展规范: Chrome Manifest V3

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Start development server:

```bash
pnpm run dev
```

3. Open Chrome and navigate to `chrome://extensions/`, enable "Developer mode", and load the unpacked extension from the `dist` directory.

4. Build for production:

```bash
npm run build
```

## Project Structure

- `src/newtab/` - Extension newtab UI
- `src/popup/` - Extension popup UI
- `manifest.config.js` - Chrome extension manifest configuration

## Documentation

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [CRXJS Documentation](https://crxjs.dev/vite-plugin)

## Chrome Extension Development Notes

- Use `manifest.config.js` to configure your extension
- The CRXJS plugin automatically handles manifest generation
- Content scripts should be placed in `src/content/`
- Popup UI should be placed in `src/popup/`
