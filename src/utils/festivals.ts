/**
 * 传统节日：判断节日 + 给出当天的粒子配置与界面挂件。
 *
 * 农历用浏览器/Node 内置的 ICU 中国日历（Intl 的 `zh-CN-u-ca-chinese`）推，
 * 不硬编码公历日期 —— 农历年年在动，查表等于每年都要改代码。
 * 闰月会带「闰」字前缀（如 `闰6-1`），闰月不过节，直接跳过。
 */

/** 动效原型。与 @components/Motes.astro 的绘制分支一一对应 */
export type FestArch =
    | 'dust'
    | 'rain'
    | 'petal'
    | 'snow'
    | 'firefly'
    | 'leaf'
    | 'dew'
    | 'insect'
    | 'wheat'
    | 'festival'

export interface FestivalCard {
    name: string
    /** 题签上的字，两个字最整齐 */
    tag: string
    /** 灯笼上的字（单字），不写就用 tag 的首字 */
    glyph?: string
    /** 挂件主色（题签描边、灯笼穗子） */
    accent: string
    arch: FestArch
    light: [string, string]
    dark: [string, string]
    density: number
    speed: number
    /** 界面挂件：灯笼挂在两侧，还是题签挂在右上 */
    ornament: 'lantern' | 'tag'
}

const SPRING: FestivalCard = {
    name: '春节',
    tag: '新春',
    glyph: '福', // 灯笼上写「福」比写「新」更像那么回事
    accent: '#b23a2e',
    arch: 'festival',
    light: ['#e0b400', '#b23a2e'],
    dark: ['#ffd54f', '#e05a48'],
    density: 1,
    speed: 1.1,
    ornament: 'lantern',
}

const YUANXIAO: FestivalCard = {
    name: '元宵',
    tag: '元宵',
    glyph: '福',
    accent: '#b23a2e',
    arch: 'festival',
    light: ['#e8b923', '#d9534f'],
    dark: ['#ffd54f', '#e86a58'],
    density: 1.05,
    speed: 1,
    ornament: 'lantern',
}

const DUANWU: FestivalCard = {
    name: '端午',
    tag: '端午',
    accent: '#4f6b33', // 艾绿
    arch: 'leaf', // 艾叶
    light: ['#4f6b33', '#3b5226'],
    dark: ['#9dbf76', '#7ba85f'],
    density: 0.8,
    speed: 0.7,
    ornament: 'tag',
}

const QIXI: FestivalCard = {
    name: '七夕',
    tag: '七夕',
    accent: '#5f7d9c', // 星蓝
    arch: 'firefly', // 鹊桥的星
    light: ['#5f7d9c', '#c7b06a'],
    dark: ['#a8c8e0', '#ffd54f'],
    density: 1,
    speed: 0.5,
    ornament: 'tag',
}

const ZHONGQIU: FestivalCard = {
    name: '中秋',
    tag: '中秋',
    accent: '#b99a3d', // 藤黄
    arch: 'petal', // 桂花
    light: ['#b99a3d', '#c0857a'],
    dark: ['#e8c96a', '#e8b0a0'],
    density: 0.9,
    speed: 0.8,
    ornament: 'tag',
}

const CHONGYANG: FestivalCard = {
    name: '重阳',
    tag: '重阳',
    accent: '#a8621c', // 赭
    arch: 'leaf', // 菊瓣
    light: ['#c8912f', '#a8621c'],
    dark: ['#e3b45a', '#d1863f'],
    density: 0.7,
    speed: 0.8,
    ornament: 'tag',
}

/** 供 `?term=` 预览与节日判断共用 */
export const FESTIVAL_CARDS: Record<string, FestivalCard> = {
    春节: SPRING,
    新春: SPRING, // 「新春」是它的旧称呼，两个都收
    元宵: YUANXIAO,
    端午: DUANWU,
    七夕: QIXI,
    中秋: ZHONGQIU,
    重阳: CHONGYANG,
}

export function getFestivalCard(name: string): FestivalCard | null {
    return FESTIVAL_CARDS[name] ?? null
}

interface Lunar {
    month: number
    day: number
    leap: boolean
}

let fmt: Intl.DateTimeFormat | null = null

function lunarOf(date: Date): Lunar | null {
    try {
        fmt ??= new Intl.DateTimeFormat('zh-CN-u-ca-chinese', { month: 'numeric', day: 'numeric' })
        const parts = fmt.formatToParts(date)
        const rawMonth = parts.find((p) => p.type === 'month')?.value ?? ''
        const rawDay = parts.find((p) => p.type === 'day')?.value ?? ''
        const month = parseInt(rawMonth.replace(/\D/g, ''), 10)
        const day = parseInt(rawDay.replace(/\D/g, ''), 10)
        if (!month || !day) return null
        return { month, day, leap: rawMonth.includes('闰') }
    } catch {
        // 老浏览器没有中国日历数据：安静降级成「今天没有节日」
        return null
    }
}

/** 今天是什么传统节日；不是节日返回 null */
export function getFestival(date: Date): FestivalCard | null {
    const l = lunarOf(date)
    if (!l || l.leap) return null

    // 正月：初一~十四算春节（十五让给元宵）
    if (l.month === 1 && l.day >= 1 && l.day <= 15) return l.day === 15 ? YUANXIAO : SPRING
    // 腊月廿九起就进入年：除夕可能是廿九也可能是三十，卡不准也无妨——年味早一天不算错
    if (l.month === 12 && l.day >= 29) return SPRING

    if (l.month === 5 && l.day === 5) return DUANWU
    if (l.month === 7 && l.day === 7) return QIXI
    if (l.month === 8 && l.day === 15) return ZHONGQIU
    if (l.month === 9 && l.day === 9) return CHONGYANG
    return null
}

/** 今天的农历，给页脚/调试用：如「八月廿六」 */
export function lunarLabel(date: Date): string | null {
    const l = lunarOf(date)
    if (!l) return null
    const m = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'][l.month - 1] ?? ''
    const d = ['初', '十', '廿', '三'][Math.floor((l.day - 1) / 10)] + ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][(l.day - 1) % 10]
    return `${l.leap ? '闰' : ''}${m}月${l.day === 20 ? '二十' : d}`
}
