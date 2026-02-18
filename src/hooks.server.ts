import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { sessionHooks, type EventHandler } from '@kinde-oss/kinde-auth-sveltekit';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleKinde: Handle = async ({ event, resolve }) => {
	await sessionHooks({ event: event as EventHandler });
	return resolve(event);
};

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const handle: Handle = sequence(handleKinde, handleParaglide);
