# Xuan · 宣

<div align="center">
    <p>一套「宣纸为底、墨字为文」的中文博客主题，基于 <a href="https://github.com/Motues/Momo">Momo</a>，使用 <a href="https://astro.build/">Astro</a> 搭建</p>
</div>

## 🖌 Xuan 是什么

Xuan（宣）把 [Momo](https://github.com/Motues/Momo) 的极简骨架保留下来，换上自家的 [Typora 宣纸主题](https://github.com/LLh-xuesj/typora-theme-xuan) 的那身皮：纸底墨字、朱砂点眼、楷体作文、宋体作题。功能一个没少，观感全换了。

改动都收在样式与主题配置里，想回退随时改：

| 位置 | Xuan 的做法 |
| --- | --- |
| `src/styles/variables.css` | 纸墨令牌：`--paper #faf7f0` 纸、`--ink #2f2b26` 墨、`--accent #b23a2e` 朱砂、`--dai #3c5b6f` 黛青、`--gold #d6b24a` 藤黄。Momo 原有的变量名全部映射到这套令牌上，所以组件不用动 |
| `src/styles/markdown.css` | 标题（h1 居中带朱砂短横、h2 朱砂竖标、h3 纸色虚线、h4 黛青方点）、黛青链接、朱砂左标引用块（嵌套转黛青、藤黄）、暖纸表格、行内 code、提示块、自绘勾选框的任务清单 |
| `src/styles/fonts.css` + `public/fonts/` | 西文 EB Garamond，`size-adjust: 115%` 把 x 高度抬到与汉字齐平；四个 woff2 可整组替换 |
| `src/layouts/Layout.astro` | 中文按需异步加载（霞鹜文楷 Regular/Medium、京华老宋体），`theme-color` 跟着纸色走 |
| `ec.config.mjs` | 代码块用自写的 `xuan-paper` 主题（亮 + 暗两套，绑在站点 `data-theme` 上） |

### 在 Momo 之上自己加的

* **宣字印章**：`src/components/Seal.astro`，站名旁与页脚版权前各盖一枚，整页加载时有「盖章」动效；favicon 也是它（`node script/gen-seal.mjs` 可换字重生成）
* **墨滴换肤**：切换深浅色时，新配色从点击处像墨滴一样在纸上晕开（View Transitions API，旧浏览器自动退化为普通切换）
* **文末落款**：每篇文章末尾右下角一列竖排「署名 · 谨识 · 汉字纪年」，滚到眼前时印章才「盖」下去（`src/components/SignOff.astro`）
* **书脊题名**：文章页左缘竖排一列当前文章标题，如古籍书脊（宽屏 ≥1280px 显示，纯装饰）
* **远山**：页面底缘两层剪影山脊（`--xuan-hills`，明暗各一版），浓到近看不见、关掉又觉得少点什么
* **节气动效**：背景的一层粒子随二十四节气换面孔——立春的新禾绿浮尘、雨水的斜织雨丝、春分的落花、夏至的萤火、白露的凝露、霜降的红叶、大雪的暮雪……十种原型、二十四张配置卡，外加除夕到正月十五的「新春」特例（赤金尘 + 朱砂点）。落花落叶走两段不同频率的横摆叠加、下落速度随摆动起伏、绕自身长轴翻面，飘得不规则。全程序绘制零图片，颜色取自中国色（zhongguose.com）色库，明暗两套配色，跨节气自动切换；速度一律按 px/s 写（`k = dt / 1000`），帧率高低不影响观感（`src/components/Motes.astro`，离屏 sprite + rAF，页面切后台即暂停，`prefers-reduced-motion` 不启动）。想看某个节气：URL 后面加 `?term=大雪`（也接受 `?term=新春`）
* **纸页卡片**：首页文章卡不是「圆角白卡」——直角纸面、右下一枚折角（clip-path 真切口）、无封面卡左侧一条竖排老宋体题签代替大标题，悬停时签脚盖一枚小「宣」印（`src/components/PostCard.astro`）
* **书口导航**：顶部不是悬浮胶囊，而是贴着页缘的全宽纸带——吸顶后显形，底边一道贯穿的墨线，当前页由一枚会滑行的朱砂圆点指示（`src/components/Header.astro`）
* **雕版界栏**：文章正文外围一圈双线界格，像雕版书的版心（`markdown.css` 的 `.xuan-banxin`，仅文章页启用）
* **名帖友链**：友链卡是「拜帖」式——左条竖排老宋体名字 + 一方悬停才盖上的小印（`src/pages/[...locale]/friends.astro`）
* **陈年纸色**：纸色比初始版再旧一档（`--paper #f6f0e0` 系），纸纹、光晕、远山同步加浓
* **节日挂件**：传统节日在页面两侧挂东西——春节、元宵挂一对会摆的朱砂灯笼（灯上是「福」字），端午、七夕、中秋、重阳在右上角挂一枚竖排老宋体题签，边框与印点取该节日的中国色（艾绿、星蓝、藤黄、赭石）。节日判定不查表，走 ICU 农历（`src/utils/festivals.ts`，闰月自动排除），1280px 以上才出现（`src/components/Festival.astro`）；`?term=中秋` 可预览
* **雕版界栏**：文章正文是一页摊在案上的雕版书——朱笔手绘界格（四边微起伏、四角出锋）、版心鱼尾夹着分类与汉字纪年、左下一道飞白笔痕、上缘一对镇纸、右界半枚骑缝章（装饰由文章页注入 `ornament` 插槽，样式见 `markdown.css`）
* **目录纸签**：右侧目录是一叠夹在书里的纸签，读到哪节哪支凸出、行首墨点变朱砂（`src/components/TOC.svelte`）
* **卷尾同观**：落款之后按同分类推荐几篇「同观」，没有同类就退回最近更新，与卷前卷后（时间轴前后篇）互补（`src/components/RelatedPosts.astro`）
* **OG 分享卡**：没有封面图的文章构建期自动生成宣纸风分享卡——双线界格、老宋体标题、「宣」印、烙上站点域名（satori + resvg，字体用仓库附带的京华老宋体子集，端点 `src/pages/og/[...id].png.ts`）
* **碎碎念**：原生的「说说」页面（`/murmurs/`，导航第五个标签）——`src/content/murmurs/` 下一事一文件（frontmatter 只要 `pubDate`，可选 `mood` 心情标签），墨点卷轴时间线按汉字纪年铺开，无任何后端。上游 Momo 的同类功能在 `memos` 分支，需要自托管 Memos 服务才能用
* **今日一句**：首页封面文案下按日期轮换一句公版古语；首页以**打字机**逐字写出（笔尖是一枚朱砂竖笔），不请求任何外部服务
* **搜索快捷键**：`/` 或 `Ctrl/⌘ + K` 呼出搜索
* **脚注悬浮预览**：鼠标停在文中的脚注引用上，注释像纸签一样浮出来（滚动即收，触屏仍走跳转）
* **复制本文链接**：文章 meta 区一枚小按钮，点了抄永久地址
* **节气签**：页脚按寿星公式推算当前节气，并跟着写一句该节气的意象（「今日 · 秋分 雷始收声」）——意象多取七十二候首候，生僻的换成同源的好读说法（「腐草为萤」「鸿雁南来」「一阳来复」），零依赖（`src/utils/solarTerms.ts`）
* **404 水墨页**：老宋体 404 + 右肩「虚无之境」竖印
* **打印样式**：`@media print` 白纸黑字排版，屏幕层全部退场
* **RSS 全文**：`/rss.xml` 输出正文全文（content:encoded）
* **阅读进度线**：页面顶端一条 2px 朱砂→藤黄细线，随滚动填充
* **纸纹**：纸色之下铺一层极淡的 SVG 噪点，凑近能看出纤维
* **夜墨配色**：宣纸主题原本没有暗色版，这里按同一套纸墨思路配了一版
* **字数单位**：「3351 字」改作「3351 言」
* **细处动效**：封面文案三连渐入；正文链接悬停时墨线轻挑（下划线上浮）；文章卡片悬停微抬换长影；客户端换页的淡出曲线放缓一拍

## ✨ 特性

以下能力来自 Momo，Xuan 全部保留：

* **极简设计**：版式简约，配色收敛在纸、墨、朱砂三者之间
* **深色模式**：支持手动切换或自动跟随系统（夜墨配色）
* **照片封面**：首页第 1 页可用一整屏照片做封面，标题与副标题居中放大、叠一层可调的黑色蒙版；向下滚动时标题平滑落回原位、照片淡成整页底色，其余页面也会铺一层很淡的照片
* **客户端换页**：站内跳转由 [swup](https://swup.js.org/) 接管，不再整页刷新，带悬停预取、淡入淡出与「前进 / 后退回到原位置」
* **移动端适配**：组件针对移动端进行优化，拥有和电脑浏览器一样的流畅体验
* **图片体验**：点击图片打开灯箱；连续放置的多张图片自动拼成网格；文章内图片支持 LQIP 弥散渐变占位
* **丰富的 Markdown 语法**：KaTeX、Typst（构建期编译为 SVG）、Alert 提示块、GitHub / 网易云音乐卡片、引用组件、注音（Ruby）、折叠、彩虹文字、下划线、新标签页链接，Expressive Code 等
* **本地搜索**：使用 [pagefind](https://pagefind.app/) 实现本地化搜索，无需外部服务
* **国际化（i18n）**：支持多语言切换，目前支持简体中文、英文
* **评论功能**：支持本地部署和 Cloudflare 部署，具体参考 [Backend](https://github.com/Motues/Momo-Backend)
* **SEO**：canonical、hreflang 多语言对照、Open Graph / Twitter Card、结构化数据、`sitemap.xml` 与 `robots.txt`
* **本地 CMS 管理后台**：`pnpm cms` 启动，可视化编辑文章与实时预览（与博客共用同一条 Markdown 管线），无需手动改 Markdown
* **命令行工具**：`pnpm xuan`（旧名 `pnpm momo` 仍可用）提供配置备份/恢复、新建文章、环境检查、构建产物体检等能力
* 其他基本功能：文章分类，目录，RSS订阅，字数统计，阅读时间

## 🚀 快速开始

> 环境要求：Node.js **>= 22**（推荐 24 LTS；本地 CMS 管理后台需要 **>= 22.18**），包管理使用 [pnpm](https://pnpm.io/zh/)

1. 克隆本项目
    ```bash
    git clone <你的仓库地址>
    cd xuan
    ```
2. 运行 `pnpm install` 安装依赖（使用 `pnpm install -g pnpm` 安装 `pnpm`）
3. 运行 `pnpm dev` 启动开发服务器

## 🔧 配置

站点信息、主题开关、多语言与首页 Cover 文案统一在 `src/config.ts` 中配置，每项都有注释说明；`astro.config.mjs` 的 `site` 与 `i18n` 会自动读取该文件的配置。更详细的逐项讲解见上游的 [配置文档](https://momo.motues.top/intro/config)。

## 📚 更新

Xuan 是独立的主题 fork，**没有**接 Momo 上游的 `update` 命令（那会用上游代码覆盖你的定制，相关文件已删除）。想同步上游改动时，用 git 对比 [Momo 仓库](https://github.com/Motues/Momo) 手动合并即可。

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
| `pnpm xuan clean` | 清理构建产物与缓存（加 `--all` 连同 `node_modules`） |
| `pnpm xuan doctor` | 检查环境、依赖与项目状态 |
| `pnpm xuan --help` | 查看全部命令与选项 |

## 📁 目录结构

```
├── public/               原样输出的静态资源（favicon、西文字体）
├── script/
│   ├── gen-seal.mjs      「宣」字印章 favicon 生成器（node script/gen-seal.mjs）
│   └── momo/             本地 CLI（pnpm xuan）：备份/恢复、新建文章、清理、体检
├── cms/                  本地 CMS 管理后台（pnpm cms），可视化编辑文章
├── src/
│   ├── assets/           文章与头像用的图片（走 Astro 图片管线）
│   ├── components/       界面组件（页眉、页脚、封面、卡片、评论、目录…）
│   ├── config.ts         ★ 全站配置：站名、作者、主题开关、文案都在这里
│   ├── content/
│   │   ├── blog/         文章（Markdown，一个文件夹一篇，含多语言版本）
│   │   ├── murmurs/      碎碎念（一事一文件：pubDate + mood + 正文）
│   │   └── spec/         独立页面内容（关于页等）
│   ├── layouts/          页面骨架（Layout 是全站入口，管字体加载与 SEO）
│   ├── pages/           路由：首页、归档、文章页、友链、404、RSS/sitemap
│   ├── plugins/          Markdown 渲染管线（提示块、卡片、拼图、LQIP…）
│   ├── styles/           ★ 主题样式：variables.css 是配色令牌总源
│   └── utils/ i18n/ types/  工具函数、多语言、类型定义
├── astro.config.mjs      Astro 配置（站点地址、Markdown 管线、集成）
├── ec.config.mjs         代码块主题（xuan-paper，亮暗两套）
└── pagefind.yml          本地搜索配置
```

## 📚 参考

* [Astro](https://astro.build/)
* [Momo](https://github.com/Motues/Momo)：Xuan 的上游模板，骨架、功能与配置体系都来自它
* [Typora Xuan 主题](https://github.com/LLh-xuesj/typora-theme-xuan)（自家仓库）：配色与排版的出处
* [Fuwari](https://github.com/saicaca/fuwari)
* [Tyndall](https://github.com/moyuin-aka/tyndall-public)

## 📄 许可

本项目沿用 Momo 的 MIT 许可，见 [LICENSE](./LICENSE)。字体各自遵循其原授权：

* 霞鹜文楷：SIL OFL-1.1
* EB Garamond：SIL OFL-1.1
* 京华老宋体：**非开源字体**，免费商用。官方版权声明原文（2026-10 由作者方提供）：

  > ① 本字体免费商用*，可随意用于各类平面、包装、宣传、影视、网页等美术设计中，也可以嵌入电子产品、软件应用之中。
  >
  > ② 本字体可随意复制传播，但不许以任何形式单独或打包作为素材、字体文件出售与盈利。
  >
  > ③ 本字体非开源字体，请勿随意修改本字体文件，更不许传播修改版文件。
  >
  > ④ 切不可将本字体用于违法犯罪活动。
  >
  > \* 本字体已经上传小米手机字体商城售卖，此为唯一收费渠道，除此之外其他渠道下载、使用都是免费的（甚至您不通过官方渠道自行将字体刷入手机也是可以的）。若在其他渠道看到有人贩售本字体，请勿上当。

  本站的用法（网页嵌入、经中文网字计划的分片文件随源码分发、不单独收费、不修改字体文件）落在 ①② 允许的范围之内。另：`src/assets/fonts/` 附有该字体的子集 TTF（约 18MB，覆盖常用汉字区），供构建期生成分享卡使用——子集属声明第 ② 条允许的复制传播，未作任何修改字形层面的改动。
