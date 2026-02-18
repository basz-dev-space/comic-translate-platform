import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { authenticateRequest } from '$lib/server/auth';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleAuth: Handle = async ({ event, resolve }) => {
	event.locals.user = await authenticateRequest(event.cookies);
	return resolve(event);
};

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const handle: Handle = sequence(handleAuth, handleParaglide);
