/**
 * /og/<文章id>.png —— 文章分享卡（构建期生成，零运行时）
 *
 * 没有封面图的文章用它当 og:image / twitter:image：一张宣纸风卡片——
 * 纸底、朱砂双界格、老宋体大标题、一方「宣」印、底部烙上站点域名。
 * 有封面图的文章仍走 coverShareImage 的照片路线（见 blog/[...id].astro）。
 *
 * 字体：仓库内附的京华老宋体子集（src/assets/fonts/，官方声明允许复制传播；
 * 子集覆盖常用汉字区，标题够用）。satori 只吃 TTF/WOFF，认不了 cn-font-split
 * 的 woff2 分片，所以这里单独带一份。
 */
import type { APIContext } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { i18n } from 'astro:config/client';
import { getBlogEntrySort } from '@utils/contentUtils';
import { cnYearMonth } from '@utils/cnText';

// 不用 new URL(import.meta.url)：Vite 会把它当资源重映射，预渲染时路径就断了。
// dev 和 Cloudflare 构建的 cwd 都是仓库根，直接按仓库根找最稳。
const FONT = readFileSync(join(process.cwd(), 'src/assets/fonts/KingHwaOldSong-og.ttf'));

// 与 blog/[...id].astro 完全同构的路径，保证 /og/<id>.png 和 /blog/<id> 一一对应
export async function getStaticPaths() {
    const locales = i18n?.locales || [i18n!.defaultLocale];
    const paths = [];
    for (const locale of locales) {
        const blogEntries = await getBlogEntrySort(locale);
        for (const entry of blogEntries) {
            paths.push({
                params: {
                    id: entry.id,
                    locale: locale === i18n!.defaultLocale ? undefined : locale,
                },
                props: { entry },
            });
        }
    }
    return paths;
}

export async function GET({ props }: APIContext) {
    const { entry } = props;
    const { title, category, pubDate } = entry.data;

    // 标题越长字号越收：一行放得下就大，两三行就收
    const titleSize = title.length <= 10 ? 76 : title.length <= 22 ? 58 : 46;
    const dateText = cnYearMonth(pubDate);

    // 版头一条：左「分类 · 汉字纪年」，右站名
    const metaRow = {
        type: 'div',
        props: {
            style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '23px',
                color: '#8a7f6f',
                letterSpacing: '6px',
            },
            children: [
                { type: 'span', props: { children: `${category || '未分类'} · ${dateText}` } },
                { type: 'span', props: { children: "xuesj'blog" } },
            ],
        },
    };

    // 标题：老宋体大字
    const titleBlock = {
        type: 'div',
        props: {
            style: {
                display: 'flex',
                maxWidth: '880px',
                fontSize: `${titleSize}px`,
                lineHeight: 1.32,
                color: '#2f2b26',
                letterSpacing: '3px',
                fontWeight: 400,
            },
            children: title,
        },
    };

    // 版脚：一道朱砂到藤黄的渐隐线 + 左域名右 motto
    const footRow = {
        type: 'div',
        props: {
            style: { display: 'flex', flexDirection: 'column', gap: '18px' },
            children: [
                {
                    type: 'div',
                    props: {
                        style: {
                            width: '100%',
                            height: '2px',
                            background: 'linear-gradient(90deg, rgba(178,58,46,0.75), rgba(214,178,74,0))',
                        },
                    },
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '21px',
                            color: '#8a7f6f',
                            letterSpacing: '3px',
                        },
                        children: [
                            { type: 'span', props: { children: 'blog.xuesj.top' } },
                            { type: 'span', props: { children: '纸墨为文 · Xuan' } },
                        ],
                    },
                },
            ],
        },
    };

    // 双线雕版框：外圈细界，内圈主界
    const frame = {
        type: 'div',
        props: {
            style: {
                flex: '1',
                display: 'flex',
                border: '1px solid rgba(178, 58, 46, 0.32)',
                padding: '6px',
            },
            children: {
                type: 'div',
                props: {
                    style: {
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        border: '2px solid rgba(178, 58, 46, 0.6)',
                        padding: '44px 56px',
                    },
                    children: [metaRow, titleBlock, footRow],
                },
            },
        },
    };

    // 「宣」印：右上，微歪
    const seal = {
        type: 'div',
        props: {
            style: {
                position: 'absolute',
                top: '196px',
                right: '96px',
                width: '98px',
                height: '98px',
                background: '#b23a2e',
                borderRadius: '10px',
                transform: 'rotate(-6deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(70, 50, 40, 0.25)',
            },
            children: {
                type: 'span',
                props: {
                    style: { color: '#f6f0e0', fontSize: '58px' },
                    children: '宣',
                },
            },
        },
    };

    const svg = await satori(
        {
            type: 'div',
            props: {
                style: {
                    width: '1200px',
                    height: '630px',
                    display: 'flex',
                    position: 'relative',
                    background: '#f6f0e0',
                    padding: '16px',
                },
                children: [frame, seal],
            },
        },
        {
            width: 1200,
            height: 630,
            fonts: [{ name: 'KingHwa', data: FONT, weight: 400, style: 'normal' }],
        }
    );

    const png = new Resvg(svg, { fitTo: { mode: 'width', num: 1200 } }).render().asPng();
    return new Response(png, {
        headers: { 'Content-Type': 'image/png' },
    });
}
