<script>
	export let name;
	import ArtboardBtn from './ArtboardBtn.svelte';
</script>

<main>
	<img href="favicon.png" />
	<h1 class="logo-type">wastepaperbasket</h1>
	<div class="artboard">
		<ArtboardBtn>prev</ArtboardBtn>
	</div>
	<a>gallery</a>
</main>

<style>
	main {
		max-width: 240px;
		margin: 0 auto;
	}

	.logo-type {
		font-size: 1.5rem;
		font-weight: 500;
		transform: translate(35px, 20px) rotate(90deg);
		transform-origin: left center; 
	}

	.artboard {
		margin: 4rem;
		background: rgba(197, 197, 197, .25);
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}

  a {
		position: absolute;
		bottom: 0;
		display: block;
		margin: 1rem;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>