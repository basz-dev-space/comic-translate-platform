<script lang="ts">
	import { historyStore, canvasStore } from '../stores';

	function handleUndo() {
		const action = historyStore.undo();
		if (action?.previousState) {
			canvasStore.setState(
				Array.isArray(action.previousState) ? action.previousState : [action.previousState]
			);
		}
	}

	function handleRedo() {
		const action = historyStore.redo();
		if (action?.newState) {
			canvasStore.setState(Array.isArray(action.newState) ? action.newState : [action.newState]);
		}
	}
</script>

<div class="flex items-center gap-1 border-r border-gray-200 pr-2">
	<button
		class="undo-btn"
		onclick={handleUndo}
		disabled={!historyStore.canUndo}
		title="Undo (Ctrl+Z)"
		aria-label="Undo"
	>
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<path d="M3 7v6h6" />
			<path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
		</svg>
	</button>
	<button
		class="undo-btn"
		onclick={handleRedo}
		disabled={!historyStore.canRedo}
		title="Redo (Ctrl+Shift+Z)"
		aria-label="Redo"
	>
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
		>
			<path d="M21 7v6h-6" />
			<path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
		</svg>
	</button>
</div>

<style>
	.undo-btn {
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

	.undo-btn:hover:not(:disabled) {
		background: #f3f4f6;
	}

	.undo-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.undo-btn:focus-visible {
		outline: 2px solid #3b82f6;
		outline-offset: 2px;
	}
</style>
