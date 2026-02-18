import type { ToolType } from '../types/tools';

function createSelectionStore() {
	let selectedIds = $state<Set<string>>(new Set());
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
			selectedIds = new Set([id]);
		},

		selectMultiple(ids: string[]) {
			selectedIds = new Set(ids);
		},

		addToSelection(id: string) {
			const newSet = new Set(selectedIds);
			newSet.add(id);
			selectedIds = newSet;
		},

		removeFromSelection(id: string) {
			const newSet = new Set(selectedIds);
			newSet.delete(id);
			selectedIds = newSet;
		},

		toggleSelection(id: string) {
			const newSet = new Set(selectedIds);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			selectedIds = newSet;
		},

		clearSelection() {
			selectedIds = new Set();
		},

		isSelected(id: string) {
			return selectedIds.has(id);
		},

		selectAll(ids: string[]) {
			selectedIds = new Set(ids);
		}
	};
}

export const selectionStore = createSelectionStore();
