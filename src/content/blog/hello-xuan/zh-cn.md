---
title: 你好，宣
pubDate: 2026-10-06
description: Xuan 主题的第一篇文章：这套主题是什么、怎么写文章、常用语法速览
category: 随笔
image: ""
draft: false
slugId: xuan/hello
---

「宣纸为底，墨字为文。」

这是 [Xuan](https://github.com/Motues/Momo) 主题的第一篇文章。Xuan 在 Momo 的极简骨架之上，换上了 Typora 宣纸主题的那身皮——纸底墨字、朱砂点眼、楷体作文、宋体作题。你现在看到的排版，就是它本来的样子。

## 写一篇新文章

用命令行最省事：

```bash
pnpm xuan new my-first-post
```

文章是 `src/content/blog/` 下的 Markdown 文件，frontmatter 长这样：

```yaml
---
title: 文章标题
pubDate: 2026-10-06
description: 摘要，会显示在文章卡片和 SEO 里
category: 随笔
image: "./cover.jpg"   # 可选，文章封面
draft: false           # true 则不会发布
slugId: xuan/my-post   # 全站唯一标识，评论系统也靠它关联
---
```

## 常用语法速览

行内代码像这样：`pnpm dev`。**加粗**走真字面（西文 EB Garamond SemiBold、中文霞鹜文楷 Medium），*斜体*只对西文生效——中文没有斜体传统，主题禁掉了机器拉斜。

> 引用块是一道朱砂左标，底色向右淡出。
> 嵌套第二层转黛青，第三层转藤黄。
> > 必有回响。

:::note
提示块支持 note / tip / important / warning / caution 五种，各有各的颜色。
:::

:::important
important 的紫色取自中国色的「青莲」——李白号青莲居士。
:::

代码块由 Expressive Code 渲染，配的是主题自带的暖纸配色：

```js title="src/config.ts"
export const siteConfig = {
    title: "xuesj'blog",
    subTitle: "Xuan 主题",
}
```

| 元素 | 效果 |
| --- | --- |
| 表格 | 纸色描边、藤黄表头 |
| [链接](https://astro.build) | 黛青字、悬停转朱砂 |
| ==高亮== | 藤黄底 |
| ~~删除线~~ | 墨色划过 |

任务清单的勾选框也是自绘的：

- [x] 换上宣纸配色
- [x] 盖上「宣」字印章
- [ ] 写第一篇真正的文章

## 接下来

把 `src/config.ts` 里的站点地址和头像换成自己的，然后删掉这篇文章，开始写吧。

主题对脚注也做了悬浮预览——把鼠标停在这条引用上试试[^1]。

[^1]: 鼠标悬停在正文里的 [1] 上，注释会像这样浮出来，不用跳到页尾。
