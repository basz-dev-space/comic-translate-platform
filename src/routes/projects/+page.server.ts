import { fail } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { chapter, project } from '$lib/server/db/schema';
import { requireUser } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await requireUser(event);
	const projects = await db
		.select()
		.from(project)
		.where(eq(project.userId, user.id))
		.orderBy(desc(project.createdAt));

	return { projects };
};

export const actions: Actions = {
	create: async (event) => {
		const user = await requireUser(event);
		const formData = await event.request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const description = String(formData.get('description') ?? '').trim();

		if (!name) {
			return fail(400, { error: 'Project name is required.' });
		}

		await db.insert(project).values({ userId: user.id, name, description: description || null });
		return { success: true };
	},

	delete: async (event) => {
		const user = await requireUser(event);
		const formData = await event.request.formData();
		const id = Number(formData.get('id'));

		if (Number.isNaN(id)) {
			return fail(400, { error: 'Project id is invalid.' });
		}

		await db.delete(chapter).where(and(eq(chapter.projectId, id), eq(chapter.userId, user.id)));
		await db.delete(project).where(and(eq(project.id, id), eq(project.userId, user.id)));
		return { success: true };
	}
};
