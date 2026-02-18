<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import CardFooter from '$lib/components/ui/card/card-footer.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import SignUpForm from '$lib/components/auth/SignUpForm.svelte';
	import OAuthButtons from '$lib/components/auth/OAuthButtons.svelte';
</script>

<div class="flex min-h-screen items-center justify-center px-4 py-12">
	<Card class="w-full max-w-md">
		<CardHeader class="text-center">
			<CardTitle class="text-2xl">Create an account</CardTitle>
			<CardDescription>Enter your details to get started</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<SignUpForm />
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<Separator />
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-background px-2 text-muted-foreground">Or continue with</span>
				</div>
			</div>
			<OAuthButtons />
		</CardContent>
		<CardFooter class="flex justify-center">
			<p class="text-sm text-muted-foreground">
				Already have an account?
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href="/sign-in" class="text-primary underline-offset-4 hover:underline">Sign in</a>
			</p>
		</CardFooter>
	</Card>
</div>
