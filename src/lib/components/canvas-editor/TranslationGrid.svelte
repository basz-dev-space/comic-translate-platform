<script lang="ts">
	import type { TextElement } from './types/elements';
	import { selectionStore } from './stores';

	interface Props {
		elements: TextElement[];
		onUpdate: (id: string, updates: Partial<TextElement['text']>) => void;
	}

	let { elements, onUpdate }: Props = $props();

	function handleTranslationChange(id: string, value: string) {
		onUpdate(id, { translatedContent: value });
	}

	function handleRowClick(id: string) {
		selectionStore.select(id);
	}

	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-800',
		translated: 'bg-blue-100 text-blue-800',
		reviewed: 'bg-green-100 text-green-800'
	};
</script>

<div class="h-full overflow-auto">
	<table class="w-full text-sm">
		<thead class="sticky top-0 bg-gray-50">
			<tr>
				<th class="w-12 px-3 py-2 text-left font-medium text-gray-600">#</th>
				<th class="px-3 py-2 text-left font-medium text-gray-600">Original</th>
				<th class="px-3 py-2 text-left font-medium text-gray-600">Translation</th>
				<th class="w-24 px-3 py-2 text-left font-medium text-gray-600">Status</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-200">
			{#each elements as element, index (element.id)}
				<tr
					class="cursor-pointer hover:bg-gray-50 {selectionStore.isSelected(element.id)
						? 'bg-blue-50'
						: ''}"
					onclick={() => handleRowClick(element.id)}
				>
					<td class="px-3 py-2 text-gray-500">{index + 1}</td>
					<td class="px-3 py-2 font-mono text-xs">{element.text.originalContent}</td>
					<td class="px-3 py-2">
						<input
							type="text"
							class="w-full rounded border border-gray-200 px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
							value={element.text.translatedContent}
							onchange={(e) => handleTranslationChange(element.id, e.currentTarget.value)}
							onclick={(e) => e.stopPropagation()}
						/>
					</td>
					<td class="px-3 py-2">
						<span
							class="rounded px-2 py-0.5 text-xs {statusColors[element.text.status] ||
								statusColors.pending}"
						>
							{element.text.status}
						</span>
					</td>
				</tr>
			{:else}
				<tr>
					<td colspan="4" class="px-3 py-8 text-center text-gray-400">No text elements</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
