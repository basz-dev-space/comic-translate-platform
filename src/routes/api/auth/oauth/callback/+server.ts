import { redirect, type RequestHandler } from '@sveltejs/kit';
import { stack } from '$lib/server/stack';
import { getOAuthStateCookie, clearOAuthStateCookie, setSessionCookies } from '$lib/server/auth';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const error = url.searchParams.get('error');
	const errorDescription = url.searchParams.get('error_description');

	if (error) {
		console.error('OAuth error:', error, errorDescription);
		throw redirect(302, `/sign-in?error=${encodeURIComponent(errorDescription || error)}`);
	}

	if (!code || !state) {
		throw redirect(302, '/sign-in?error=Missing authorization code or state');
	}

	const storedState = getOAuthStateCookie(cookies);

	if (!storedState || storedState !== state) {
		throw redirect(302, '/sign-in?error=Invalid state parameter');
	}

	clearOAuthStateCookie(cookies);

	const protocol = url.protocol.replace(':', '') || 'https';
	const host = url.host;
	const redirectUri = `${protocol}://${host}/api/auth/oauth/callback`;

	const result = await stack.exchangeOAuthCode(code, redirectUri);

	if (result.error || !result.data) {
		console.error('OAuth exchange error:', result.error);
		throw redirect(
			302,
			`/sign-in?error=${encodeURIComponent(result.error?.message || 'OAuth authentication failed')}`
		);
	}

	setSessionCookies(cookies, result.data.session);

	throw redirect(302, '/');
};
