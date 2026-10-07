import type {
    SiteConfig,
    ProfileConfig,
    LicenseConfig,
} from "./types/config"
import type { FriendLink } from "./types/friend"
import type { I18nConfig } from "./types/i18n"

export const siteConfig: SiteConfig = {
    title: "xuesj'blog", // Title of the site, used in the tab in the browser and in SEO
    subTitle: "Xuan 主题", // Subtitle of the site
    rootSiteUrl: "https://blog.xuesj.top", // ⚠️ 必须改成你的真实站点根地址（GitHub Pages 项目页是 https://<用户名>.github.io/<仓库名>，绑了自定义域名就填域名）。canonical / hreflang / sitemap / og:url 全靠它

    favicon: "/favicon/favicon.ico", // Path of the favicon, relative to the /public directory

    pageSize: 6, // Number of posts per page
    toc: {
        enable: true,
        depth: 3 // Max depth of the table of contents, between 1 and 4
    },
    blogNavi: {
        enable: true // Whether to enable blog navigation in the blog footer
    },
    comments: {
        enable: true, // 后端：Twikoo 云函数（Vercel + MongoDB Atlas），部署说明见 https://twikoo.js.org/backend.html
        platform: "twikoo", // Comment platform, set "default" to use Momo-backend, also supports "twikoo"
        backendUrl: "https://twikoo.xuesj.top"
    },
    theme: {
        AOS: true, // Whether to enable AOS (Animate On Scroll) for animations
        LQIP: true, // Whether to enable LQIP (Low-Quality Image Placeholder) for image placeholders
        PhotoSwipe: true, // Whether to enable PhotoSwipe for image viewer
        imageCollage: {
            enable: true, // Whether to automatically arrange consecutive images into a grid (collage)
            maxColumns: 4 // Max images per row in a collage (2 - 6); the actual number is chosen automatically
        },
        postCard: {
            imageMode: "top" // Cover image mode for article cards: "top" shows the image above the content; "background" uses the image as the card background, fading to transparent from right to left
        },
        photoCover: {
            enable: false, // Whether to use a full-screen photo as the background of the home page; the title and subtitle are centered, and everything smoothly returns to the normal style as you scroll down
            image: "/cover.jpg", // ⚠️ 原模板的示例图已清理。开启本功能前，先把你的照片放进 public/ 并改成对应文件名，否则构建会因找不到图片而失败
            mask: 0.5 // Opacity (0 - 1) of the black mask over the photo, fading away as you scroll down
        },
        overlayScrollbars: {
            enable: true, // Whether to replace the browser's default scrollbar with OverlayScrollbars (overlay style, can auto-hide)
            autoHide: "leave", // When to hide the scrollbar: "never" always visible; "scroll" hidden unless scrolling; "move" hidden unless the pointer moves over the page or the user scrolls; "leave" hidden when the pointer leaves the page or the user isn't scrolling
            size: 8 // Scrollbar thickness in pixels
        }
    },
    expressiveCode: {
        enable: true, // Whether to enable Expressive Code for code blocks; when false, code blocks fall back to plain text without highlighting (same in the CMS preview)
        theme: "xuan-paper" // Shiki theme of code blocks. "xuan-paper" is the built-in paper/ink theme defined in ec.config.mjs (light + dark variants); you can also use any Shiki theme name, e.g. "one-dark-pro", "github-dark", "vitesse-dark" (those are single-theme, used for both light and dark mode)
    }
}

export const profileConfig: ProfileConfig = {
    avatar: "/favicon/xuan-seal-180.png", // 头像：目前先用主题的印章图标顶着，换成你自己的图片后改这里（放 src/assets/ 写相对路径，或放 public/ 写 /开头的路径）
    name: "xuesj", // Used in the footer of the blog
    description: "xuesj 的个人博客——把日子写在纸上：读过的书、走过的路、想过的事", // Used in SEO
    indexPage: "https://xuesj.top", // 个人主页（区别于博客域名 blog.xuesj.top），页脚署名与 SEO 用
    startYear: 2026, // The year the site was created, used in the footer
}

export const licenseConfig: LicenseConfig = {
	enable: true, // Whether to enable license information
	name: "CC BY-NC-SA 4.0", // License name
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/", // License URL
};

export const i18nConfig: I18nConfig = {
    defaultLanguage: "zh-cn", // Default language of the site
    supportedLanguages: ["zh-cn"], // 只启用中文：语言切换按钮隐藏、不生成 /en/ 镜像页、hreflang 也不再输出英文项。想恢复双语改回 ["zh-cn", "en"] 并补上各文章的 en.md 即可（translations 里的英文文案保留着）
    translations: { // Translation content for each supported language
        "zh-cn": {
            Cover: {
                title: {
                    home: "把日子写在纸上",
                    archive: "文章归档",
                    murmurs: "碎碎念",
                    about: "关于",
                    friends: "友链",
                },
                subTitle: {
                    home: "读过的书，走过的路，想过的事",
                    archive: "共 {count} 篇文章", // {count} will be replaced with the total number of articles
                    murmurs: "一些没长成文章的念头",
                    about: "以宣纸为底，以墨为字",
                    friends: "有趣的灵魂"
                }
            }
        },
        "en": {
            Cover: {
                title: {
                    home: "Days written on paper",
                    archive: "Archive",
                    murmurs: "Murmurs",
                    about: "About",
                    friends: "Friends",
                },
                subTitle: {
                    home: "Books read, roads taken, thoughts had",
                    archive: "Total of {count} articles",
                    murmurs: "Thoughts too small for a post",
                    about: "Paper as the ground, ink as the letters",
                    friends: "Interesting Souls",
                }
            }
        }
    }
};

export const friendLinkConfig: FriendLink[] = [
    {
        name: 'Motues', // Name of the friend link
        avatar: 'https://www.motues.top/avatar.jpg', // Avatar image of the friend link
        url: 'https://www.motues.top', // URL of the friend link
        description: 'Like River!' // Description of the friend link, set to an empty string if not needed
    },
    {
        name: 'Astro',
        avatar: 'https://avatars.githubusercontent.com/u/44914786',
        url: 'https://astro.build',
        description: 'Build fast websites, faster.'
    }
    // Add more friend links here
]