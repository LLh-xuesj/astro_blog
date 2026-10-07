「宣纸为底，墨字为文。」

Xuan（宣）是一套中文博客主题，在 [Momo](https://github.com/Motues/Momo) 的极简骨架之上，换上自家的 [Typora 宣纸主题](https://github.com/LLh-xuesj/typora-theme-xuan) 的那身皮：纸底墨字、朱砂点眼、楷体作文、宋体作题。

## 🖌 换了什么

* **纸与墨**：`--paper #faf7f0` 纸、`--ink #2f2b26` 墨、`--accent #b23a2e` 朱砂、`--dai #3c5b6f` 黛青、`--gold #d6b24a` 藤黄。全站颜色都挂在这几个令牌上，改一处即全站生效
* **正文排版**：h1 居中带朱砂短横，h2 朱砂竖标，h3 纸色虚线，h4 黛青方点；引用块朱砂左标配向右淡出的渐变底，嵌套两层转黛青、三层转藤黄；表格、行内 code、提示块都按暖纸调过
* **字体**：正文霞鹜文楷，标题京华老宋体，西文 EB Garamond（`size-adjust: 115%` 把西文 x 高度抬到与汉字齐平）
* **代码块**：自写的 `xuan-paper` 主题，亮暗两套跟着站点深浅色开关走，语法色按暖纸重配
* **印章与纸纹**：站名旁一枚「宣」字印章，favicon 也是它；纸色之下铺了一层极淡的纸纹
* **阅读进度线**：页面顶端一条朱砂→藤黄细线，随滚动填充
* **夜墨配色**：宣纸主题原本没有暗色版，这里按同一套纸墨思路配了一版

## ✨ 特性

以下能力继承自 Momo，Xuan 全部保留：

* **极简设计**：页面设计简约，配色收敛在纸、墨、朱砂三者之间
* **深色模式**：支持手动切换或自动跟随系统
* **移动端适配**：组件针对移动端进行优化，拥有和电脑浏览器一样的流畅体验
* **图片体验**：点击图片打开灯箱；连续放置的多张图片自动拼成网格；文章内图片支持 LQIP 弥散渐变占位
* **丰富的 Markdown 语法**：KaTeX、Typst（构建期编译为 SVG）、Alert 提示块、GitHub / 网易云音乐卡片、引用组件、注音（Ruby）、折叠、彩虹文字、下划线、新标签页链接，Expressive Code 等
* **本地搜索**：使用 [pagefind](https://pagefind.app/) 实现本地化搜索，无需外部服务
* **国际化（i18n）**：支持多语言切换，目前支持简体中文、英文
* **评论功能**：支持本地部署和 Cloudflare 部署，具体参考 [Backend](https://github.com/Motues/Momo-Backend)
* **SEO**：canonical、hreflang 多语言对照、Open Graph / Twitter Card、结构化数据、`sitemap.xml` 与 `robots.txt`
* **本地 CMS 管理后台**：`pnpm cms` 启动，可视化编辑文章与实时预览（与博客共用同一条 Markdown 管线），无需手动改 Markdown
* **命令行工具**：`pnpm xuan`（旧名 `pnpm momo` 仍可用）提供配置备份/恢复、一键更新、新建文章、环境检查等能力
* **TypeScript**：站点源码与 `src/plugins/` 自定义插件链均使用 TypeScript 编写
* 其他基本功能：文章分类，目录，RSS订阅，字数统计，阅读时间

## 🚀 快速开始

> 环境要求：Node.js **>= 22**（推荐 24 LTS；本地 CMS 管理后台需要 **>= 22.18**），包管理使用 [pnpm](https://pnpm.io/zh/)

1. 克隆本项目
    ```bash
    git clone <你的仓库地址>
    cd xuan
    ```
2. 运行 `pnpm install` 安装依赖（使用 `npm install -g pnpm` 安装 `pnpm`）
3. 运行 `pnpm dev` 启动开发服务器

## ⚡ 指令

以下所有的指令可以在根目录下面执行

| 指令 | 作用 |
| --- | --- |
| `pnpm install` | 安装依赖 |
| `pnpm dev` | 启动本地服务器，运行在 `http://localhost:4321` |
| `pnpm build` | 构建发布版本到 `./dist` 目录下（含 pagefind 搜索索引） |
| `pnpm preview` | 预览构建后的发布版本 |
| `pnpm astro ...` | 运行 `astro` 命令，例如 `astro add` |
| `pnpm cms` | 启动本地 CMS 管理后台，运行在 `http://localhost:5188`（首次使用前先执行 `pnpm install`） |
| `pnpm xuan new [path]` | 新建文章，路径省略时按日期自动生成，例如 `pnpm xuan new docs/test` |
| `pnpm xuan backup` | 备份 `src/config.ts` 到 `.backup/`（加 `--config` 备份全部配置文件，加 `--all` 再连同文章内容与图片） |
| `pnpm xuan restore [名称]` | 从备份恢复（默认最近一次） |
| `pnpm xuan update` | 从 [GitHub Release](https://github.com/Motues/Momo/releases) 更新模板代码并同步依赖（保留自己的文章与图片；`--dry-run` 预览变更，`--no-delete` 只覆盖不删除） |
| `pnpm xuan clean` | 清理构建产物与缓存（加 `--all` 连同 `node_modules`） |
| `pnpm xuan doctor` | 检查环境、依赖与项目状态 |
| `pnpm xuan --help` | 查看全部命令与选项 |

## 📚 参考

* [Astro](https://astro.build/)
* [Momo](https://github.com/Motues/Momo)：Xuan 的上游模板，骨架、功能与配置体系都来自它
* [Typora Xuan 主题](https://github.com/LLh-xuesj/typora-theme-xuan)（自家仓库）：配色与排版的出处
* [Fuwari](https://github.com/saicaca/fuwari)
* [Tyndall](https://github.com/moyuin-aka/tyndall-public)
