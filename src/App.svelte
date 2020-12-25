<script>
	import { onMount } from 'svelte';
	// import { Router, Link, Route } from 'svetle-routing';
	// import { createHashHistory } from 'svelte-history';
	// let history = createHashHistory();
	import ArtboardBtn from './components/ArtboardBtn.svelte';

	const {apiHost, apiPort} = process.env;

	const fetchImageUrls = (async () => {
		const response = await fetch(`//${apiHost}/api/v1/assets`)
		return await response.json();
	})()
	
	let currentImage = 0;
	function updateCurrent (inc) {
		currentImage += inc;
	}

	// onMount(() => {
	// 	console.log('mounting')
	// 	fetchImageUrls();
	// });

	// const Routes = () => {
	// 	return <Router>
	// 		<Route to='' />	
	// 	</Router>
	// }
</script>

<main>
	<h1 class="logo-type">wastepaperbasket</h1>
	<div class="artboard full">
		<div>
		{#await fetchImageUrls}
			<p class="image-container">loading...</p>
			{:then data}
			<nav class="image-nav full">
				<ArtboardBtn disabled={currentImage === 0} clickHandler={() => updateCurrent(-1)}>prev</ArtboardBtn>
				<ArtboardBtn disabled={currentImage === data.images.length -1} clickHandler={() => updateCurrent(1)}>next</ArtboardBtn>
			</nav>
			<img async class="image-container" alt="art" src={data.images[currentImage].image} />
		{/await}
		</div>
	</div>
</main>

<style>
	main {
		margin: 0 auto;
	}

	.image-container {
		max-width: 100%;
    max-height: 100%;
    bottom: 0;
    left: 0;
    margin: auto;
    overflow: auto;
    position: absolute;
    right: 0;
    top: 0;
    -o-object-fit: contain;
    object-fit: contain;
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
		/* margin: 6rem 3rem 3rem; */
		/* background: rgba(197, 197, 197, .25); */
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