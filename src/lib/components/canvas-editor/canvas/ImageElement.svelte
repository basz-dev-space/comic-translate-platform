<script lang="ts">
	import type { ImageElement } from '../types/elements';
	import { selectionStore, canvasStore } from '../stores';

	interface Props {
		element: ImageElement;
	}

	let { element }: Props = $props();

	let isSelected = $derived(selectionStore.isSelected(element.id));

	function handleClick(e: MouseEvent) {
		e.stopPropagation();
		if (element.locked) return;

		if (e.shiftKey) {
			selectionStore.toggleSelection(element.id);
		} else {
			selectionStore.select(element.id);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (element.locked) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			if (e.shiftKey) {
				selectionStore.toggleSelection(element.id);
			} else {
				selectionStore.select(element.id);
			}
		}
	}

	let dragStart = $state({ x: 0, y: 0 });

	function handleDragStart(e: MouseEvent) {
		if (element.locked) return;
		dragStart = { x: e.clientX - element.x, y: e.clientY - element.y };
	}

	function handleDrag(e: MouseEvent) {
		if (element.locked) return;
		const newX = e.clientX - dragStart.x;
		const newY = e.clientY - dragStart.y;
		canvasStore.updateElement(element.id, { x: newX, y: newY });
	}

	function handleDragEnd() {
		dragStart = { x: 0, y: 0 };
	}
</script>

<button
	type="button"
	class="image-element absolute"
	class:selected={isSelected}
	class:locked={element.locked}
	style="
		left: {element.x}px;
		top: {element.y}px;
		width: {element.width}px;
		height: {element.height}px;
		transform: rotate({element.rotation}deg);
		opacity: {element.opacity};
	"
	onclick={handleClick}
	onkeydown={handleKeyDown}
	onmousedown={handleDragStart}
	onmousemove={handleDrag}
	onmouseup={handleDragEnd}
	aria-label="Image element"
>
	<img
		src={element.image.src}
		alt=""
		class="pointer-events-none h-full w-full object-cover"
		draggable="false"
	/>
</button>

<style>
	.image-element {
		border: 2px solid transparent;
		transition: border-color 0.15s ease;
		box-sizing: border-box;
	}

	.image-element:hover:not(.locked) {
		border-color: #3b82f6;
	}

	.image-element.selected {
		border-color: #3b82f6;
		box-shadow: 0 0 0 1px #3b82f6;
	}

	.image-element.locked {
		cursor: not-allowed;
		opacity: 0.7;
	}
</style>
