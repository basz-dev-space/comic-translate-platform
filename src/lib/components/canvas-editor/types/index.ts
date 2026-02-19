export * from './elements';
export * from './history';
export * from './tools';

export interface Page {
	id: number;
	chapterId: number;
	pageNumber: number;
	imageUrl: string;
	width: number;
	height: number;
	ocrStatus: string;
}
