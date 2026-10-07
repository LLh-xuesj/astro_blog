/**
 * 二十四节气（B4 彩蛋的算子）
 *
 * 用通用的「寿星公式」按年推算每个节气的公历日期：
 *   日 = floor(年尾数 × 0.2422 + C) − floor(年尾数 / 4)
 * C 是每个节气在 21 世纪的常值。个别年份会有 ±1 天的特例（如某些年的大寒、
 * 春分），对页脚一枚装饰来说可以接受——真要精确到分秒得靠天文历表。
 * 20 世纪的 C 值不同，本站只服务当下，不做兼容。
 */
const TERM_C: Array<{ month: number; name: string; c: number; imagery: string }> = [
    { month: 1, name: '小寒', c: 5.4055, imagery: '雁将北归' },
    { month: 1, name: '大寒', c: 20.12, imagery: '冰坚霜重' },
    { month: 2, name: '立春', c: 3.87, imagery: '东风解冻' },
    { month: 2, name: '雨水', c: 18.73, imagery: '润物无声' },
    { month: 3, name: '惊蛰', c: 5.63, imagery: '春雷始鸣' },
    { month: 3, name: '春分', c: 20.646, imagery: '玄鸟归来' },
    { month: 4, name: '清明', c: 4.81, imagery: '气清景明' },
    { month: 4, name: '谷雨', c: 20.1, imagery: '雨生百谷' },
    { month: 5, name: '立夏', c: 5.52, imagery: '蛙声初起' },
    { month: 5, name: '小满', c: 21.04, imagery: '麦穗初齐' },
    { month: 6, name: '芒种', c: 5.678, imagery: '梅子黄时' },
    { month: 6, name: '夏至', c: 21.37, imagery: '蝉始长鸣' },
    { month: 7, name: '小暑', c: 7.108, imagery: '温风始至' },
    { month: 7, name: '大暑', c: 22.83, imagery: '腐草为萤' },
    { month: 8, name: '立秋', c: 7.5, imagery: '凉风初至' },
    { month: 8, name: '处暑', c: 23.13, imagery: '天地始肃' },
    { month: 9, name: '白露', c: 7.646, imagery: '鸿雁南来' },
    { month: 9, name: '秋分', c: 23.042, imagery: '雷始收声' },
    { month: 10, name: '寒露', c: 8.318, imagery: '菊有黄华' },
    { month: 10, name: '霜降', c: 23.438, imagery: '草木黄落' },
    { month: 11, name: '立冬', c: 7.438, imagery: '水始成冰' },
    { month: 11, name: '小雪', c: 22.36, imagery: '虹藏不见' },
    { month: 12, name: '大雪', c: 7.18, imagery: '寒鸟不鸣' },
    { month: 12, name: '冬至', c: 21.94, imagery: '一阳来复' },
]

/** 某年某个节气的公历日期（按 21 世纪 C 值推算） */
function termDate(year: number, term: (typeof TERM_C)[number]): Date {
    const y = year % 100
    // 走位修正：21 世纪里少数年份需要 -1（常见于立春/大寒等），用最保守的通式
    const day = Math.floor(y * 0.2422 + term.c) - Math.floor((y - 1) / 4)
    return new Date(year, term.month - 1, day)
}

/**
 * 「今天」处在哪个节气里（已开始、尚未到下一个节气的那个）。
 * 年初几天若还没到今年的小寒，落回上一年的冬至。
 */
export function getCurrentTerm(date: Date = new Date()): { name: string; date: Date; imagery: string } {
    const year = date.getFullYear()
    const terms = TERM_C.map((t) => ({ ...t, date: termDate(year, t) }))
    let current = terms[terms.length - 1] // 兜底：冬至
    let currentYear = year
    if (date < terms[0].date) {
        // 一月初还没到小寒：用上一年的冬至
        current = { ...TERM_C[TERM_C.length - 1], date: termDate(year - 1, TERM_C[TERM_C.length - 1]) }
        return { name: current.name, date: current.date, imagery: current.imagery }
    }
    for (const t of terms) {
        if (t.date <= date) current = t
        else break
    }
    void currentYear
    return { name: current.name, date: current.date, imagery: current.imagery }
}
