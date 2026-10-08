<script>
  import { onMount } from 'svelte';
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import i18nit from '@i18n/translation';
  import { formatMonthDay } from '@/utils/time'
  import { cnNumber } from '@utils/cnText'
  import { getRelativeLocaleUrl } from '@utils/urlUtils';

  export let sortedPosts = [];
  export let currentLang = "zh-cn";
  export let defaultLocale = "zh-cn";

  // 两套筛选：分类（一篇只归一个）与标签（一篇可挂多枚），可叠加；各自多选取并集
  let selectedCategories = [];
  let selectedTags = [];
  const t = i18nit(currentLang);

  const postCategory = (post) => post.data.category || 'undefined';
  const postTags = (post) => post.data.tags ?? [];

  // 提取所有分类并去重
  $: categories = [...new Set(sortedPosts.map(postCategory))].sort();

  // 只按分类筛过的集合：左栏标签的篇数跟着它走，免得点出一条空结果
  $: categoryFiltered = selectedCategories.length > 0
    ? sortedPosts.filter(post => selectedCategories.includes(postCategory(post)))
    : sortedPosts;

  // 只按标签筛过的集合：右栏分类的篇数跟着它走
  $: tagFiltered = selectedTags.length > 0
    ? sortedPosts.filter(post => postTags(post).some(tag => selectedTags.includes(tag)))
    : sortedPosts;

  // 两套筛选同时成立才是最终列表
  $: filteredPosts = sortedPosts.filter(post =>
    (selectedCategories.length === 0 || selectedCategories.includes(postCategory(post))) &&
    (selectedTags.length === 0 || postTags(post).some(tag => selectedTags.includes(tag)))
  );

  // 标签清单 + 篇数（篇数多的在前，同数按拼音）
  $: tagStats = [...categoryFiltered.reduce((acc, post) => {
      for (const tag of postTags(post)) acc.set(tag, (acc.get(tag) ?? 0) + 1);
      return acc;
    }, new Map())]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-Hans-CN'));

  // 每个分类下有几篇
  $: categoryCounts = tagFiltered.reduce((acc, post) => {
      const cat = postCategory(post);
      acc[cat] = (acc[cat] ?? 0) + 1;
      return acc;
    }, {});

  // 按年份分组逻辑
  $: postsByYear = filteredPosts.reduce((acc, post) => {
    const year = new Date(post.data.pubDate).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  $: years = Object.keys(postsByYear).sort((a, b) => b - a);

  // 年度小结：这一年几篇、共几言（筛选时跟着联动）
  $: yearStats = Object.fromEntries(
    years.map((year) => {
      const posts = postsByYear[year];
      return [year, {
        count: posts.length,
        words: posts.reduce((sum, post) => sum + (post.words || 0), 0),
      }];
    })
  );

  onMount(() => {
    // 获取初始 URL 参数 - 特殊处理 undefined
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    const tagParam = params.get('tag');

    // 当参数为 'undefined' 时，专门用于显示未分类文章
    if (categoryParam === 'undefined') {
      selectedCategories = ['undefined'];
    } else if (categoryParam && categoryParam !== 'null') {
      selectedCategories = categoryParam.split(',');
    }
    if (tagParam) selectedTags = tagParam.split(',').filter(Boolean);

    // 处理浏览器前进/后退
    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const c = p.get('category');
      selectedCategories = c === 'undefined' ? ['undefined'] : (c ? c.split(',') : []);
      const tag = p.get('tag');
      selectedTags = tag ? tag.split(',').filter(Boolean) : [];
    };

    window.addEventListener('popstate', handlePopState);

    // 左右两条固定侧栏都撑到与正文等高，sticky 才有得跟
    const syncAsideHeight = () => {
      const mainContent = document.getElementById('archive-content');
      if (!mainContent) return;
      const mainHeight = mainContent.offsetHeight;
      for (const id of ['tag-sidebar', 'category-sidebar']) {
        const aside = document.getElementById(id);
        if (aside) aside.style.height = `${mainHeight}px`;
      }
    };

    // 使用 setTimeout 确保 DOM 已完全渲染（特别是异步加载内容时）
    setTimeout(syncAsideHeight, 0);

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(syncAsideHeight, 100);
    };
    window.addEventListener('resize', handleResize);

    const mainContent = document.getElementById('archive-content');
    let mutationObserver;
    if (mainContent) {
      mutationObserver = new MutationObserver(syncAsideHeight);
      mutationObserver.observe(mainContent, {
        childList: true,    // 监听子节点增删
        subtree: true,      // 监听后代节点
        attributes: false,  // 不需要监听属性变化（性能优化）
        characterData: false
      });
    }

    return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimer);

        if (mutationObserver) {
            mutationObserver.disconnect();
        }
    }
  });

  // 把当前筛选写进 URL，方便分享、刷新与后退
  function syncUrl() {
    const url = new URL(window.location);
    if (selectedCategories.length > 0) {
      url.searchParams.set('category', selectedCategories.join(','));
    } else {
      url.searchParams.delete('category');
    }
    if (selectedTags.length > 0) {
      url.searchParams.set('tag', selectedTags.join(','));
    } else {
      url.searchParams.delete('tag');
    }
    window.history.replaceState({ ...window.history.state, url: url.pathname + url.search }, '', url);
  }

  // 筛选点击逻辑
  function toggleCategory(cat) {
    if (cat === null) {
      selectedCategories = []; // 点击“全部”则清空
    } else {
      if (selectedCategories.includes(cat)) {
        // 如果已选中，则移除
        selectedCategories = selectedCategories.filter(c => c !== cat);
      } else {
        // 如果未选中，则添加
        selectedCategories = [...selectedCategories, cat];
      }
    }
    syncUrl();
  }

  function toggleTag(tag) {
    if (tag === null) {
      selectedTags = [];
    } else if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(item => item !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
    syncUrl();
  }

</script>

<style>
    /* 归档的「卷首」：老宋体大字年份，压一枚朱砂菱印 */
    .archive-year {
        font-family: var(--serif-head);
        font-weight: 400;
        font-size: 1.7rem;
        letter-spacing: 0.08em;
        color: var(--ink-strong);
    }
    .archive-year-dot {
        width: 10px;
        height: 10px;
        background: var(--accent);
        border-radius: 2px;
        transform: rotate(45deg);
    }
    /* 年度小结的小注：像年终清点藏书时写在卷首的那行小字 */
    .archive-year-stat {
        font-family: var(--serif);
        font-size: 0.84rem;
        letter-spacing: 0.06em;
        color: var(--ink-mute);
    }
    /* 行首的小引导点：空心墨点，悬停时实心变朱砂 */
    .archive-row-dot {
        width: 5px;
        height: 5px;
        border: 1px solid var(--ink-mute);
        border-radius: 50%;
        flex-shrink: 0;
        transition: background-color 0.2s ease, border-color 0.2s ease;
    }
    .group:hover .archive-row-dot {
        background: var(--accent);
        border-color: var(--accent);
    }
    /* 筛选小签：左右两条侧栏共用一套观感，选中的那枚是朱砂底白字 */
    .filter-chip {
        display: inline-flex;
        align-items: baseline;
        gap: 0.32em;
        padding: 0.22rem 0.6rem;
        font-family: var(--serif);
        font-size: 0.78rem;
        line-height: 1.6;
        color: var(--text-color);
        background: color-mix(in srgb, var(--paper-deep) 40%, transparent);
        border: 1px solid var(--button-border-color);
        border-radius: 3px;
        transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
        cursor: pointer;
    }
    .filter-chip:hover {
        color: var(--accent);
        border-color: color-mix(in srgb, var(--accent) 45%, var(--button-border-color));
    }
    .filter-chip.active {
        background: var(--accent);
        border-color: var(--accent);
        color: #fff;
    }
    .filter-count {
        font-family: var(--mono);
        font-size: 0.68rem;
        opacity: 0.68;
    }
    /* 窄屏那两行里的「标签 / 分类」抬头 */
    .filter-label {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-family: var(--serif-head);
        font-size: 0.82rem;
        letter-spacing: 0.08em;
        color: var(--text-color-70);
    }
    .filter-hint {
        margin-top: 0.9rem;
        font-family: var(--serif);
        font-size: 0.76rem;
        line-height: 1.7;
        color: var(--ink-mute);
    }
</style>

<div class="archives mx-auto w-full max-w-[var(--page-width)]">
    <div class="text-center pt-5 pb-10 max-w-[var(--page-width)] mx-auto md:mt-0 mt-28">
        <h1 class="text-[var(--text-color)] text-3xl py-5 font-bold">{t("header.archive")}</h1>
        <p class="text-[var(--text-color-70)] font-bold">{t("cover.subTitle.archive", {count: filteredPosts.length})}</p>
    </div>

    <!-- 窄屏：左右两条侧栏收起，把两排小签挪到列表上方 -->
    <div class="xl:hidden px-4 mb-4 space-y-3">
        <div class="flex flex-wrap items-center gap-2">
            <span class="filter-label"><Icon icon="fa6-solid:tags" class="text-xs" />{t("header.tags")}</span>
            <button class="filter-chip" class:active={selectedTags.length === 0} on:click={() => toggleTag(null)}>{t("tags.all")}</button>
            {#each tagStats as { tag, count } (tag)}
                <button class="filter-chip" class:active={selectedTags.includes(tag)} on:click={() => toggleTag(tag)}>
                    {tag}<span class="filter-count">{count}</span>
                </button>
            {/each}
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <span class="filter-label"><Icon icon="fa6-solid:hashtag" class="text-xs" />{t("category")}</span>
            <button class="filter-chip" class:active={selectedCategories.length === 0} on:click={() => toggleCategory(null)}>{t("tags.all")}</button>
            {#each categories as cat}
                <button class="filter-chip" class:active={selectedCategories.includes(cat)} on:click={() => toggleCategory(cat)}>
                    {cat === 'undefined' ? t("pagecard.uncategorized") : cat}<span class="filter-count">{categoryCounts[cat] ?? 0}</span>
                </button>
            {/each}
        </div>
    </div>

    <div class="py-6 mx-auto text-[var(--text-color)]" id="archive-content">
        {#if filteredPosts.length === 0}
            <p class="text-center py-16 text-[var(--text-color-70)]">{t("tags.empty")}</p>
        {/if}
        {#each years as year (year)}
            <div class="mb-8">
                <h2 class="archive-year flex items-baseline gap-3 my-5">
                    <span class="archive-year-dot" aria-hidden="true"></span>
                    {year}
                    <span class="archive-year-stat">{cnNumber(yearStats[year].count)}篇 · {cnNumber(yearStats[year].words)}言</span>
                </h2>
                <div class="space-y-2">
                    {#each postsByYear[year] as post (post.id)}
                        <div animate:flip={{ duration: 600 }} in:fade={{ duration: 150 }} out:fade={{ duration: 150 }} >
                            <a 
                                href={getRelativeLocaleUrl(currentLang, `/blog/${post.id}`)} 
                                class="flex items-center gap-4 active:bg-[var(--button-hover-color)] hover:bg-[var(--button-hover-color)] p-2 rounded transition-colors duration-200 group"
                            >
                                <span class="text-[var(--text-color-70)] min-w-[80px] md:min-w-[120px]">
                                    {formatMonthDay(post.data.pubDate, currentLang)}
                                </span>
                                
                                <span class="text-lg group-hover:pl-2 group-hover:text-[var(--accent)] group-hover:font-bold transition-[padding-left,color,font-weight] duration-200 flex-1 flex items-center gap-2 group-active:text-[var(--accent)]">
                                    <span class="archive-row-dot" aria-hidden="true"></span>
                                    {post.data.title}
                                    {#if post.isFallback}
                                        <span class="inline-block px-1 ml-2 text-xs font-mono uppercase bg-[var(--button-hover-color)] rounded border border-[var(--button-border-color)]">
                                            {defaultLocale}
                                        </span>
                                    {/if}
                                </span>

                                <span class="hidden md:flex items-center font-mono text-sm text-[var(--text-color-70)]">
                                    <Icon icon="fa6-solid:hashtag" class="mr-1" />
                                    {post.data.category || t("pagecard.uncategorized")}
                                </span>
                            </a>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

    <!-- 左：标签 -->
    <aside 
        id="tag-sidebar"
        class="hidden xl:block absolute right-[var(--toc-offset-left)] top-70 bottom-0 w-[var(--category-width)]">
        <div class="sticky top-24">
            <div class="flex items-center gap-2 text-[var(--text-color)] font-bold mb-4 border-b border-[var(--button-border-color)] pb-2 uppercase tracking-wider">
                <Icon icon="fa6-solid:tags" class="text-xs" />
                <span>{t("header.tags")}</span>
            </div>

            <div class="flex flex-wrap gap-2">
                <button 
                    class="filter-chip"
                    class:active={selectedTags.length === 0}
                    on:click={() => toggleTag(null)}
                >
                    {t("tags.all")}
                </button>
                {#each tagStats as { tag, count } (tag)}
                    <button 
                        class="filter-chip"
                        class:active={selectedTags.includes(tag)}
                        on:click={() => toggleTag(tag)}
                    >
                        {tag}<span class="filter-count">{count}</span>
                    </button>
                {/each}
            </div>

            <p class="filter-hint">{t("tags.hint")}</p>
        </div>
    </aside>

    <!-- 右：分类 -->
    <aside 
        id="category-sidebar"
        class="hidden xl:block absolute left-[var(--toc-offset-left)] top-70 bottom-0 w-[var(--category-width)]">
        <div class="sticky top-24">
            <div class="flex items-center gap-2 text-[var(--text-color)] font-bold mb-4 border-b border-[var(--button-border-color)] pb-2 uppercase tracking-wider">
                <Icon icon="fa6-solid:hashtag" class="text-xs" />
                <span>{t("category")}</span>
            </div>

            <div class="flex flex-wrap gap-2">
                <button 
                    class="filter-chip"
                    class:active={selectedCategories.length === 0}
                    on:click={() => toggleCategory(null)}
                >
                    {t("tags.all")}
                </button>
                {#each categories as cat}
                    <button 
                        class="filter-chip"
                        class:active={selectedCategories.includes(cat)}
                        on:click={() => toggleCategory(cat)}
                    >
                        {cat === 'undefined' ? t("pagecard.uncategorized") : cat}<span class="filter-count">{categoryCounts[cat] ?? 0}</span>
                    </button>
                {/each}
            </div>
        </div>
    </aside>
