<script lang="ts">
	import { canvasStore, selectionStore } from '../stores';
	import type { TextElement } from '../types/elements';
	import { DEFAULT_FONTS, DEFAULT_FONT_SIZES } from '../types/tools';

	const selectedTextElements = $derived(
		selectionStore.selectedIdsArray
			.map((id) => canvasStore.getElement(id))
			.filter((el): el is TextElement => el?.type === 'text')
	);

	const hasTextSelection = $derived(selectedTextElements.length > 0);

	function updateTextProperty(property: string, value: string | number) {
		for (const el of selectedTextElements) {
			canvasStore.updateTextElement(el.id, { [property]: value });
		}
	}

	function toggleBold() {
		for (const el of selectedTextElements) {
			const newWeight = el.text.fontWeight === 'bold' ? 'normal' : 'bold';
			updateTextProperty('fontWeight', newWeight);
		}
	}

	function toggleItalic() {
		for (const el of selectedTextElements) {
			const newStyle = el.text.fontStyle === 'italic' ? 'normal' : 'italic';
			updateTextProperty('fontStyle', newStyle);
		}
	}

	const firstElement = $derived(selectedTextElements[0]);
</script>

{#if hasTextSelection}
	<div class="text-toolbar flex items-center gap-2 border-l border-gray-200 pl-2">
		<!-- Font family -->
		<select
			class="font-select"
			value={firstElement?.text.fontFamily || 'Arial'}
			onchange={(e) => updateTextProperty('fontFamily', e.currentTarget.value)}
			aria-label="Font family"
		>
			{#each DEFAULT_FONTS as font (font)}
				<option value={font}>{font}</option>
			{/each}
		</select>

		<!-- Font size -->
		<select
			class="size-select"
			value={firstElement?.text.fontSize || 16}
			onchange={(e) => updateTextProperty('fontSize', parseInt(e.currentTarget.value))}
			aria-label="Font size"
		>
			{#each DEFAULT_FONT_SIZES as size (size)}
				<option value={size}>{size}</option>
			{/each}
		</select>

		<!-- Bold -->
		<button
			class="format-button"
			class:active={firstElement?.text.fontWeight === 'bold'}
			onclick={toggleBold}
			title="Bold (Ctrl+B)"
			aria-label="Bold"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
			>
				<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
				<path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
			</svg>
		</button>

		<!-- Italic -->
		<button
			class="format-button"
			class:active={firstElement?.text.fontStyle === 'italic'}
			onclick={toggleItalic}
			title="Italic (Ctrl+I)"
			aria-label="Italic"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<line x1="19" y1="4" x2="10" y2="4" />
				<line x1="14" y1="20" x2="5" y2="20" />
				<line x1="15" y1="4" x2="9" y2="20" />
			</svg>
		</button>

		<!-- Text color -->
		<label class="color-input" title="Text color">
			<input
				type="color"
				value={firstElement?.text.fill || '#000000'}
				onchange={(e) => updateTextProperty('fill', e.currentTarget.value)}
				aria-label="Text color"
			/>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M4 20h16" />
				<path d="M12 4v12" />
				<path d="M8 8l4-4 4 4" />
			</svg>
		</label>

		<!-- Alignment -->
		<div class="flex items-center gap-1 border-l border-gray-200 pl-2">
			<button
				class="format-button"
				class:active={firstElement?.text.textAlign === 'left'}
				onclick={() => updateTextProperty('textAlign', 'left')}
				title="Align left"
				aria-label="Align left"
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="3" y1="6" x2="21" y2="6" />
					<line x1="3" y1="12" x2="15" y2="12" />
					<line x1="3" y1="18" x2="18" y2="18" />
				</svg>
			</button>
			<button
				class="format-button"
				class:active={firstElement?.text.textAlign === 'center'}
				onclick={() => updateTextProperty('textAlign', 'center')}
				title="Align center"
				aria-label="Align center"
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="3" y1="6" x2="21" y2="6" />
					<line x1="6" y1="12" x2="18" y2="12" />
					<line x1="4" y1="18" x2="20" y2="18" />
				</svg>
			</button>
			<button
				class="format-button"
				class:active={firstElement?.text.textAlign === 'right'}
				onclick={() => updateTextProperty('textAlign', 'right')}
				title="Align right"
				aria-label="Align right"
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<line x1="3" y1="6" x2="21" y2="6" />
					<line x1="9" y1="12" x2="21" y2="12" />
					<line x1="6" y1="18" x2="21" y2="18" />
				</svg>
			</button>
		</div>
	</div>
{/if}

<style>
	.font-select,
	.size-select {
		padding: 4px 8px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		font-size: 12px;
		background: white;
		cursor: pointer;
	}

	.font-select {
		width: 120px;
	}

	.size-select {
		width: 60px;
	}

	.font-select:focus,
	.size-select:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 1px;
	}

	.format-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 4px;
		border: none;
		background: transparent;
		color: #374151;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.format-button:hover {
		background: #f3f4f6;
	}

	.format-button.active {
		background: #eff6ff;
		color: #2563eb;
	}

	.format-button:focus-visible {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	.color-input {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 4px;
		cursor: pointer;
	}

	.color-input:hover {
		background: #f3f4f6;
	}

	.color-input input {
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}
</style>
