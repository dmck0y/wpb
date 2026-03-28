<script>
	import { onMount, setContext } from 'svelte';
	import navaid from 'navaid';
	import Images from './pages/Images.svelte';
	// import About from './pages/About.svelte';

	let page;
	let params = {};

	const router = navaid('/', () => {
		// Redirect root to /images
		window.history.replaceState({}, '', '/images');
		page = Images;
		params = {};
	})
	.on('/images', () => {
		page = Images;
		params = {};
	})
	.on('/images/:id', (ctx) => {
		page = Images;
		params = { ...ctx.params }; // Force new object reference
	})
	// .on('/about', () => page = About)
	.listen();

	// Expose router for child components
	setContext('router', router);

	onMount(() => {
		return () => router.unlisten();
	});
</script>

<main>
	<a class='logo-wrapper' href="/images">
		<img class="logo" src="/wpb_logo_100.png" alt="wastepaperbasket" />
		<h1>wastepaperbasket</h1>
	</a>
	<svelte:component this={page} {params} />
</main>

<style>
	.logo-wrapper {
		position: absolute;
		transform: translate(35px, 30px);
		text-decoration: none;
		color: rgba(0,0,0,1);
		transition: color 200ms ease;
		cursor: pointer;
		z-index: 9999;
	}

	.logo-wrapper:hover,
	.logo-wrapper:focus {
		color: rgba(0,0,0,.25);
	}

	.logo-wrapper h1 {
		display: inline-block;
		transform: translate(-10px, 28px) rotate(90deg);
		transform-origin: left center; 
		font-size: 1.5rem;
		font-weight: 500;
		margin: 0;
	}
	
	.logo {
		width: 20px;
	}

	.logo-type {
		position: absolute;
		font-size: 1.5rem;
		font-weight: 500;
		transform: translate(75px, 35px) rotate(90deg);
		transform-origin: left center; 
		z-index: 20;
	}
</style>