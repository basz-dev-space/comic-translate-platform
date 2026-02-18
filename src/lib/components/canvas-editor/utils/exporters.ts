import type { TextElement } from '../types/elements';

export interface ExportOptions {
	format: 'png' | 'jpg' | 'pdf';
	quality: number;
	background: string;
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
	format: 'png',
	quality: 0.92,
	background: '#ffffff'
};

export function canvasToDataURL(
	canvas: HTMLCanvasElement,
	options: Partial<ExportOptions> = {}
): string {
	const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };

	const mimeType = opts.format === 'jpg' ? 'image/jpeg' : 'image/png';
	return canvas.toDataURL(mimeType, opts.quality);
}

export function downloadDataURL(dataURL: string, filename: string): void {
	const link = document.createElement('a');
	link.download = filename;
	link.href = dataURL;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

export function exportTranslationGrid(elements: TextElement[]): string {
	const headers = [
		'ID',
		'Original',
		'Translated',
		'Status',
		'X',
		'Y',
		'Width',
		'Height',
		'Font',
		'Font Size'
	];
	const rows = elements.map((el) => [
		el.id,
		`"${el.text.originalContent.replace(/"/g, '""')}"`,
		`"${el.text.translatedContent.replace(/"/g, '""')}"`,
		el.text.status,
		el.x.toString(),
		el.y.toString(),
		el.width.toString(),
		el.height.toString(),
		el.text.fontFamily,
		el.text.fontSize.toString()
	]);

	const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

	return csv;
}

export function downloadCSV(csv: string, filename: string): void {
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.download = filename;
	link.href = url;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export function createExportCanvas(
	container: HTMLElement,
	width: number,
	height: number
): HTMLCanvasElement {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	return canvas;
}

export async function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

export async function exportCanvasAsImage(
	canvas: HTMLCanvasElement,
	options: Partial<ExportOptions> = {}
): Promise<Blob> {
	const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };
	const mimeType = opts.format === 'jpg' ? 'image/jpeg' : 'image/png';

	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) {
					resolve(blob);
				} else {
					reject(new Error('Failed to create blob'));
				}
			},
			mimeType,
			opts.quality
		);
	});
}
