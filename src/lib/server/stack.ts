import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

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

const API_BASE = 'https://api.stack-auth.com/api/v1';

interface StackConfig {
	projectId: string;
	publishableClientKey: string;
	secretServerKey: string;
}

function getConfig(): StackConfig {
	const projectId = publicEnv.PUBLIC_STACK_PROJECT_ID || env.STACK_PROJECT_ID;
	const publishableClientKey =
		publicEnv.PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || env.STACK_PUBLISHABLE_CLIENT_KEY;
	const secretServerKey = env.STACK_SECRET_SERVER_KEY;

	if (!projectId || !publishableClientKey || !secretServerKey) {
		throw new Error(
			'Missing Stack Auth configuration. Please set PUBLIC_STACK_PROJECT_ID, PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY, and STACK_SECRET_SERVER_KEY'
		);
	}

	return { projectId, publishableClientKey, secretServerKey };
}

interface StackResponse<T> {
	data?: T;
	error?: {
		message: string;
		code?: string;
	};
}

async function clientFetch<T>(
	endpoint: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		body?: Record<string, unknown>;
		accessToken?: string;
	} = {}
): Promise<StackResponse<T>> {
	const config = getConfig();
	const { method = 'GET', body, accessToken } = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'X-Stack-Access-Type': 'client',
		'X-Stack-Project-Id': config.projectId,
		'X-Stack-Publishable-Client-Key': config.publishableClientKey
	};

	if (accessToken) {
		headers['X-Stack-Access-Token'] = accessToken;
	}

	try {
		const response = await fetch(`${API_BASE}${endpoint}`, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				error: {
					message: data.message || data.error || 'An error occurred',
					code: data.code
				}
			};
		}

		return { data };
	} catch (error) {
		return {
			error: {
				message: error instanceof Error ? error.message : 'Network error'
			}
		};
	}
}

async function serverFetch<T>(
	endpoint: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		body?: Record<string, unknown>;
		accessToken?: string;
	} = {}
): Promise<StackResponse<T>> {
	const config = getConfig();
	const { method = 'GET', body, accessToken } = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		'X-Stack-Access-Type': 'server',
		'X-Stack-Project-Id': config.projectId,
		'X-Stack-Secret-Server-Key': config.secretServerKey
	};

	if (accessToken) {
		headers['X-Stack-Access-Token'] = accessToken;
	}

	try {
		const response = await fetch(`${API_BASE}${endpoint}`, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				error: {
					message: data.message || data.error || 'An error occurred',
					code: data.code
				}
			};
		}

		return { data };
	} catch (error) {
		return {
			error: {
				message: error instanceof Error ? error.message : 'Network error'
			}
		};
	}
}

interface SignUpResponse {
	access_token: string;
	refresh_token: string;
	user_id: string;
}

interface SignInResponse {
	access_token: string;
	refresh_token: string;
	user_id: string;
}

interface UserResponse {
	id: string;
	primary_email: string;
	display_name: string | null;
	profile_image_url: string | null;
	primary_email_auth_enabled: boolean;
}

interface OAuthProviderResponse {
	id: string;
	name: string;
}

function mapUser(user: UserResponse): AuthUser {
	return {
		id: user.id,
		email: user.primary_email,
		displayName: user.display_name,
		profileImageUrl: user.profile_image_url,
		primaryEmailAuthEnabled: user.primary_email_auth_enabled
	};
}

export const stack = {
	async signUp(
		email: string,
		password: string,
		verificationCallbackUrl: string
	): Promise<StackResponse<{ session: AuthSession; user: AuthUser }>> {
		const result = await clientFetch<SignUpResponse>('/auth/password/sign-up', {
			method: 'POST',
			body: {
				email,
				password,
				verification_callback_url: verificationCallbackUrl
			}
		});

		if (result.error || !result.data) {
			return { error: result.error };
		}

		const userResult = await this.getUser(result.data.access_token);

		if (userResult.error || !userResult.data) {
			return { error: userResult.error };
		}

		return {
			data: {
				session: {
					accessToken: result.data.access_token,
					refreshToken: result.data.refresh_token,
					expiresAt: Date.now() + 3600 * 1000
				},
				user: userResult.data
			}
		};
	},

	async signIn(
		email: string,
		password: string
	): Promise<StackResponse<{ session: AuthSession; user: AuthUser }>> {
		const result = await clientFetch<SignInResponse>('/auth/password/sign-in', {
			method: 'POST',
			body: {
				email,
				password
			}
		});

		if (result.error || !result.data) {
			return { error: result.error };
		}

		const userResult = await this.getUser(result.data.access_token);

		if (userResult.error || !userResult.data) {
			return { error: userResult.error };
		}

		return {
			data: {
				session: {
					accessToken: result.data.access_token,
					refreshToken: result.data.refresh_token,
					expiresAt: Date.now() + 3600 * 1000
				},
				user: userResult.data
			}
		};
	},

	async getUser(accessToken: string): Promise<StackResponse<AuthUser>> {
		const result = await clientFetch<UserResponse>('/users/me', {
			accessToken
		});

		if (result.error || !result.data) {
			return { error: result.error };
		}

		return { data: mapUser(result.data) };
	},

	async signOut(accessToken: string): Promise<StackResponse<void>> {
		return serverFetch<void>('/auth/sign-out', {
			method: 'POST',
			accessToken
		});
	},

	async getOAuthProviders(): Promise<StackResponse<OAuthProviderResponse[]>> {
		return clientFetch<OAuthProviderResponse[]>('/oauth/providers');
	},

	getOAuthUrl(providerId: string, redirectUri: string, state: string): string {
		const config = getConfig();
		const params = new URLSearchParams({
			client_id: config.projectId,
			redirect_uri: redirectUri,
			response_type: 'code',
			state,
			provider_id: providerId
		});
		return `${API_BASE}/oauth/authorize?${params.toString()}`;
	},

	async exchangeOAuthCode(
		code: string,
		redirectUri: string
	): Promise<StackResponse<{ session: AuthSession; user: AuthUser }>> {
		const config = getConfig();

		const response = await fetch(`${API_BASE}/oauth/token`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Stack-Access-Type': 'client',
				'X-Stack-Project-Id': config.projectId,
				'X-Stack-Publishable-Client-Key': config.publishableClientKey
			},
			body: JSON.stringify({
				code,
				redirect_uri: redirectUri,
				grant_type: 'authorization_code'
			})
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				error: {
					message: data.message || data.error || 'OAuth exchange failed',
					code: data.code
				}
			};
		}

		const userResult = await this.getUser(data.access_token);

		if (userResult.error || !userResult.data) {
			return { error: userResult.error };
		}

		return {
			data: {
				session: {
					accessToken: data.access_token,
					refreshToken: data.refresh_token,
					expiresAt: Date.now() + 3600 * 1000
				},
				user: userResult.data
			}
		};
	},

	async refreshToken(refreshToken: string): Promise<StackResponse<AuthSession>> {
		const config = getConfig();

		const response = await fetch(`${API_BASE}/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Stack-Access-Type': 'client',
				'X-Stack-Project-Id': config.projectId,
				'X-Stack-Publishable-Client-Key': config.publishableClientKey
			},
			body: JSON.stringify({
				refresh_token: refreshToken,
				grant_type: 'refresh_token'
			})
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				error: {
					message: data.message || data.error || 'Token refresh failed',
					code: data.code
				}
			};
		}

		return {
			data: {
				accessToken: data.access_token,
				refreshToken: data.refresh_token || refreshToken,
				expiresAt: Date.now() + 3600 * 1000
			}
		};
	}
};

export type { StackConfig, StackResponse };
