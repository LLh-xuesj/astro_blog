// gen-seal.mjs — 生成 Xuan 主题的「宣」字印章 favicon
//
//   node script/gen-seal.mjs
//
// 产物（都会覆盖同名文件）：
//   public/favicon/xuan-seal.svg      —— 矢量版，浏览器标签页优先用它
//   public/favicon/favicon.ico        —— PNG-in-ICO，含 16 / 32 / 48 三档，给不支持 SVG 图标的浏览器兜底
//   public/favicon/xuan-seal-180.png  —— iOS 添加到主屏用的图标
//
// 想换成自己的字/颜色，直接改下面的 CONFIG 再跑一次即可。
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const CONFIG = {
  char: '宣', // 印章里的字
  sealColor: '#b23a2e', // 朱砂
  charColor: '#fdfbf6', // 纸色（挖白）
  size: 64, // 设计画布尺寸，viewBox 用它
  radius: 10, // 圆角
  fontSize: 42,
  fontFamily:
    "'KingHwaOldSong','KingHwa_OldSong','京華老宋体','Noto Serif SC','Songti SC','SimSun',serif",
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CONFIG.size} ${CONFIG.size}" width="${CONFIG.size}" height="${CONFIG.size}" role="img" aria-label="Xuan">
  <rect x="1" y="1" width="${CONFIG.size - 2}" height="${CONFIG.size - 2}" rx="${CONFIG.radius}" fill="${CONFIG.sealColor}"/>
  <text x="${CONFIG.size / 2}" y="${CONFIG.size / 2 + 1}" fill="${CONFIG.charColor}"
        font-family="${CONFIG.fontFamily}" font-size="${CONFIG.fontSize}" font-weight="700"
        text-anchor="middle" dominant-baseline="central">${CONFIG.char}</text>
</svg>
`

/** 把若干 PNG 打成 ICO（Vista 之后允许目录项直接指向 PNG 数据） */
function buildIco(pngs) {
  const count = pngs.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(count, 4)

  const entries = []
  let offset = 6 + count * 16
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0) // width（0 表示 256）
    entry.writeUInt8(size >= 256 ? 0 : size, 1) // height
    entry.writeUInt8(0, 2) // 调色板数
    entry.writeUInt8(0, 3) // reserved
    entry.writeUInt16LE(1, 4) // color planes
    entry.writeUInt16LE(32, 6) // bits per pixel
    entry.writeUInt32LE(data.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    offset += data.length
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)])
}

const outDir = join(ROOT, 'public', 'favicon')
await mkdir(outDir, { recursive: true })

const render = (size) =>
  sharp(Buffer.from(svg), { density: Math.max(72, Math.round((size / CONFIG.size) * 720)) })
    .resize(size, size)
    .png()
    .toBuffer()

const pngs = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await render(size) })))

await writeFile(join(outDir, 'xuan-seal.svg'), svg, 'utf8')
await writeFile(join(outDir, 'favicon.ico'), buildIco(pngs))
await writeFile(join(outDir, 'xuan-seal-180.png'), await render(180))

console.log('✓ public/favicon/xuan-seal.svg')
console.log('✓ public/favicon/favicon.ico (16/32/48)')
console.log('✓ public/favicon/xuan-seal-180.png')
