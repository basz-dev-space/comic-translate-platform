<script lang="ts">
	import { canvasStore, selectionStore } from '../stores';
	import { getBoundingBox } from '../utils/transformers';

	const selectedElements = $derived(
		selectionStore.selectedIdsArray.map((id) => canvasStore.getElement(id)).filter(Boolean)
	);

	const boundingBox = $derived(getBoundingBox(selectedElements));

	const handlePositions = [
		{ name: 'nw', cursor: 'nwse-resize', x: 0, y: 0 },
		{ name: 'n', cursor: 'ns-resize', x: 0.5, y: 0 },
		{ name: 'ne', cursor: 'nesw-resize', x: 1, y: 0 },
		{ name: 'e', cursor: 'ew-resize', x: 1, y: 0.5 },
		{ name: 'se', cursor: 'nwse-resize', x: 1, y: 1 },
		{ name: 's', cursor: 'ns-resize', x: 0.5, y: 1 },
		{ name: 'sw', cursor: 'nesw-resize', x: 0, y: 1 },
		{ name: 'w', cursor: 'ew-resize', x: 0, y: 0.5 }
	];

	let isDragging = $state(false);
	let isRotating = $state(false);
	let activeHandle = $state<string | null>(null);
	let startPos = $state({ x: 0, y: 0, width: 0, height: 0, rotation: 0 });
	let startMouse = $state({ x: 0, y: 0 });

	function startResize(handle: string, e: MouseEvent) {
		e.stopPropagation();
		if (!boundingBox) return;

		isDragging = true;
		activeHandle = handle;
		startPos = {
			x: boundingBox.x,
			y: boundingBox.y,
			width: boundingBox.width,
			height: boundingBox.height,
			rotation: 0
		};
		startMouse = { x: e.clientX, y: e.clientY };
	}

	function startRotate(e: MouseEvent) {
		e.stopPropagation();
		if (!boundingBox || selectedElements.length !== 1) return;

		isRotating = true;
		const el = selectedElements[0];
		if (!el) return;

		startPos = {
			x: boundingBox.x,
			y: boundingBox.y,
			width: boundingBox.width,
			height: boundingBox.height,
			rotation: el.rotation
		};

		const centerX = boundingBox.x + boundingBox.width / 2;
		const centerY = boundingBox.y - 30;
		startMouse = { x: centerX, y: centerY };
	}

	function handleMouseMove(e: MouseEvent) {
		if (isRotating && selectedElements.length === 1) {
			const el = selectedElements[0];
			if (!el) return;

			const centerX = startPos.x + startPos.width / 2;
			const centerY = startPos.y + startPos.height / 2;

			const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
			const degrees = (angle * 180) / Math.PI + 90;

			canvasStore.updateElement(el.id, { rotation: degrees });
			return;
		}

		if (!isDragging || !boundingBox || !activeHandle) return;

		const dx = e.clientX - startMouse.x;
		const dy = e.clientY - startMouse.y;

		// Calculate new dimensions based on handle
		let newX = startPos.x;
		let newY = startPos.y;
		let newWidth = startPos.width;
		let newHeight = startPos.height;

		if (activeHandle.includes('e')) newWidth += dx;
		if (activeHandle.includes('w')) {
			newX += dx;
			newWidth -= dx;
		}
		if (activeHandle.includes('s')) newHeight += dy;
		if (activeHandle.includes('n')) {
			newY += dy;
			newHeight -= dy;
		}

		// Ensure minimum size
		newWidth = Math.max(20, newWidth);
		newHeight = Math.max(20, newHeight);

		// Update all selected elements proportionally
		const scaleX = newWidth / startPos.width;
		const scaleY = newHeight / startPos.height;

		for (const el of selectedElements) {
			if (!el) continue;
			const relX = (el.x - startPos.x) / startPos.width;
			const relY = (el.y - startPos.y) / startPos.height;

			canvasStore.updateElement(el.id, {
				x: newX + relX * newWidth,
				y: newY + relY * newHeight,
				width: el.width * scaleX,
				height: el.height * scaleY
			});
		}
	}

	function handleMouseUp() {
		isDragging = false;
		isRotating = false;
		activeHandle = null;
	}
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} />

{#if boundingBox}
	<div
		class="transform-controls pointer-events-none absolute"
		style="
			left: {boundingBox.x}px;
			top: {boundingBox.y}px;
			width: {boundingBox.width}px;
			height: {boundingBox.height}px;
		"
	>
		<!-- Resize handles -->
		{#each handlePositions as handle (handle.name)}
			<div
				class="resize-handle pointer-events-auto"
				style="
					left: {handle.x * 100}%;
					top: {handle.y * 100}%;
					cursor: {handle.cursor};
				"
				onmousedown={(e) => startResize(handle.name, e)}
				role="button"
				aria-label="Resize {handle.name}"
				tabindex="0"
			></div>
		{/each}

		<!-- Rotation handle -->
		<div
			class="rotation-handle pointer-events-auto"
			style="left: 50%; top: -30px;"
			onmousedown={startRotate}
			role="button"
			aria-label="Rotate"
			tabindex="0"
		>
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
				<path d="M21 3v5h-5" />
			</svg>
		</div>

		<!-- Rotation line -->
		<div class="rotation-line" style="left: 50%; top: -30px;"></div>
	</div>
{/if}

<style>
	.transform-controls {
		border: 2px solid #3b82f6;
		box-sizing: border-box;
	}

	.resize-handle {
		position: absolute;
		width: 10px;
		height: 10px;
		background: white;
		border: 2px solid #3b82f6;
		border-radius: 2px;
		transform: translate(-50%, -50%);
		transition: transform 0.1s ease;
	}

	.resize-handle:hover {
		transform: translate(-50%, -50%) scale(1.2);
	}

	.resize-handle:focus-visible {
		outline: 2px solid #2563eb;
		outline-offset: 2px;
	}

	.rotation-handle {
		position: absolute;
		width: 24px;
		height: 24px;
		background: white;
		border: 2px solid #3b82f6;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: grab;
		transform: translateX(-50%);
		color: #3b82f6;
	}

	.rotation-handle:hover {
		background: #eff6ff;
	}

	.rotation-handle:active {
		cursor: grabbing;
	}

	.rotation-handle:focus-visible {
		outline: 2px solid #2563eb;
		outline-offset: 2px;
	}

	.rotation-line {
		position: absolute;
		width: 1px;
		height: 20px;
		background: #3b82f6;
		transform: translateX(-50%);
	}
</style>
