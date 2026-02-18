import { json, type RequestHandler } from '@sveltejs/kit';
import { stack } from '$lib/server/stack';
import { getSessionFromCookies, setSessionCookies } from '$lib/server/auth';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const session = getSessionFromCookies(cookies);

		if (!session) {
			return json({ user: null });
		}

		const result = await stack.getUser(session.accessToken);

		if (result.error) {
			const refreshResult = await stack.refreshToken(session.refreshToken);

			if (refreshResult.error || !refreshResult.data) {
				cookies.delete('stack_access_token', { path: '/' });
				cookies.delete('stack_refresh_token', { path: '/' });
				return json({ user: null });
			}

			setSessionCookies(cookies, refreshResult.data);

			const userResult = await stack.getUser(refreshResult.data.accessToken);

			if (userResult.error || !userResult.data) {
				return json({ user: null });
			}

			return json({ user: userResult.data });
		}

		return json({ user: result.data });
	} catch (error) {
		console.error('Session error:', error);
		return json({ user: null });
	}
};
