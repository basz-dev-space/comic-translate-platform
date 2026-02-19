<script lang="ts">
	import { canvasStore } from '../stores';

	function zoomIn() {
		canvasStore.setZoom(canvasStore.zoom * 1.2);
	}

	function zoomOut() {
		canvasStore.setZoom(canvasStore.zoom / 1.2);
	}

	function resetZoom() {
		canvasStore.setZoom(1);
		canvasStore.setPan(0, 0);
	}
</script>

<div class="flex items-center gap-1">
	<button class="zoom-btn" onclick={zoomOut} title="Zoom out" aria-label="Zoom out">
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
			<line x1="8" y1="11" x2="14" y2="11" />
		</svg>
	</button>
	<span class="min-w-[48px] text-center text-xs text-gray-600">
		{Math.round(canvasStore.zoom * 100)}%
	</span>
	<button class="zoom-btn" onclick={zoomIn} title="Zoom in" aria-label="Zoom in">
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
			<line x1="11" y1="8" x2="11" y2="14" />
			<line x1="8" y1="11" x2="14" y2="11" />
		</svg>
	</button>
	<button class="zoom-btn" onclick={resetZoom} title="Reset zoom" aria-label="Reset zoom">
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
			<path d="M3 3v5h5" />
		</svg>
	</button>
</div>

<style>
	.zoom-btn {
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

	.zoom-btn:hover {
		background: #f3f4f6;
	}

	.zoom-btn:focus-visible {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}
</style>
