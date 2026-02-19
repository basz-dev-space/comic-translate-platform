import type { CanvasElement } from '../types/elements';

export interface TransformBox {
	x: number;
	y: number;
	width: number;
	height: number;
	rotation: number;
}

export function getBoundingBox(elements: (CanvasElement | undefined)[]): TransformBox | null {
	const validElements = elements.filter((el): el is CanvasElement => el !== undefined);
	if (validElements.length === 0) return null;

	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;

	for (const el of validElements) {
		minX = Math.min(minX, el.x);
		minY = Math.min(minY, el.y);
		maxX = Math.max(maxX, el.x + el.width);
		maxY = Math.max(maxY, el.y + el.height);
	}

	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY,
		rotation: 0
	};
}

export function snapToGrid(value: number, gridSize: number): number {
	return Math.round(value / gridSize) * gridSize;
}

export function constrainAspectRatio(
	newWidth: number,
	newHeight: number,
	aspectRatio: number
): { width: number; height: number } {
	const newAspectRatio = newWidth / newHeight;

	if (newAspectRatio > aspectRatio) {
		return { width: newHeight * aspectRatio, height: newHeight };
	} else {
		return { width: newWidth, height: newWidth / aspectRatio };
	}
}

export function rotatePoint(
	x: number,
	y: number,
	cx: number,
	cy: number,
	angle: number
): { x: number; y: number } {
	const radians = (angle * Math.PI) / 180;
	const cos = Math.cos(radians);
	const sin = Math.sin(radians);

	const nx = cos * (x - cx) - sin * (y - cy) + cx;
	const ny = sin * (x - cx) + cos * (y - cy) + cy;

	return { x: nx, y: ny };
}

export function isPointInRotatedRect(px: number, py: number, box: TransformBox): boolean {
	const cx = box.x + box.width / 2;
	const cy = box.y + box.height / 2;

	const rotated = rotatePoint(px, py, cx, cy, -box.rotation);

	return (
		rotated.x >= box.x &&
		rotated.x <= box.x + box.width &&
		rotated.y >= box.y &&
		rotated.y <= box.y + box.height
	);
}

export function getDistance(x1: number, y1: number, x2: number, y2: number): number {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export function getAngle(cx: number, cy: number, x: number, y: number): number {
	const radians = Math.atan2(y - cy, x - cx);
	return (radians * 180) / Math.PI;
}

export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

export function resizeElement(
	element: CanvasElement,
	handle: string,
	dx: number,
	dy: number,
	shiftKey: boolean
): Partial<CanvasElement> {
	const aspectRatio = element.width / element.height;
	let { x, y, width, height } = element;

	switch (handle) {
		case 'nw':
			x += dx;
			y += dy;
			width -= dx;
			height -= dy;
			break;
		case 'n':
			y += dy;
			height -= dy;
			break;
		case 'ne':
			y += dy;
			width += dx;
			height -= dy;
			break;
		case 'e':
			width += dx;
			break;
		case 'se':
			width += dx;
			height += dy;
			break;
		case 's':
			height += dy;
			break;
		case 'sw':
			x += dx;
			width -= dx;
			height += dy;
			break;
		case 'w':
			x += dx;
			width -= dx;
			break;
	}

	// Maintain aspect ratio if shift is held
	if (shiftKey) {
		const constrained = constrainAspectRatio(width, height, aspectRatio);
		width = constrained.width;
		height = constrained.height;
	}

	// Ensure minimum size
	width = Math.max(20, width);
	height = Math.max(20, height);

	return { x, y, width, height };
}
