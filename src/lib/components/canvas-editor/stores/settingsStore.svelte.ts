import type { EditorSettings } from '../types/tools';
import { DEFAULT_SETTINGS } from '../types/tools';

function createSettingsStore() {
	let settings = $state<EditorSettings>({ ...DEFAULT_SETTINGS });

	return {
		get settings() {
			return settings;
		},

		update(updates: Partial<EditorSettings>) {
			settings = { ...settings, ...updates };
		},

		reset() {
			settings = { ...DEFAULT_SETTINGS };
		},

		toggleSnapToGrid() {
			settings = { ...settings, snapToGrid: !settings.snapToGrid };
		},

		toggleGuides() {
			settings = { ...settings, showGuides: !settings.showGuides };
		},

		toggleRulers() {
			settings = { ...settings, showRulers: !settings.showRulers };
		},

		setGridSize(size: number) {
			settings = { ...settings, gridSize: Math.max(5, Math.min(100, size)) };
		},

		setTheme(theme: 'light' | 'dark') {
			settings = { ...settings, theme };
		}
	};
}

export const settingsStore = createSettingsStore();
