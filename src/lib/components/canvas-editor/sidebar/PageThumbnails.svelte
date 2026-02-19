<script lang="ts">
	import type { Page } from './types';

	interface Props {
		pages: Page[];
		selectedPageId: number | null;
		onPageSelect: (pageId: number) => void;
	}

	let { pages, selectedPageId, onPageSelect }: Props = $props();
</script>

<aside class="flex w-40 shrink-0 flex-col border-r border-gray-200 bg-white">
	<div class="border-b border-gray-200 p-2">
		<span class="text-xs font-medium text-gray-600">Pages ({pages.length})</span>
	</div>
	<div class="flex-1 space-y-2 overflow-y-auto p-2">
		{#each pages as page (page.id)}
			<button
				class="w-full overflow-hidden rounded-md border-2 transition-all {selectedPageId === page.id
					? 'border-blue-500 ring-1 ring-blue-500'
					: 'border-gray-200 hover:border-gray-400'}"
				onclick={() => onPageSelect(page.id)}
				aria-pressed={selectedPageId === page.id}
			>
				<div class="relative aspect-[3/4] bg-gray-100">
					<img
						src={page.imageUrl}
						alt="Page {page.pageNumber}"
						class="h-full w-full object-cover"
					/>
					<span class="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-xs text-white">
						{page.pageNumber}
					</span>
					{#if page.ocrStatus === 'done'}
						<span class="absolute top-1 right-1 rounded bg-green-500 px-1 text-xs text-white">
							OCR
						</span>
					{:else if page.ocrStatus === 'processing'}
						<span class="absolute top-1 right-1 rounded bg-yellow-500 px-1 text-xs text-white">
							...
						</span>
					{/if}
				</div>
			</button>
		{:else}
			<div class="text-center text-gray-400 text-sm py-4">No pages yet</div>
		{/each}
	</div>
</aside>
