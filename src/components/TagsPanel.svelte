<script>
  import { onMount } from 'svelte';
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import i18nit from '@i18n/translation';
  import { formatMonthDay } from '@/utils/time'
  import { getRelativeLocaleUrl } from '@utils/urlUtils';

  export let sortedPosts = [];
  export let currentLang = "zh-cn";
  export let defaultLocale = "zh-cn";

  let selectedTags = [];
  const t = i18nit(currentLang);

  // 每枚标签下有几篇文章；篇数多的排前面，同数按笔画（用中文排序）排
  $: tagStats = (() => {
    const counts = new Map();
    for (const post of sortedPosts) {
      for (const tag of post.data.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-Hans-CN'));
  })();

  // 多选时取「并集」：选中的任意一枚标签命中就列出（与归档页的分类筛选同一套直觉）
  $: filteredPosts = selectedTags.length > 0
    ? sortedPosts.filter(post => (post.data.tags ?? []).some(tag => selectedTags.includes(tag)))
    : sortedPosts;

  function toggleTag(tag) {
    if (tag === null) {
      selectedTags = [];
    } else if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(x => x !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }

    // 写进 URL，方便分享与刷新（沿用归档页的写法，swup 也认这个 state）
    const url = new URL(window.location);
    if (selectedTags.length > 0) {
      url.searchParams.set('tag', selectedTags.join(','));
    } else {
      url.searchParams.delete('tag');
    }
    window.history.replaceState({ ...window.history.state, url: url.pathname + url.search }, '', url);
  }

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const tagParam = params.get('tag');
    if (tagParam) selectedTags = tagParam.split(',').filter(Boolean);

    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search).get('tag');
      selectedTags = p ? p.split(',').filter(Boolean) : [];
    };
    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  });
</script>

<style>
    /* 标签云：纸上的小签，看中哪枚点一下 */
    .tag-chip {
        display: inline-flex;
        align-items: baseline;
        gap: 0.35em;
        font-family: var(--serif);
        font-size: 0.92rem;
        line-height: 1.9;
        padding: 0.05em 0.7em;
        border-radius: 3px;
        border: 1px solid var(--paper-edge);
        background: color-mix(in srgb, var(--paper-deep) 55%, transparent);
        color: var(--ink);
        transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
    }
    .tag-chip:hover {
        border-color: color-mix(in srgb, var(--accent) 45%, var(--paper-edge));
        color: var(--accent);
    }
    .tag-chip.active {
        background: var(--accent);
        border-color: var(--accent);
        color: var(--paper-sheet);
    }
    /* 签上的篇数：小一号的淡字，选中时跟着变浅 */
    .tag-count {
        font-family: var(--mono);
        font-size: 0.72em;
        color: var(--ink-mute);
    }
    .tag-chip.active .tag-count {
        color: color-mix(in srgb, var(--paper-sheet) 78%, transparent);
    }
    /* 行首的小引导点：空心墨点，悬停时实心变朱砂（与归档页同一套） */
    .tag-row-dot {
        width: 5px;
        height: 5px;
        border: 1px solid var(--ink-mute);
        border-radius: 50%;
        flex-shrink: 0;
        transition: background-color 0.2s ease, border-color 0.2s ease;
    }
    .tag-row:hover .tag-row-dot {
        background: var(--accent);
        border-color: var(--accent);
    }
    .tag-hint {
        font-family: var(--serif);
        font-size: 0.82rem;
        letter-spacing: 0.04em;
        color: var(--ink-mute);
    }
</style>

<div class="tags-page mx-auto w-full max-w-[var(--page-width)]">
    <div class="text-center pt-5 pb-6 max-w-[var(--page-width)] mx-auto md:mt-0 mt-28">
        <h1 class="text-[var(--text-color)] text-3xl py-5 font-bold">{t("header.tags")}</h1>
        <p class="text-[var(--text-color-70)] font-bold">{t("cover.subTitle.tags", {count: tagStats.length})}</p>
    </div>

    {#if tagStats.length > 0}
        <div class="px-4 md:px-0">
            <div class="flex flex-wrap items-baseline gap-2 justify-center">
                <button
                    on:click={() => toggleTag(null)}
                    class="tag-chip"
                    class:active={selectedTags.length === 0}
                >
                    {t("tags.all")}
                    <span class="tag-count">{sortedPosts.length}</span>
                </button>
                {#each tagStats as [tag, count] (tag)}
                    <button
                        on:click={() => toggleTag(tag)}
                        class="tag-chip"
                        class:active={selectedTags.includes(tag)}
                    >
                        {tag}
                        <span class="tag-count">{count}</span>
                    </button>
                {/each}
            </div>
            <p class="tag-hint text-center mt-4">{t("tags.hint")}</p>
        </div>
    {/if}

    <div class="py-6 mx-auto text-[var(--text-color)] px-4 md:px-0" id="tags-content">
        {#if filteredPosts.length === 0}
            <p class="text-center text-[var(--text-color-70)] py-12">{t("tags.empty")}</p>
        {:else}
            <div class="space-y-2">
                {#each filteredPosts as post (post.id)}
                    <div animate:flip={{ duration: 600 }} in:fade={{ duration: 150 }} out:fade={{ duration: 150 }}>
                        <a
                            href={getRelativeLocaleUrl(currentLang, `/blog/${post.id}`)}
                            class="tag-row flex items-center gap-4 active:bg-[var(--button-hover-color)] hover:bg-[var(--button-hover-color)] p-2 rounded transition-colors duration-200 group"
                        >
                            <span class="text-[var(--text-color-70)] min-w-[80px] md:min-w-[120px]">
                                {formatMonthDay(post.data.pubDate, currentLang)}
                            </span>

                            <span class="text-lg group-hover:pl-2 group-hover:text-[var(--accent)] group-hover:font-bold transition-[padding-left,color,font-weight] duration-200 flex-1 flex items-center gap-2 group-active:text-[var(--accent)]">
                                <span class="tag-row-dot" aria-hidden="true"></span>
                                {post.data.title}
                                {#if post.isFallback}
                                    <span class="inline-block px-1 ml-2 text-xs font-mono uppercase bg-[var(--button-hover-color)] rounded border border-[var(--button-border-color)]">
                                        {defaultLocale}
                                    </span>
                                {/if}
                            </span>

                            {#if post.data.category}
                                <span class="hidden md:flex items-center font-mono text-sm text-[var(--text-color-70)]">
                                    <Icon icon="fa6-solid:hashtag" class="mr-1" />
                                    {post.data.category}
                                </span>
                            {/if}
                        </a>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>
