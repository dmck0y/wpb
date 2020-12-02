<script>
	import { onMount } from 'svelte';
	// import { createHashHistory } from 'svelte-history';
	// let history = createHashHistory();
	import ArtboardBtn from './ArtboardBtn.svelte';

	const PATH = '/images';
	const images = [
		`${PATH}/untitled.0002.jpg`,
		`${PATH}/untitled.0003.jpg`,
		`${PATH}/deck001.jpg`,
		`${PATH}/deck002.jpg`,
		`${PATH}/deck004.jpg`
	];

	let currentImage = 0;
	function updateCurrent (inc) {
		currentImage += inc;
		// history.replace(`#page-${currentImage}`);
	}

	// onMount(() => {
	// 	console.log('mounting')
	// });

</script>

<main>
	<!-- <img href="favicon.png" /> -->
	<h1 class="logo-type">wastepaperbasket</h1>
	<div class="artboard full">
		<nav class="image-nav full">
			<ArtboardBtn disabled={currentImage === 0} clickHandler={() => updateCurrent(-1)}>prev</ArtboardBtn>
			<ArtboardBtn disabled={currentImage === images.length -1} clickHandler={() => updateCurrent(1)}>next</ArtboardBtn>
		</nav>
		<div>
			<img class="image-container" alt="art" src={images[currentImage]} />
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