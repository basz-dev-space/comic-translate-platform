import type { HistoryAction } from '../types/history';

function createHistoryStore() {
	let past = $state<HistoryAction[]>([]);
	let future = $state<HistoryAction[]>([]);
	const maxHistory = 50;

	return {
		get canUndo() {
			return past.length > 0;
		},
		get canRedo() {
			return future.length > 0;
		},
		get historyLength() {
			return past.length;
		},
		get pastActions() {
			return [...past];
		},
		get futureActions() {
			return [...future];
		},

		push(action: HistoryAction) {
			past = [...past, action].slice(-maxHistory);
			future = [];
		},

		undo(): HistoryAction | undefined {
			if (past.length === 0) return undefined;
			const action = past[past.length - 1];
			past = past.slice(0, -1);
			future = [action, ...future];
			return action;
		},

		redo(): HistoryAction | undefined {
			if (future.length === 0) return undefined;
			const action = future[0];
			future = future.slice(1);
			past = [...past, action];
			return action;
		},

		clear() {
			past = [];
			future = [];
		},

		getHistory() {
			return [...past];
		},

		jumpTo(index: number): HistoryAction | undefined {
			if (index < 0 || index >= past.length) return undefined;

			// Move actions between past and future
			const targetAction = past[index];
			const newPast = past.slice(0, index);
			const newFuture = [...past.slice(index + 1), ...future];

			past = newPast;
			future = [targetAction, ...newFuture];

			return targetAction;
		}
	};
}

export const historyStore = createHistoryStore();
