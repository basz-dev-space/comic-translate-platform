<script lang="ts">
	import type { TextElement } from '../types/elements';
	import { selectionStore, canvasStore } from '../stores';

	interface Props {
		element: TextElement;
	}

	let { element }: Props = $props();

	let isSelected = $derived(selectionStore.isSelected(element.id));
	let isEditing = $state(false);
	let editText = $state('');

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
		if (element.locked) return;

		if (e.shiftKey) {
			selectionStore.toggleSelection(element.id);
		} else {
			selectionStore.select(element.id);
		}
	}

	function handleDoubleClick(e: MouseEvent) {
		e.stopPropagation();
		if (element.locked) return;

		isEditing = true;
		editText = element.text.translatedContent || element.text.content;
	}

	function handleInputBlur() {
		if (isEditing) {
			isEditing = false;
			canvasStore.updateTextElement(element.id, {
				translatedContent: editText
			});
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			isEditing = false;
		} else if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleInputBlur();
		}
	}

	let dragStart = $state({ x: 0, y: 0 });

	function handleDragStart(e: MouseEvent) {
		if (element.locked || isEditing) return;
		dragStart = { x: e.clientX - element.x, y: e.clientY - element.y };
	}

	function handleDrag(e: MouseEvent) {
		if (element.locked || isEditing) return;
		const newX = e.clientX - dragStart.x;
		const newY = e.clientY - dragStart.y;
		canvasStore.updateElement(element.id, { x: newX, y: newY });
	}

	function handleDragEnd() {
		dragStart = { x: 0, y: 0 };
	}

	const displayText = $derived(
		element.text.translatedContent || element.text.content
	);
</script>

<div
	class="text-element absolute cursor-move select-none"
	class:selected={isSelected}
	class:locked={element.locked}
	class:editing={isEditing}
	style="
		left: {element.x}px;
		top: {element.y}px;
		width: {element.width}px;
		height: {element.height}px;
		transform: rotate({element.rotation}deg);
		opacity: {element.opacity};
		font-family: {element.text.fontFamily}, sans-serif;
		font-size: {element.text.fontSize}px;
		font-weight: {element.text.fontWeight};
		font-style: {element.text.fontStyle};
		text-align: {element.text.textAlign};
		color: {element.text.fill};
		-webkit-text-stroke: {element.text.strokeWidth}px {element.text.stroke};
		line-height: {element.text.lineHeight};
	"
	onclick={handleClick}
	ondblclick={handleDoubleClick}
	onmousedown={handleDragStart}
	onmousemove={handleDrag}
	onmouseup={handleDragEnd}
	role="textbox"
	aria-label="Text element: {displayText}"
	aria-readonly={!isEditing}
	tabindex="0"
>
	{#if isEditing}
		<textarea
			class="edit-textarea w-full h-full resize-none border-none outline-none bg-transparent"
			style="font-family: inherit; font-size: inherit; font-weight: inherit; font-style: inherit; text-align: inherit; color: inherit; line-height: inherit;"
			bind:value={editText}
			onblur={handleInputBlur}
			onkeydown={handleKeyDown}
		></textarea>
	{:else}
		<span
			class="flex items-center justify-center w-full h-full"
			style="vertical-align: {element.text.verticalAlign}"
		>
			{displayText}
		</span>
	{/if}
</div>

<style>
	.text-element {
		border: 2px solid transparent;
		padding: 4px;
		transition: border-color 0.15s ease;
		box-sizing: border-box;
	}

	.text-element:hover:not(.locked):not(.editing) {
		border-color: #3b82f6;
	}

	.text-element.selected {
		border-color: #3b82f6;
		box-shadow: 0 0 0 1px #3b82f6;
	}

	.text-element.locked {
		cursor: not-allowed;
		opacity: 0.7;
	}

	.text-element.editing {
		cursor: text;
		border-color: #2563eb;
		box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
	}

	.edit-textarea {
		background: transparent;
		padding: 0;
		margin: 0;
	}
</style>
