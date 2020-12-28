<script>
	import Routes from './pages/Routes.svelte';
</script>

<main>
	<h1 class="logo-type">wastepaperbasket</h1>
	<Routes />
</main>

<style>
	.logo-type {
		position: absolute;
		font-size: 1.5rem;
		font-weight: 500;
		transform: translate(75px, 35px) rotate(90deg);
		transform-origin: left center; 
		z-index: 20;
	}
</style>