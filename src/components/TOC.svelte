<script>
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { siteConfig } from "@/config";
	import i18nit from '@i18n/translation'

	let { headings = [], language,} = $props();
	const t = $derived(i18nit(language));

	// 内部状态
	let tocVisible = $state(false);
	let activeIndex = $state(-1);
	let tocListElement = $state(null);

	// 弹簧动画：处理索引位置的连续过渡
	const focusSpring = spring(-1, {
		stiffness: 0.12,
		damping: 0.7
	});

	// 同步动画索引
	// 注意：Svelte 5 的 spring 没有 jump()，要「瞬间到位」得用 set(value, { instant: true })。
	// 这里保持原有的弹簧过渡，不做减弱动画的特殊分支（全局降级已移除，见 global.css 说明）
	$effect(() => {
		focusSpring.set(activeIndex);
	});

	// 基础逻辑计算
	let minDepth = $derived(headings.length > 0 ? Math.min(...headings.map(h => h.depth)) : 0);
	let maxDepth = $derived(minDepth + (siteConfig?.toc?.depth || 2));
	let filteredHeadings = $derived(headings.filter(h => h.depth < maxDepth));

	// 交叉观察器：检测当前阅读章节
	function initObserver() {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const idx = filteredHeadings.findIndex(h => h.slug === entry.target.id);
					if (idx !== -1) {
						activeIndex = idx;
						autoScrollTOC(idx);
					}
				}
			});
		}, { rootMargin: '-10% 0px -70% 0px', threshold: 0.1 });

		filteredHeadings.forEach(h => {
			const el = document.getElementById(h.slug);
			if (el) observer.observe(el);
		});
		return observer;
	}

	// 目录内部自动滚动 
	function autoScrollTOC(index) {
		if (tocListElement) {
			const items = tocListElement.querySelectorAll('a');
			const activeItem = items[index];
			if (activeItem) {
				const containerHeight = tocListElement.clientHeight;
				const targetScroll = activeItem.offsetTop - containerHeight / 2 + (activeItem.clientHeight / 2);
				tocListElement.scrollTo({ top: targetScroll, behavior: 'smooth' });
			}
		}
	}

	// 动态样式算法：基于弹簧数值计算透明度与字重
	// 透明度取两位小数：数值不变时字符串也不变，Svelte 会跳过这次 DOM 写入
	function getSpringStyle(index, currentSpring) {
		const distance = Math.abs(index - currentSpring);
		// 距离当前激活项越近，越明显
		const opacity = Math.round(Math.max(0.2, 1 - distance * 0.2) * 100) / 100;
		// 只有距离非常近时才加粗
		const fontWeight = distance < 0.5 ? '700' : '400';
		
		return `opacity: ${opacity}; font-weight: ${fontWeight};`;
	}

	onMount(() => {
		// ---- 滚动：rAF 合并 + 迟滞，避免在阈值附近反复切换显示状态 ----
		const SHOW_AT = 200;
		const HIDE_AT = 150;
		let ticking = false;

		function updateVisibility() {
			ticking = false;
			const scrollY = window.scrollY || window.pageYOffset;
			if (!tocVisible && scrollY > SHOW_AT) tocVisible = true;
			else if (tocVisible && scrollY < HIDE_AT) tocVisible = false;
		}

		function handleScroll() {
			if (ticking) return;
			ticking = true;
			window.requestAnimationFrame(updateVisibility);
		}

		window.addEventListener('scroll', handleScroll, { passive: true });
		updateVisibility();
		const observer = initObserver();

		const teardown = () => {
			window.removeEventListener('scroll', handleScroll);
			observer.disconnect();
			document.removeEventListener('astro:before-swap', teardown);
		};
		// Astro 换页时兜底解绑（Svelte 卸载时也会再调用一次，重复调用是安全的）
		document.addEventListener('astro:before-swap', teardown);

		return teardown;
	});
</script>

<!-- 不再用 {#if} 挂载/卸载：改成常驻 + CSS 透明度切换，避免阈值附近反复重建整个目录。
     visibility 参与过渡，因此淡出结束后才会真正隐藏。 -->
<aside
	aria-hidden={!tocVisible}
	class="fixed top-20 w-[var(--toc-width)] left-[var(--toc-offset-left)] z-10 hidden lg:block text-[var(--text-color)] transition-[opacity,visibility] duration-300 {tocVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}"
>
	<div class="flex flex-col h-[50vh] bg-transparent">
		<h2 id="toc-heading" class="toc-heading">
			<span class="toc-heading-dot" aria-hidden="true"></span>
			{t("toc")}
		</h2>

		<ul
			bind:this={tocListElement}
			class="overflow-y-auto space-y-2 pr-2 no-scrollbar"
			style="scrollbar-width: none; scroll-behavior: smooth;"
		>
			{#each filteredHeadings as heading, i}
				<li>
					<a
						href={`#${heading.slug}`}
						class:active={i === activeIndex}
						class="toc-sign"
						style:padding-left="{0.85 + (heading.depth - minDepth) * 1.1}rem"
						style={getSpringStyle(i, $focusSpring)}
						onclick={(e) => {
							e.preventDefault();
							document.getElementById(heading.slug)?.scrollIntoView({ behavior: 'smooth' });
						}}
					>
						{heading.text}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</aside>

<style>
	/* 隐藏滚动条但保留功能  */
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	/* ===== 目录纸签：右侧目录做成夹在书里的一叠纸签 =====
	   每条一枚小签（纸面 + 细纸边），读到哪节哪支凸出、
   行首墨点变朱砂——正文是雕版书页，侧栏就是夹签子的那册书脊 */

	.toc-heading {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.7rem;
		font-family: var(--serif-head);
		font-weight: 400;
		font-size: 1.05rem;
		letter-spacing: 0.16em;
		color: var(--ink-strong);
	}

	.toc-heading-dot {
		width: 7px;
		height: 7px;
		background: var(--accent);
		border-radius: 1.5px;
		transform: rotate(45deg);
		flex: none;
	}

	a {
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.toc-sign {
		position: relative;
		padding-top: 0.42rem;
		padding-bottom: 0.42rem;
		padding-right: 0.7rem;
		border-radius: 2px;
		background: color-mix(in srgb, var(--paper-sheet) 72%, transparent);
		border: 1px solid color-mix(in srgb, var(--paper-edge) 72%, transparent);
		box-shadow: 0 1px 2px rgba(70, 60, 45, 0.07);
		font-family: var(--serif);
		transition:
			transform 0.3s cubic-bezier(0.2, 0.7, 0.3, 1),
			background-color 0.25s ease,
			border-color 0.25s ease,
			box-shadow 0.25s ease;
	}

	/* 行首空心墨点：读到该节时变实心朱砂 */
	.toc-sign::before {
		content: '';
		position: absolute;
		left: 0.34rem;
		top: 50%;
		transform: translateY(-50%);
		width: 5px;
		height: 5px;
		border: 1px solid var(--ink-mute);
		border-radius: 50%;
		transition: background-color 0.25s ease, border-color 0.25s ease;
	}

	/* 当前小节：签子凸出来，墨点变朱砂，纸面加深一点 */
	.toc-sign.active {
		transform: translateX(8px);
		background: var(--paper-deep);
		border-color: color-mix(in srgb, var(--accent) 45%, var(--paper-edge));
		box-shadow: 0 2px 5px rgba(70, 60, 45, 0.13);
	}

	.toc-sign.active::before {
		background: var(--accent);
		border-color: var(--accent);
	}

	@media (prefers-reduced-motion: reduce) {
		.toc-sign,
		.toc-sign::before {
			transition: none;
		}

		.toc-sign.active {
			transform: none;
		}
	}
</style>
