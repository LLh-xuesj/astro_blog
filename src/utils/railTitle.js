/**
 * 首页卡片左侧那条竖排题签该刻什么字。
 *
 * 竖排里拉丁字母和数字会整体侧躺，型号前缀（「CSP-J-2023 T1-」）挂在题签上既难读又占地方，
 * 所以题签只刻「中文主词」：标题本来就是纯中文就用整条，否则取末尾那一段中文。
 * 作者不满意可以在 frontmatter 里写 railTitle 直接覆盖。
 *
 * 这里刻意写成纯 JS：卡片组件（src/components/PostCard.astro）与新建文章的脚手架
 * （script/momo/commands/new.js）共用同一套规则，改一处两边一起变。
 *
 * @param {string} title 文章标题
 * @param {string} [override] frontmatter 里的 railTitle
 * @returns {string} 题签要刻的字（最多 8 字，超了截断；完整标题会横排显示在右侧）
 */
export function railTitleFor(title, override) {
    const raw = (override?.trim() || extract(title)).trim()
    return raw.length > 8 ? raw.slice(0, 8) : raw
}

/** 取中文主词：纯中文整条返回，否则取末尾一段中文（连标点一起带走） */
function extract(title) {
    if (!/[A-Za-z0-9]/.test(title)) return title
    const tail = title.match(/[一-龥][一-龥，。、·！？：]*$/)
    return tail?.[0] ?? title
}
