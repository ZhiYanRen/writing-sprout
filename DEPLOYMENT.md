# GitHub Pages 发布

唯一仓库 https://github.com/ZhiYanRen/writing-sprout ，public、main。
Pages 来源：GitHub Actions，构建 `npm ci && npm test && npm run build`；产物 dist/。PR 只构建验证，main push/workflow_dispatch 部署本仓库。权限 contents:read / pages:write / id-token:write，无跨仓库密钥。

2026-11-17 通过官方仓库及 GitHub Releases API 核查 Actions 版本：checkout v7、setup-node v7、configure-pages v6、upload-pages-artifact v5、deploy-pages v5。Node 22 仅供本地与 CI。
参考：[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)、[configure-pages](https://github.com/actions/configure-pages)、[upload-pages-artifact](https://github.com/actions/upload-pages-artifact)、[deploy-pages](https://github.com/actions/deploy-pages)。

资源使用相对路径，hash 路由支持直接打开和刷新；本地预览也在 /writing-sprout/ 子路径。Service Worker 缓存清单仅静态应用资源，构建内容哈希更新命名空间，启用新版本后只清理本项目旧缓存，不碰作品 localStorage。资源更新不能改变存储 schema，若需改变先设计迁移。

SVG 是可维护的品牌/插画源；PNG 图标通过 `node scripts/generate-icons.mjs` 从 logo.svg 渲染，输出纳入版本管理，favicon.svg 与 logo.svg 保持同源。发布品牌变化时同步应用岛资源。
