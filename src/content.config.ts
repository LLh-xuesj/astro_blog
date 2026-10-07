import { defineCollection } from 'astro:content';
import { z } from 'astro/zod'; 
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        pubDate: z.coerce.date(),
        draft: z.boolean().optional().default(false),
        description: z.string().optional().default(''),
        image: z.string().optional().default(''),
        slugId: z.string(),
        category: z.string().optional(),
        // 标签：旧文迁过来时带着 tags。站点目前还没有标签页/按标签筛选的 UI，
        // 先原样存在 frontmatter 里不让它被 schema 丢掉，将来要做标签页时数据是齐的。
        tags: z.array(z.string()).optional().default([]),
        pinTop: z.number().optional().default(0),
    }),
})

const specCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/spec" }),
})

/* 碎碎念：没长成文章的短念头。一条一个 md 文件，pubDate + 可选 mood（心情标签）。
   站点目前只启用中文，碎碎念不做语言分文件——想恢复双语时再按 <name>/<lang>.md 组织 */
const murmursCollection = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: "./src/content/murmurs" }),
    schema: z.object({
        pubDate: z.coerce.date(),
        mood: z.string().optional(),
    }),
})
export const collections = {
    blog: blogCollection,
    spec: specCollection,
    murmurs: murmursCollection,
}