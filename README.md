# 写作芽芽

面向小学一至三年级的 iPad 优先写作练习应用。看图写话、按体裁写作、写作技巧练习与作品本，帮助孩子从观察到独立表达。

- 8 个原创插画主题、6 个体裁主题、6 种写作技巧，逐步引导与原创参考片段。
- 作品自动保存在当前浏览器，支持 JSON 备份、合并导入和单篇文本导出。
- 纯静态应用，无账号、后端、外部 API 和运行依赖；不提供 AI 批改或跨设备自动同步。
- 支持离线使用（首次联网打开并完成缓存后）、主屏幕图标及减少动态效果。

## 开发

Node.js 22+；`npm ci`，`npm test`，`npm run build`，`npm start`。
本地预览 http://127.0.0.1:4186/writing-sprout/ 。
浏览器验证：`npm run test:browser`（已安装 Google Chrome；可通过 BROWSER_EXECUTABLE 指定路径）。

## 发布

唯一公开源码仓库：https://github.com/ZhiYanRen/writing-sprout 。main 主干，Pages 来源 GitHub Actions。
`.github/workflows/pages.yml` 验证后发布 `dist/`，PR 仅验证。正式网站：[写作芽芽](https://zhiyanren.github.io/writing-sprout/)（首次部署及线上操作已验证）。

## 数据与限制

作品仅存当前浏览器 localStorage，清理浏览器数据会丢失，请定期备份。隐私模式、存储配额或权限限制下会提示存储失败，并允许导出当前会话作品。备份导入按主题合并，已有作品优先，不覆盖已有文字。每个主题保留一篇可反复修改的作品。
参考片段为原创教学素材，不是教材或完整课程，不以截图中的宣传数量冒充资源数量。年级是建议难度，不限制自由探索。
验证范围及真实设备限制见 `docs/VERIFICATION.md`。
