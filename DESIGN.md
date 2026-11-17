# 写作芽芽 · 设计约定

## 意图与边界
面向小学一至三年级，iPad 家庭自主练习；简体中文。截图仅作为功能和亲切卡片方向参考，不复制直播画面、品牌或未授权课程。用户已接受由开发者默认推进；纯静态、本机存储、无 AI 批改。

## 方案与视觉选择
采用原生 ES modules + CSS + 本机存储，运行无依赖，方便 Pages 与离线。React 对此规模增加构建负担；服务端方案不符合工作区约束。
设计查询的 Claymorphism 儿童教育风格适用，营销首页与英文字体结果不适用；重试后仍为营销结构，因此结构按工作区 App 规范自行设计。采用浅蓝纸面、墨色文字、薄荷绿与杏橙点缀，以原创“发芽的铅笔”和插画学习卡为记忆点。宽屏固定侧栏、学习工作台；窄屏底部导航。避免堆砌徽章、伪造学习数据与无限动效。

## 令牌来源与映射
public/styles.css 的 :root 为唯一运行令牌来源（Model B），本文镜像主令牌，变更须同时维护；组件统一消费变量。
- --ink #26364a：标题与正文；--muted #5e6e82：辅助文字。
- --brand #237a66：主要操作；--paper #f4f7fc：背景；--surface #ffffff：卡片。
- --peach #ffead5：写话；--sky #e1edff：体裁；--lavender #eeebff：技巧；--mint #e1f2e9：进展。
- --line #dce4ee；--danger #a32d3e；--focus #324fc1。
- 正文系统中文 sans（PingFang SC / Microsoft YaHei）16px/1.65；标题优先圆润系统字 28–34px/1.35；编辑正文使用系统中文 serif（Songti SC / Noto Serif CJK SC），20px/2.2。无远程字体依赖。
- 卡片 24px、控件 14px 圆角，间距 8/12/16/24/32px；触控目标至少 44px。
- 页面 220ms 入场、按钮 150ms 按压、完成 1.8s 单次奖励反馈；只用 transform/opacity，不做循环；减少动态效果全部停用。
- 全局滚动条：thumb --scroll-thumb #a4b3c5，hover #72879f，active --ink，track transparent；forced-colors 用系统默认。

## 品牌与插画
public/assets/logo.svg：原创发芽铅笔，导航/应用岛使用；同图输出 icon-180.png（Apple）、icon-192.png 与 icon-512.png（Manifest）及 favicon.svg。安全留白约 15%，不含文字。
每个场景独立 SVG（park/rain/seed/cat/kite/moon/picnic/snow.svg），原创向量插画，不依赖远程图片。场景图提供描述；重复装饰与图标 aria-hidden。

## 页面与行为
学习首页保留截图中的分类逻辑，不使用宣传首屏。20 个主题均有独立内容，年级选择对应建议难度。详情左引导右写作；手机上下排列。步骤不强制锁定、参考折叠避免代写，保存不离开编辑区。作品本显示真实草稿/完成数。
行为、状态、焦点和恢复详见 UX-CONTRACT.md。验证记录在 docs/VERIFICATION.md，模拟不宣称真机。
