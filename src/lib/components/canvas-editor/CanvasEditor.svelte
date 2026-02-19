<script lang="ts">
	import Canvas from './canvas/Canvas.svelte';
	import Toolbar from './toolbar/Toolbar.svelte';

	interface Props {
		width?: number;
		height?: number;
		backgroundImage?: string;
	}

	let { width = 800, height = 600, backgroundImage }: Props = $props();
</script>

<div class="flex h-full flex-col">
	<Toolbar />
	<div class="flex flex-1 items-center justify-center overflow-hidden bg-gray-200">
		<Canvas {width} {height} {backgroundImage} />
	</div>
</div>
