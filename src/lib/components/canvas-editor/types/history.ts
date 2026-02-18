import type { CanvasElement } from './elements';

export type ActionType = 'create' | 'update' | 'delete' | 'move' | 'reorder' | 'batch';

export interface HistoryAction {
	type: ActionType;
	description: string;
	timestamp: number;
	elementId?: string;
	elementIds?: string[];
	previousState?: CanvasElement | CanvasElement[];
	newState?: CanvasElement | CanvasElement[];
}

export interface HistoryState {
	past: HistoryAction[];
	present: HistoryAction | null;
	future: HistoryAction[];
	maxHistory: number;
}

// Helper function to create history actions
export function createHistoryAction(
	type: ActionType,
	description: string,
	options: {
		elementId?: string;
		elementIds?: string[];
		previousState?: CanvasElement | CanvasElement[];
		newState?: CanvasElement | CanvasElement[];
	} = {}
): HistoryAction {
	return {
		type,
		description,
		timestamp: Date.now(),
		...options
	};
}
