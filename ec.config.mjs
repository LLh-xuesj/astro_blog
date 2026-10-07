// ec.config.mjs — Expressive Code（官方实现）配置
//
// 这个文件会被 astro-expressive-code 自动加载（博客），同时也由
// cms/server/preview.mjs 直接 import（CMS 实时预览），保证两边渲染完全一致。
//
// 代码主题现在在下面就地定义（宣纸配色的 light + dark 两档）；src/config.ts 的
// siteConfig.expressiveCode.theme 只写主题「名字」，由本文件底部的 ecThemeOptions()
// 换算成 Expressive Code 的选项。两处都调用它，所以主题只在 config.ts 里改一处名字即可。
//
// 支持的写法（写在代码围栏的信息串里）：
//   ```js title="src/app.js" {3-5} showLineNumbers startLineNumber=10
//   ```js ins={2} del={1}          // diff 标记
//   ```bash frame="terminal"        // 终端窗口（三个圆点）
//   ```js collapse={6-20} wrap      // 折叠 + 自动换行
//   ```js frame="none"              // 不显示标题栏
import { pluginCollapsibleSections, pluginCollapsibleSectionsTexts } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { ExpressiveCodeTheme } from '@expressive-code/core'

// EC 内置文案只有英文与德文，这里补一份中文（折叠提示）
// 具体用哪个语言由 getBlockLocale 决定，见 astro.config.mjs 与 cms/server/preview.mjs
pluginCollapsibleSectionsTexts.addLocale('zh-CN', {
  collapsedLines: '已折叠 {lineCount} 行',
})

/* ============================================================
   宣纸代码主题
   ------------------------------------------------------------
   语法配色取自 Typora 宣纸主题（xuan.css 的代码块配色），只是把 CodeMirror
   的类名换算成 TextMate 的 scope：
     关键字/标签 #a2382c · 数字/属性 #8a5a20 · 函数/属性名 #2f5d73
     字符串 #4f6b33 · 注释 #9c907c 斜体 · 运算符/标点 #6b625a
   浅色一档就是宣纸的暖纸底；深色一档是自配的「夜墨」，同色系整体提亮，
   免得暗底上那几个深色糊成一团。
   ============================================================ */

/** 只写两档之间不同的值；scopes 与 scope 的对应关系两档共用 */
const XUAN_SYNTAX = {
  light: { keyword: '#a2382c', atom: '#8a5a20', def: '#2f5d73', string: '#4f6b33', comment: '#9c907c', operator: '#6b625a' },
  dark: { keyword: '#e0837a', atom: '#d8a862', def: '#82b0c8', string: '#9dbf76', comment: '#8d8175', operator: '#a2988c' },
}

/**
 * 把一档配色组装成 Expressive Code 认的 VS Code 主题对象。
 * @param {'light' | 'dark'} type
 */
function xuanCodeTheme(type) {
  const c = XUAN_SYNTAX[type]
  const isLight = type === 'light'
  // 纸底/墨色：与 variables.css 的 --code-* 令牌同值
  const bg = isLight ? '#f4efe4' : '#2a251f'
  const fg = isLight ? '#3b352d' : '#e2d9c9'
  const bar = isLight ? '#ece3d3' : '#332d25'
  const barFg = isLight ? '#5f574e' : '#b3a897'
  const line = isLight ? '#e5dbc8' : '#3b342b'
  const gutter = isLight ? '#b9ab93' : '#6b6257'
  const gutterActive = isLight ? '#8d8378' : '#a2988c'
  const selection = isLight ? '#e8ddc6' : '#423a30'

  return new ExpressiveCodeTheme({
    name: isLight ? 'xuan-paper' : 'xuan-paper-night',
    type,
    colors: {
      'editor.background': bg,
      'editor.foreground': fg,
      'editor.selectionBackground': selection,
      'editorLineNumber.foreground': gutter,
      'editorLineNumber.activeForeground': gutterActive,
      // 标题栏与边框：宣纸里代码块是「贴在纸上的一小张纸」，比正文纸稍深一档
      'titleBar.activeBackground': bar,
      'titleBar.activeForeground': barFg,
      'titleBar.inactiveBackground': bar,
      'titleBar.inactiveForeground': gutterActive,
      'titleBar.border': line,
      // 代码框内的拖选反白也用纸色（默认是 VS Code 那种深蓝）
      'titleBar.activeSelectionBackground': selection,
      'editor.selectionHighlightBackground': selection,
      'button.background': isLight ? '#e6dccb' : '#3b342b',
      'button.foreground': barFg,
      'button.hoverBackground': isLight ? '#dbcdb5' : '#4a4239',
      'dropdown.background': isLight ? '#fdfbf6' : '#262019',
      'dropdown.foreground': fg,
      'dropdown.border': line,
      // 终端窗口那三个圆点与 ansi 色，跟着同一套暖色走
      'terminal.ansiRed': c.keyword,
      'terminal.ansiGreen': c.string,
      'terminal.ansiYellow': c.atom,
      'terminal.ansiBlue': c.def,
      'terminal.ansiMagenta': isLight ? '#8b2671' : '#b08cc4',
      'terminal.ansiCyan': isLight ? '#3c5b6f' : '#7ba3bb',
    },
    // 顺序从宽到窄；TextMate 里更精确的 scope 会自然胜出（如 keyword.operator 压过 keyword）
    tokenColors: [
      { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: c.comment, fontStyle: 'italic' } },
      { scope: ['keyword', 'storage', 'support.type', 'support.class', 'entity.name.tag', 'punctuation.definition.tag', 'variable.language'], settings: { foreground: c.keyword } },
      { scope: ['constant', 'constant.numeric', 'constant.language', 'constant.character', 'entity.other.attribute-name', 'variable.other.constant', 'support.constant'], settings: { foreground: c.atom } },
      { scope: ['entity.name.function', 'support.function', 'entity.name.type', 'entity.name.class', 'entity.name.namespace', 'variable.other.property', 'variable.other.object.property', 'variable.other.readwrite', 'meta.object-literal.key'], settings: { foreground: c.def } },
      { scope: ['string', 'punctuation.definition.string', 'string.regexp', 'markup.inserted', 'markup.raw'], settings: { foreground: c.string } },
      { scope: ['keyword.operator', 'punctuation', 'meta', 'meta.punctuation', 'storage.modifier'], settings: { foreground: c.operator } },
    ],
  })
}

const XUAN_THEMES = { light: xuanCodeTheme('light'), dark: xuanCodeTheme('dark') }

/** 主题名 → 主题对象。src/config.ts 里写 'xuan-paper' / 'xuan-paper-night' 即可 */
const CUSTOM_THEMES = {
  'xuan-paper': XUAN_THEMES.light,
  'xuan-paper-night': XUAN_THEMES.dark,
}

// src/config.ts 里没有配置主题时的兜底（旧版配置文件）
export const DEFAULT_EC_THEME = 'xuan-paper'

// 把 src/config.ts 的 siteConfig.expressiveCode 转成 Expressive Code 的选项。
// 博客（astro.config.mjs）与 CMS 预览（cms/server/preview.mjs）都必须调用它，
// 这样代码主题只在 src/config.ts 里配置一处。
// 两档主题一起给：EC 会按 mode 分成「基础档」和「备选档」，
// 再由下面的 themeCssSelector 把暗色档绑到站点自己的 [data-theme="dark"] 上。
export function ecThemeOptions(settings) {
  const theme = settings?.theme || DEFAULT_EC_THEME
  const themes = theme === 'xuan-paper'
    ? [XUAN_THEMES.light, XUAN_THEMES.dark]
    : [CUSTOM_THEMES[theme] ?? theme]
  return { themes }
}

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
export default {
  ...ecThemeOptions({}),

  // 站点的深浅色是 data-theme 属性（挂在 <html>），不是 prefers-color-scheme，
  // 所以关掉 EC 自带的媒体查询，改成把暗色档绑到 [data-theme="dark"]。
  // 浅色档返回 false = 不额外生成选择器，它就是默认样式。
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) => (theme.type === 'dark' ? '[data-theme="dark"]' : false),

  // 宣纸的注释色（#9c907c）本来就淡，EC 默认会把低对比度的语法色硬拉到 5.5:1，
  // 那会把整套配色改得面目全非，所以关掉
  minSyntaxHighlightingColorContrast: 0,

  // 代码块里的滚动条交给站点自己的全局滚动条样式（scrollbar.css），
  // 这样和页面滚动条是同一根暖木色
  useThemedScrollbars: false,

  // Expressive Code 的可选插件：折叠代码段、行号
  plugins: [pluginCollapsibleSections(), pluginLineNumbers()],

  // 默认关闭自动换行与行号，需要时在代码块信息串里单独开启
  // （改完本文件后若效果没变化，先清缓存：pnpm xuan clean）
  defaultProps: {
    wrap: false,
    showLineNumbers: false,
  },

  frames: {
    // 代码里带文件路径注释时（如 // src/app.js）自动作为标题
    extractFileNameFromCode: true,
  },

  styleOverrides: {
    // 与站点正文的代码字体保持一致（@fontsource-variable/jetbrains-mono）
    codeFontFamily: "var(--mono)",
    codeFontSize: '0.875rem',
    codeLineHeight: '1.7',
    borderRadius: '4px',
    // 标题栏下沿那道边跟正文里代码块的描边同色
    borderColor: 'var(--code-border)',
    uiFontFamily: "var(--sans)",
    // 行内标记的底色默认是 VS Code 那套亮蓝/亮绿/亮红，放在宣纸底上很跳，
    // 改成「藤黄 / 草绿 / 朱砂」三色的淡染。数组是 [暗色档, 亮色档]（EC 的约定顺序）
    textMarkers: {
      markBackground: ['rgba(214,178,74,0.26)', 'rgba(214,178,74,0.38)'],
      markBorderColor: ['rgba(214,178,74,0.45)', 'rgba(185,154,61,0.55)'],
      insBackground: ['rgba(157,191,118,0.16)', 'rgba(79,107,51,0.15)'],
      insBorderColor: ['rgba(157,191,118,0.45)', 'rgba(79,107,51,0.42)'],
      insDiffIndicatorColor: ['#9dbf76', '#4f6b33'],
      delBackground: ['rgba(217,90,76,0.16)', 'rgba(178,58,46,0.13)'],
      delBorderColor: ['rgba(217,90,76,0.45)', 'rgba(178,58,46,0.42)'],
      delDiffIndicatorColor: ['#e0837a', '#b23a2e'],
    },
    frames: {
      // 代码块的浮起阴影：纸的东西用暖褐影，不用纯黑
      shadowColor: ['rgba(0,0,0,0.45)', 'rgba(70,60,45,0.20)'],
    },
  },
}
