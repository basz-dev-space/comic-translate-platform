import { redirect, type RequestHandler } from '@sveltejs/kit';
import { stack } from '$lib/server/stack';
import { setOAuthStateCookie, generateOAuthState } from '$lib/server/auth';

export const GET: RequestHandler = async ({ params, url, cookies }) => {
	const providerId = params.provider;

	if (!providerId) {
		throw redirect(302, '/sign-in?error=Missing OAuth provider');
	}

	const state = generateOAuthState();

	const protocol = url.protocol.replace(':', '') || 'https';
	const host = url.host;
	const redirectUri = `${protocol}://${host}/api/auth/oauth/callback`;

	setOAuthStateCookie(cookies, state);

	const oauthUrl = stack.getOAuthUrl(providerId, redirectUri, state);

	throw redirect(302, oauthUrl);
};
