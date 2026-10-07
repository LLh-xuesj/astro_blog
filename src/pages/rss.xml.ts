import rss from "@astrojs/rss";
import { marked } from "marked";
import { getBlogEntrySort } from "../utils/contentUtils"
import { i18nConfig, profileConfig, siteConfig } from '../config';
import { getSiteTitle } from "../utils/siteTitle";
import type { APIContext } from "astro";

/**
 * 把正文 Markdown 转成 HTML 供 RSS 全文输出。
 * 订阅器抓不到相对地址的图：站内绝对路径（/ 开头）补全成绝对 URL；
 * 文章文件夹内的相对路径图（./xxx.jpg）因每篇基址不同，这里不处理——
 * 想让 RSS 里图片完整的话，写作时用 / 开头的公开路径或图床外链。
 */
function absolutize(html: string, base: string) {
    return html
        .replaceAll('src="/', `src="${base}/`)
        .replaceAll('href="/', `href="${base}/`);
}

export async function GET(context: APIContext) {
    const blog = await getBlogEntrySort();
    const base = (context.site ?? new URL(siteConfig.rootSiteUrl)).origin;

    // 全文输出：正文是作者本人的 Markdown（可信内容），marked 转 HTML 后进 CDATA
    const items = await Promise.all(
        blog.slice(0, 20).map(async (post) => {
            const html = absolutize(await marked.parse(post.body ?? ""), base);
            return {
                title: post.data.title,
                pubDate: post.data.pubDate,
                description: post.data.description,
                categories: post.data.category ? [post.data.category] : undefined,
                // 从 `id` 属性计算出 RSS 链接
                // 这个例子假设所有的文章都被渲染为 `/blog/[id]` 路由
                link: `/blog/${post.id}/`,
                // 全文：@astrojs/rss 会把 customData 整体 XML 转义输出，
                // content:encoded 里是「转义 HTML」——各大订阅器的标准兼容形态
                customData: `<content:encoded>${html}</content:encoded>`,
            };
        })
    );

    return rss({
        title: getSiteTitle(),
        description: profileConfig.description,
        site: context.site ?? "https://blog.xuesj.top",
        // 订阅源只包含默认语言的文章，显式声明语言便于阅读器正确处理
        customData: `<language>${i18nConfig.defaultLanguage}</language>`,
        // content:encoded 的命名空间声明
        xmlns: { content: "http://purl.org/rss/1.0/modules/content/" },
        items,
    })
}
