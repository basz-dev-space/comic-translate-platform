import { json, type RequestHandler } from '@sveltejs/kit';
import { stack } from '$lib/server/stack';
import { signUpSchema } from '$lib/schemas/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const body = await request.json();

		const parseResult = signUpSchema.safeParse(body);

		if (!parseResult.success) {
			return json(
				{
					error: 'Validation failed',
					details: parseResult.error.flatten().fieldErrors
				},
				{ status: 400 }
			);
		}

		const { email, password } = parseResult.data;

		const protocol = request.headers.get('x-forwarded-proto') || 'https';
		const host = request.headers.get('host') || 'localhost:5173';
		const verificationCallbackUrl = `${protocol}://${host}/auth/verify-email`;

		const result = await stack.signUp(email, password, verificationCallbackUrl);

		if (result.error || !result.data) {
			return json({ error: result.error?.message || 'Sign up failed' }, { status: 400 });
		}

		cookies.set('stack_access_token', result.data.session.accessToken, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7
		});

		cookies.set('stack_refresh_token', result.data.session.refreshToken, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 30
		});

		return json({ user: result.data.user });
	} catch (error) {
		console.error('Sign up error:', error);
		return json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
};
