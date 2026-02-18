export type ElementType = 'text' | 'image' | 'shape';
export type TextAlignment = 'left' | 'center' | 'right';
export type VerticalAlignment = 'top' | 'middle' | 'bottom';
export type TranslationStatus = 'pending' | 'translated' | 'reviewed';

export interface BaseElement {
	id: string;
	type: ElementType;
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
	opacity: number;
	visible: boolean;
	locked: boolean;
	zIndex: number;
}

export interface TextProperties {
	content: string;
	originalContent: string;
	translatedContent: string;
	fontFamily: string;
	fontSize: number;
	fontWeight: string;
	fontStyle: string;
	textAlign: TextAlignment;
	verticalAlign: VerticalAlignment;
	fill: string;
	stroke: string;
	strokeWidth: number;
	lineHeight: number;
	status: TranslationStatus;
}

export interface TextElement extends BaseElement {
	type: 'text';
	text: TextProperties;
}

export interface ImageProperties {
	src: string;
	naturalWidth: number;
	naturalHeight: number;
}

export interface ImageElement extends BaseElement {
	type: 'image';
	image: ImageProperties;
}

export interface ShapeProperties {
	shapeType: 'rectangle' | 'ellipse' | 'line' | 'arrow';
	fill: string;
	stroke: string;
	strokeWidth: number;
	cornerRadius: number;
}

export interface ShapeElement extends BaseElement {
	type: 'shape';
	shape: ShapeProperties;
}

export type CanvasElement = TextElement | ImageElement | ShapeElement;

export interface CanvasState {
	elements: CanvasElement[];
	selectedIds: string[];
	zoom: number;
	panX: number;
	panY: number;
	width: number;
	height: number;
}

// Helper functions for type guards
export function isTextElement(element: CanvasElement): element is TextElement {
	return element.type === 'text';
}

export function isImageElement(element: CanvasElement): element is ImageElement {
	return element.type === 'image';
}

export function isShapeElement(element: CanvasElement): element is ShapeElement {
	return element.type === 'shape';
}
