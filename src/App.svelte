<script>
	import router from 'page';
	import Images from './pages/Images.svelte';
	// import About from './pages/About.svelte';

	let page;
	let params;

	router('/', () => page = Images);
	// router('/about', () => page = About);
	router('/image/:id?', (ctx, next) => {
		params = ctx.params;
		next();
	}, () => page = Images);

	router.start();
</script>

<main>
	<a class='home' href="/"><h1 class="logo-type">wastepaperbasket</h1></a>
	<svelte:component this={page} params={params} />
</main>

<style>
	.home {
		text-decoration: none;
		color: rgba(0,0,0,1);
		transition: color 200ms ease;
	}
	.home:hover,
	.home:focus {
		color: rgba(0,0,0,.25);
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