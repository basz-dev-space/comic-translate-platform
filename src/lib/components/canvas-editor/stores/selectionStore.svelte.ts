import { SvelteSet } from 'svelte/reactivity';
import type { ToolType } from '../types/tools';

function createSelectionStore() {
	let selectedIds = new SvelteSet<string>();
	let activeTool = $state<ToolType>('select');

	return {
		get selectedIds() {
			return selectedIds;
		},
		get selectedIdsArray() {
			return Array.from(selectedIds);
		},
		get activeTool() {
			return activeTool;
		},
		get hasSelection() {
			return selectedIds.size > 0;
		},
		get isMultiSelect() {
			return selectedIds.size > 1;
		},
		get singleSelectedId() {
			if (selectedIds.size === 1) {
				return Array.from(selectedIds)[0];
			}
			return null;
		},

		setActiveTool(tool: ToolType) {
			activeTool = tool;
		},

		select(id: string) {
			selectedIds = new SvelteSet([id]);
		},

		selectMultiple(ids: string[]) {
			selectedIds = new SvelteSet(ids);
		},

		addToSelection(id: string) {
			selectedIds.add(id);
		},

		removeFromSelection(id: string) {
			selectedIds.delete(id);
		},

		toggleSelection(id: string) {
			if (selectedIds.has(id)) {
				selectedIds.delete(id);
			} else {
				selectedIds.add(id);
			}
		},

		clearSelection() {
			selectedIds = new SvelteSet();
		},

		isSelected(id: string) {
			return selectedIds.has(id);
		},

		selectAll(ids: string[]) {
			selectedIds = new SvelteSet(ids);
		}
	};
}

export const selectionStore = createSelectionStore();
