import { fail } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { chapter, project } from '$lib/server/db/schema';
import { requireUser } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const user = await requireUser(event);
	const [chapters, projects] = await Promise.all([
		db.select().from(chapter).where(eq(chapter.userId, user.id)).orderBy(desc(chapter.createdAt)),
		db.select().from(project).where(eq(project.userId, user.id)).orderBy(desc(project.createdAt))
	]);

	return { chapters, projects };
};

export const actions: Actions = {
	create: async (event) => {
		const user = await requireUser(event);
		const formData = await event.request.formData();
		const projectId = Number(formData.get('projectId'));
		const title = String(formData.get('title') ?? '').trim();
		const chapterNumber = Number(formData.get('chapterNumber') ?? 1);
		const status = String(formData.get('status') ?? 'draft').trim() || 'draft';

		if (Number.isNaN(projectId)) return fail(400, { error: 'Project is required.' });
		if (!title) return fail(400, { error: 'Chapter title is required.' });
		if (Number.isNaN(chapterNumber) || chapterNumber < 1) {
			return fail(400, { error: 'Chapter number must be greater than 0.' });
		}

		const selectedProject = await db.query.project.findFirst({
			where: and(eq(project.id, projectId), eq(project.userId, user.id))
		});

		if (!selectedProject) return fail(404, { error: 'Project not found.' });

		await db.insert(chapter).values({ userId: user.id, projectId, title, chapterNumber, status });
		return { success: true };
	},

	delete: async (event) => {
		const user = await requireUser(event);
		const formData = await event.request.formData();
		const id = Number(formData.get('id'));

		if (Number.isNaN(id)) return fail(400, { error: 'Chapter id is invalid.' });

		await db.delete(chapter).where(and(eq(chapter.id, id), eq(chapter.userId, user.id)));
		return { success: true };
	}
};
