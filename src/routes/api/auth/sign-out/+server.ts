import { json, type RequestHandler } from '@sveltejs/kit';
import { stack } from '$lib/server/stack';
import { getSessionFromCookies } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		const session = getSessionFromCookies(cookies);

		if (session?.accessToken) {
			await stack.signOut(session.accessToken);
		}

		cookies.delete('stack_access_token', { path: '/' });
		cookies.delete('stack_refresh_token', { path: '/' });

		return json({ success: true });
	} catch {
		cookies.delete('stack_access_token', { path: '/' });
		cookies.delete('stack_refresh_token', { path: '/' });

		return json({ success: true });
	}
};
