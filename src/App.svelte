<script>
	import ArtboardBtn from './ArtboardBtn.svelte';
</script>

<main>
	<!-- <img href="favicon.png" /> -->
	<h1 class="logo-type">wastepaperbasket</h1>
	<div class="artboard full">
		<nav class="image-nav full">
			<ArtboardBtn>prev</ArtboardBtn>
			<ArtboardBtn>next</ArtboardBtn>
		</nav>
	</div>
</main>

<style>
	main {
		margin: 0 auto;
	}

	.logo-type {
		position: absolute;
		font-size: 1.5rem;
		font-weight: 500;
		transform: translate(75px, 35px) rotate(90deg);
		transform-origin: left center; 
		z-index: 20;
	}

	.artboard {
		margin: 6rem 3rem 3rem;
		background: rgba(197, 197, 197, .25);
	}

	.image-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 10;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>