declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
		}
		interface Locals {
			user: AuthUser | null;
		}
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface PageData {}
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface PageState {}
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface Platform {}
	}
}

export interface AuthUser {
	id: string;
	email: string;
	displayName: string | null;
	profileImageUrl: string | null;
	primaryEmailAuthEnabled: boolean;
}

export interface AuthSession {
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
}

export interface OAuthProvider {
	id: string;
	name: string;
	icon: string;
}

export {};
