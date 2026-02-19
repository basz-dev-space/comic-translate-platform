<script lang="ts">
	import { onMount } from 'svelte';
	import { canvasStore, selectionStore, settingsStore } from '../stores';
	import TextElement from './TextElement.svelte';
	import ImageElement from './ImageElement.svelte';
	import TransformControls from './TransformControls.svelte';

	interface Props {
		width?: number;
		height?: number;
		backgroundImage?: string;
	}

	let { width = 800, height = 600, backgroundImage }: Props = $props();

	let container: HTMLDivElement;
	let isPanning = $state(false);
	let lastPanPoint = $state({ x: 0, y: 0 });

	onMount(() => {
		canvasStore.setDimensions(width, height);
		if (backgroundImage) {
			canvasStore.setBackgroundImage(backgroundImage);
		}
	});

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		const scaleBy = 1.1;
		const newZoom = e.deltaY < 0 ? canvasStore.zoom * scaleBy : canvasStore.zoom / scaleBy;
		canvasStore.setZoom(newZoom);
	}

	function handleMouseDown(e: MouseEvent) {
		if (selectionStore.activeTool === 'pan') {
			isPanning = true;
			lastPanPoint = { x: e.clientX, y: e.clientY };
			container.style.cursor = 'grabbing';
		} else if (e.target === container) {
			selectionStore.clearSelection();
		}
	}

	function handleMouseMove(e: MouseEvent) {
		if (isPanning) {
			const dx = e.clientX - lastPanPoint.x;
			const dy = e.clientY - lastPanPoint.y;
			canvasStore.setPan(canvasStore.panX + dx, canvasStore.panY + dy);
			lastPanPoint = { x: e.clientX, y: e.clientY };
		}
	}

	function handleMouseUp() {
		isPanning = false;
		if (selectionStore.activeTool === 'pan') {
			container.style.cursor = 'grab';
		}
	}

	const sortedElements = $derived(canvasStore.sortedElements);
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="canvas-container relative overflow-hidden rounded-lg border border-gray-300 bg-gray-100"
	bind:this={container}
	style="width: {width}px; height: {height}px;"
	onwheel={handleWheel}
	onmousedown={handleMouseDown}
	role="application"
	aria-label="Canvas editor"
	tabindex="0"
>
	<!-- Background Image -->
	{#if backgroundImage || canvasStore.backgroundImage}
		<img
			src={backgroundImage || canvasStore.backgroundImage || ''}
			alt="Background"
			class="pointer-events-none absolute inset-0 h-full w-full object-contain"
		/>
	{/if}

	<!-- Canvas Elements Layer -->
	<div
		class="elements-layer absolute inset-0"
		style="transform: translate({canvasStore.panX}px, {canvasStore.panY}px) scale({canvasStore.zoom}); transform-origin: 0 0;"
	>
		{#each sortedElements as element (element.id)}
			{#if element.visible}
				{#if element.type === 'text'}
					<TextElement {element} />
				{:else if element.type === 'image'}
					<ImageElement {element} />
				{/if}
			{/if}
		{/each}

		<!-- Transform Controls for Selected Elements -->
		{#if selectionStore.hasSelection}
			<TransformControls />
		{/if}
	</div>

	<!-- Grid Overlay (optional) -->
	{#if settingsStore.settings.showGuides}
		<div class="grid-overlay pointer-events-none absolute inset-0 opacity-20">
			<!-- Grid lines would be rendered here -->
		</div>
	{/if}
</div>

<style>
	.canvas-container:focus {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}

	.elements-layer {
		will-change: transform;
	}

	.grid-overlay {
		background-image:
			linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
		background-size: 20px 20px;
	}
</style>
