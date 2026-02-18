<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ActionData, PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const statuses = ['draft', 'in_progress', 'review', 'done'];
	const projectNameById = (id: number) =>
		data.projects.find((item) => item.id === id)?.name || 'Unknown';
</script>

<svelte:head>
	<title>Chapters · ComicTranslate</title>
</svelte:head>

<div class="mx-auto w-full max-w-5xl space-y-6 px-4 py-10">
	<Card>
		<CardHeader>
			<CardTitle>Chapters</CardTitle>
			<CardDescription>Browse and manage chapters across all projects.</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			{#if data.projects.length === 0}
				<p class="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
					Create a project first.
				</p>
			{:else}
				<form
					method="POST"
					action="?/create"
					class="grid gap-3 rounded-lg border p-4 md:grid-cols-4"
				>
					<select
						name="projectId"
						class="rounded-md border bg-background px-3 py-2 text-sm"
						required
					>
						<option value="" disabled selected>Select project</option>
						{#each data.projects as projectItem (projectItem.id)}
							<option value={projectItem.id}>{projectItem.name}</option>
						{/each}
					</select>
					<Input name="title" placeholder="Chapter title" class="md:col-span-2" required />
					<Input name="chapterNumber" type="number" min="1" value="1" required />
					<select name="status" class="rounded-md border bg-background px-3 py-2 text-sm" required>
						{#each statuses as status (status)}
							<option value={status}>{status}</option>
						{/each}
					</select>
					<Button type="submit" class="md:w-fit">Create chapter</Button>
				</form>
			{/if}

			{#if form?.error}
				<p class="text-sm text-destructive">{form.error}</p>
			{/if}

			<div class="space-y-3">
				{#if data.chapters.length === 0}
					<p class="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
						No chapters yet.
					</p>
				{:else}
					{#each data.chapters as item (item.id)}
						<div class="rounded-lg border p-4">
							<div class="flex items-center justify-between gap-3">
								<a href={resolve(`/chapter/${item.id}`)} class="font-medium hover:underline">
									Chapter {item.chapterNumber}: {item.title}
								</a>
								<form method="POST" action="?/delete">
									<input type="hidden" name="id" value={item.id} />
									<Button type="submit" variant="destructive">Delete</Button>
								</form>
							</div>
							<p class="text-sm text-muted-foreground">
								{projectNameById(item.projectId)} · status: {item.status}
							</p>
						</div>
					{/each}
				{/if}
			</div>
		</CardContent>
	</Card>
</div>
