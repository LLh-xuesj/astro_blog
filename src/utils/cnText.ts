/**
 * 中式文本工具：汉字数字、古称阅读时长、十二时辰。
 * 只服务中文界面（本站 supportedLanguages 只有 zh-cn），不做多语言。
 */

const DIGITS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
const UNITS = ['', '十', '百', '千']
const BIG_UNITS = ['', '万', '亿']

/** 万以下四位数的汉字读法（内部用） */
const fourDigits = (n: number): string => {
    let s = ''
    let pendingZero = false
    for (let u = 3; u >= 0; u--) {
        const d = Math.floor(n / 10 ** u) % 10
        if (d === 0) {
            if (s) pendingZero = true
            continue
        }
        if (pendingZero) {
            s += '零'
            pendingZero = false
        }
        s += DIGITS[d] + UNITS[u]
    }
    // 「一十」在开头像书面语，口语里「十五」比「一十五」顺
    return s.startsWith('一十') ? s.slice(1) : s
}

/** 阿拉伯数字 → 汉字。0 到 9999 万都在安全范围，博客字数用绰绰有余 */
export function cnNumber(n: number): string {
    n = Math.round(n)
    if (n === 0) return '零'
    if (n < 0) return '负' + cnNumber(-n)
    if (n >= 10 ** 8 * 10) return String(n) // 超出亿×10 就别硬翻了
    const groups: number[] = []
    while (n > 0) {
        groups.push(n % 10000)
        n = Math.floor(n / 10000)
    }
    let out = ''
    for (let i = groups.length - 1; i >= 0; i--) {
        const g = groups[i]
        if (g === 0) continue
        // 中间有空组（如 1000500 的千位段）要补一个「零」
        if (g < 1000 && out && !out.endsWith('零')) out += '零'
        out += fourDigits(g) + BIG_UNITS[i]
    }
    return out
}

/**
 * 阅读时长 → 古称。一盏茶≈10 分钟，一炷香≈30 分钟，半个时辰≈1 小时；
 * 再长就不硬翻了，回退成「约 N 分钟」。
 */
export function cnReadingTime(minutes: number): string {
    const m = Math.max(1, Math.round(minutes))
    if (m <= 10) return '一盏茶'
    if (m <= 30) return '一炷香'
    if (m <= 60) return '半个时辰'
    if (m <= 120) return '一个时辰'
    return `约 ${cnNumber(m)} 分钟`
}

/** 十二时辰：idx 0 = 子时（23:00 - 01:00），各配一句合适的闲话 */
const SHICHEN: [string, string][] = [
    ['子', '夜深了，早些安歇'],
    ['丑', '夜阑人静，万籁俱寂'],
    ['寅', '拂晓将至，晨光在途'],
    ['卯', '一日之计在于晨'],
    ['辰', '晨光正好，宜启一日之事'],
    ['巳', '日上三竿，宜耕读'],
    ['午', '日正当中，小憩片刻'],
    ['未', '日昳之时，宜静坐'],
    ['申', '日晡，宜整理收拾'],
    ['酉', '日入而息，暮色四合'],
    ['戌', '掌灯时分，宜静读'],
    ['亥', '夜读正当时，勿过子时'],
]

/** 按时刻返回当前时辰：{ name: '戌时', line: '掌灯时分，宜静读' } */
export function getShichen(date: Date = new Date()): { name: string; line: string } {
    const idx = Math.floor(((date.getHours() + 1) % 24) / 2)
    const [zi, line] = SHICHEN[idx]
    return { name: `${zi}时`, line }
}
