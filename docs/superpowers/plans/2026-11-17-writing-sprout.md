# 写作芽芽 Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline. 用户已同意默认推进；按工作区要求直接 main 开发、自动提交发布，不另建分支或 worktree。

**Goal:** 交付可发布的低年级静态写作练习应用。
**Architecture:** 原生 ES modules，共享数据模型/路由/编辑器/弹窗；public 静态资源仅复制到 dist。
**Tech Stack:** HTML/CSS/JavaScript、Node test、Playwright（仅开发）。
**Spec:** DESIGN.md 与 UX-CONTRACT.md。

## Global Constraints
- 纯静态 GitHub Pages；iPad 优先、多端、专属图标、离线子路径；不上传个人数据。
- 唯一 public 仓库 main，Actions 发布 dist；应用岛 pending → 验证后 published。

## Review Focus
- 存储损坏/权限拒绝：不覆盖原始数据，保留输入与导出。
- 导入恶意/重复/超大内容：全量验证，失败不改原数据。
- 切换/刷新/中文输入：无意外提交与丢失。
- 手机横屏/减少动态：主要操作完整可达。
- 多窗口并发：检测变化，停止写入，允许导出当前文字。

### Task 1: 内容与数据安全
Files: public/content.js, public/model.js, tests/model.test.mjs。
Interfaces: lessons 数组；parseBackup(text), mergeEntries(current,incoming), countWords(text), Store(storage)。
- [x] 写数据备份、字数、冲突和存储失败测试并见失败。
- [x] 实现 20 个主题和模型，运行 npm test 验证。

### Task 2: 完整 UI
Files: public/index.html, app.js, styles.css, assets/，tests/browser.mjs。
Interfaces: hash 路由、共用编辑器、年级过滤、作品本/备份、弹窗。
- [x] 浏览器测试先覆盖主页到保存/完成/作品本，见失败。
- [x] 实现共享导航、插画卡片、分步提示、保存/恢复与模态。
- [x] Chrome 和 WebKit 模拟 iPad 横竖、手机横竖、PC；验证键盘、失败、冲突、备份与减少动态。

### Task 3: 发布
Files: scripts/build.mjs, serve.mjs, public/sw.js, manifest.webmanifest, .github/workflows/pages.yml, README.md, docs/VERIFICATION.md。
- [x] 验证构建资源、子路径与离线，再运行全部检查。
- [x] main 提交推送唯一 public 仓库；核验 CI/Pages/线上资源与流程。
- [x] 应用岛启用入口、检查新窗口及其 CI/Pages，回填文档。

## 执行记录
2026-11-17：内容模型与浏览器流程先观察失败，再实现通过。11 项模型测试、6 个 Chrome 视口完整流程、3 个 WebKit 视口通过。独立审查发现跳转内容链接与 hash 路由冲突，补充失败回归后修复；IME 跨路由原主题保存亦有回归覆盖。静态审计不能解析事件代理，误报有真实动作的按钮，保留检查结果与浏览器证据说明，不为绕过审计添加内联事件。
