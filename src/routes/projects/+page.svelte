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
</script>

<svelte:head>
	<title>Projects · ComicTranslate</title>
</svelte:head>

<div class="mx-auto w-full max-w-5xl space-y-6 px-4 py-10">
	<Card>
		<CardHeader>
			<CardTitle>Projects</CardTitle>
			<CardDescription>Manage all your comic translation projects.</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<form method="POST" action="?/create" class="grid gap-3 rounded-lg border p-4">
				<Input name="name" placeholder="Project name" required />
				<Input name="description" placeholder="Description (optional)" />
				<Button type="submit" class="w-fit">Create project</Button>
			</form>

			{#if form?.error}
				<p class="text-sm text-destructive">{form.error}</p>
			{/if}

			<div class="space-y-3">
				{#if data.projects.length === 0}
					<p class="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
						No projects yet.
					</p>
				{:else}
					{#each data.projects as item (item.id)}
						<div class="rounded-lg border p-4">
							<div class="flex flex-wrap items-center justify-between gap-3">
								<div>
									<a href={resolve(`/project/${item.id}`)} class="font-medium hover:underline"
										>{item.name}</a
									>
									<p class="text-sm text-muted-foreground">
										{item.description || 'No description'}
									</p>
								</div>
								<form method="POST" action="?/delete">
									<input type="hidden" name="id" value={item.id} />
									<Button type="submit" variant="destructive">Delete</Button>
								</form>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</CardContent>
	</Card>
</div>
