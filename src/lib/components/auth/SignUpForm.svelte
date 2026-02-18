<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { AuthUser } from '$lib/server/stack';

	let { onSuccess, redirectTo }: { onSuccess?: (user: AuthUser) => void; redirectTo?: string } =
		$props();

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	let fieldErrors = $state<Record<string, string[]>>({});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = null;
		fieldErrors = {};
		isLoading = true;

		if (password !== confirmPassword) {
			fieldErrors = { confirmPassword: ['Passwords do not match'] };
			isLoading = false;
			return;
		}

		try {
			const response = await fetch('/api/auth/sign-up', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, confirmPassword })
			});

			const data = await response.json();

			if (!response.ok) {
				if (data.details) {
					fieldErrors = data.details;
				} else {
					error = data.error || 'Sign up failed';
				}
				return;
			}

			if (onSuccess) {
				onSuccess(data.user);
			} else {
				window.location.href = redirectTo || '/';
			}
		} catch {
			error = 'An unexpected error occurred';
		} finally {
			isLoading = false;
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-4">
	{#if error}
		<div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>
	{/if}

	<div class="space-y-2">
		<Label for="email">Email</Label>
		<Input
			id="email"
			type="email"
			placeholder="you@example.com"
			bind:value={email}
			required
			autocomplete="email"
			aria-describedby={fieldErrors.email ? 'email-error' : undefined}
		/>
		{#if fieldErrors.email}
			<p id="email-error" class="text-sm text-destructive">{fieldErrors.email.join(', ')}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="password">Password</Label>
		<Input
			id="password"
			type="password"
			bind:value={password}
			required
			autocomplete="new-password"
			aria-describedby={fieldErrors.password ? 'password-error' : undefined}
		/>
		{#if fieldErrors.password}
			<p id="password-error" class="text-sm text-destructive">{fieldErrors.password.join(', ')}</p>
		{/if}
	</div>

	<div class="space-y-2">
		<Label for="confirmPassword">Confirm Password</Label>
		<Input
			id="confirmPassword"
			type="password"
			bind:value={confirmPassword}
			required
			autocomplete="new-password"
			aria-describedby={fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined}
		/>
		{#if fieldErrors.confirmPassword}
			<p id="confirmPassword-error" class="text-sm text-destructive">
				{fieldErrors.confirmPassword.join(', ')}
			</p>
		{/if}
	</div>

	<Button type="submit" class="w-full" disabled={isLoading}>
		{#if isLoading}
			<span class="animate-pulse">Creating account...</span>
		{:else}
			Create Account
		{/if}
	</Button>
</form>
