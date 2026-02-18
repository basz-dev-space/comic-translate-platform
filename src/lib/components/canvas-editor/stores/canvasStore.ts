import type { CanvasElement, TextElement, ImageElement, TextProperties } from '../types/elements';

function generateId(): string {
	return `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createCanvasStore() {
	let elements = $state<CanvasElement[]>([]);
	let zoom = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let width = $state(800);
	let height = $state(600);
	let backgroundImage = $state<string | null>(null);

	return {
		get elements() {
			return elements;
		},
		get zoom() {
			return zoom;
		},
		get panX() {
			return panX;
		},
		get panY() {
			return panY;
		},
		get width() {
			return width;
		},
		get height() {
			return height;
		},
		get backgroundImage() {
			return backgroundImage;
		},
		get sortedElements() {
			return [...elements].sort((a, b) => a.zIndex - b.zIndex);
		},

		setDimensions(w: number, h: number) {
			width = w;
			height = h;
		},

		setZoom(newZoom: number) {
			zoom = Math.max(0.1, Math.min(5, newZoom));
		},

		setPan(x: number, y: number) {
			panX = x;
			panY = y;
		},

		setBackgroundImage(src: string | null) {
			backgroundImage = src;
		},

		addElement(element: Omit<CanvasElement, 'id' | 'zIndex'>) {
			const newElement = {
				...element,
				id: generateId(),
				zIndex: elements.length
			} as CanvasElement;
			elements = [...elements, newElement];
			return newElement;
		},

		addTextElement(options: {
			x: number;
			y: number;
			width: number;
			height: number;
			content: string;
			originalContent?: string;
		}): TextElement {
			const textProps: TextProperties = {
				content: options.content,
				originalContent: options.originalContent || options.content,
				translatedContent: '',
				fontFamily: 'Arial',
				fontSize: 16,
				fontWeight: 'normal',
				fontStyle: 'normal',
				textAlign: 'center',
				verticalAlign: 'middle',
				fill: '#000000',
				stroke: '',
				strokeWidth: 0,
				lineHeight: 1.2,
				status: 'pending'
			};

			const newElement: TextElement = {
				id: generateId(),
				type: 'text',
				x: options.x,
				y: options.y,
				width: options.width,
				height: options.height,
				rotation: 0,
				opacity: 1,
				visible: true,
				locked: false,
				zIndex: elements.length,
				text: textProps
			};

			elements = [...elements, newElement];
			return newElement;
		},

		updateElement(id: string, updates: Partial<CanvasElement>) {
			elements = elements.map((el) =>
				el.id === id ? ({ ...el, ...updates } as CanvasElement) : el
			);
		},

		updateTextElement(id: string, textUpdates: Partial<TextProperties>) {
			elements = elements.map((el) => {
				if (el.id === id && el.type === 'text') {
					return {
						...el,
						text: { ...el.text, ...textUpdates }
					} as TextElement;
				}
				return el;
			});
		},

		deleteElement(id: string) {
			elements = elements.filter((el) => el.id !== id);
		},

		deleteElements(ids: string[]) {
			elements = elements.filter((el) => !ids.includes(el.id));
		},

		reorderElement(id: string, newZIndex: number) {
			const element = elements.find((el) => el.id === id);
			if (!element) return;

			const filtered = elements.filter((el) => el.id !== id);
			const reordered = [
				...filtered.slice(0, newZIndex),
				{ ...element, zIndex: newZIndex },
				...filtered.slice(newZIndex)
			];
			elements = reordered.map((el, idx) => ({ ...el, zIndex: idx }));
		},

		bringToFront(id: string) {
			const element = elements.find((el) => el.id === id);
			if (!element) return;
			const filtered = elements.filter((el) => el.id !== id);
			elements = [...filtered, { ...element, zIndex: filtered.length }];
		},

		sendToBack(id: string) {
			const element = elements.find((el) => el.id === id);
			if (!element) return;
			const filtered = elements.filter((el) => el.id !== id);
			elements = [{ ...element, zIndex: 0 }, ...filtered.map((el, i) => ({ ...el, zIndex: i + 1 }))];
		},

		getElement(id: string) {
			return elements.find((el) => el.id === id);
		},

		getElementsByIds(ids: string[]) {
			return elements.filter((el) => ids.includes(el.id));
		},

		setElements(newElements: CanvasElement[]) {
			elements = newElements;
		},

		clearElements() {
			elements = [];
		},

		// For undo/redo support
		getState(): CanvasElement[] {
			return JSON.parse(JSON.stringify(elements));
		},

		setState(state: CanvasElement[]) {
			elements = state;
		}
	};
}

export const canvasStore = createCanvasStore();
