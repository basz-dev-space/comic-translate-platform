import { kindeAuthClient, type SessionManager } from '@kinde-oss/kinde-auth-sveltekit';
import { error, type RequestEvent } from '@sveltejs/kit';

export const requireUser = async (event: RequestEvent) => {
	const user = await kindeAuthClient.getUser(event.request as unknown as SessionManager);

	if (!user?.id) {
		throw error(401, 'Unauthorized');
	}

	return user;
};
