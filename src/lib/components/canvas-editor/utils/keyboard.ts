export interface KeyboardShortcut {
	key: string;
	ctrl?: boolean;
	shift?: boolean;
	alt?: boolean;
	action: () => void;
	description: string;
}

export function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
	const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
	const ctrlMatch = !!shortcut.ctrl === (event.ctrlKey || event.metaKey);
	const shiftMatch = !!shortcut.shift === event.shiftKey;
	const altMatch = !!shortcut.alt === event.altKey;

	return keyMatch && ctrlMatch && shiftMatch && altMatch;
}

export function formatShortcut(shortcut: Omit<KeyboardShortcut, 'action'>): string {
	const parts: string[] = [];

	if (shortcut.ctrl) {
		parts.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
	}
	if (shortcut.shift) {
		parts.push('Shift');
	}
	if (shortcut.alt) {
		parts.push(navigator.platform.includes('Mac') ? '⌥' : 'Alt');
	}
	parts.push(shortcut.key.toUpperCase());

	return parts.join('+');
}

export const DEFAULT_SHORTCUTS: Omit<KeyboardShortcut, 'action'>[] = [
	{ key: 'v', description: 'Selection tool' },
	{ key: 't', description: 'Text tool' },
	{ key: 'h', description: 'Pan tool' },
	{ key: 'z', description: 'Zoom tool' },
	{ key: 'Delete', description: 'Delete selected' },
	{ key: 'Backspace', description: 'Delete selected' },
	{ key: 'z', ctrl: true, description: 'Undo' },
	{ key: 'y', ctrl: true, description: 'Redo' },
	{ key: 'z', ctrl: true, shift: true, description: 'Redo' },
	{ key: 'c', ctrl: true, description: 'Copy' },
	{ key: 'v', ctrl: true, description: 'Paste' },
	{ key: 'd', ctrl: true, description: 'Duplicate' },
	{ key: 'a', ctrl: true, description: 'Select all' },
	{ key: '=', ctrl: true, description: 'Zoom in' },
	{ key: '-', ctrl: true, description: 'Zoom out' },
	{ key: '0', ctrl: true, description: 'Fit to screen' },
	{ key: ']', ctrl: true, description: 'Bring forward' },
	{ key: '[', ctrl: true, description: 'Send backward' },
	{ key: ']', ctrl: true, shift: true, description: 'Bring to front' },
	{ key: '[', ctrl: true, shift: true, description: 'Send to back' },
	{ key: 'ArrowUp', description: 'Move up' },
	{ key: 'ArrowDown', description: 'Move down' },
	{ key: 'ArrowLeft', description: 'Move left' },
	{ key: 'ArrowRight', description: 'Move right' },
	{ key: 'ArrowUp', shift: true, description: 'Move up 10px' },
	{ key: 'ArrowDown', shift: true, description: 'Move down 10px' },
	{ key: 'ArrowLeft', shift: true, description: 'Move left 10px' },
	{ key: 'ArrowRight', shift: true, description: 'Move right 10px' }
];

export function createShortcutHandler(
	shortcuts: KeyboardShortcut[],
	preventDefault: boolean = true
): (event: KeyboardEvent) => void {
	return (event: KeyboardEvent) => {
		for (const shortcut of shortcuts) {
			if (matchesShortcut(event, shortcut)) {
				if (preventDefault) {
					event.preventDefault();
				}
				shortcut.action();
				return;
			}
		}
	};
}
