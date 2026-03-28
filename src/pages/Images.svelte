<script>
	import {onMount, getContext} from 'svelte';
	import ArtboardBtn from '../components/ArtboardBtn.svelte';
	import { createGallery } from '../domain/gallery.js';

	export let params = {};

	const router = getContext('router');
	const apiUrl = import.meta.env.VITE_API_URL;
	const gallery = createGallery(apiUrl);
	
	const fetchImageUrls = gallery.fetchImages();
	
	let currentImage = 0;
	let imagesLoaded = false;

	// Watch for params changes (when navigating via URL)
	$: if (params?.id && imagesLoaded) {
		const index = gallery.findImageIndexById(params.id);
		if (index !== -1) {
			currentImage = index;
		}
	}

	function updateCurrent (inc) {
		currentImage += inc;
		const images = gallery.getImages();
		const nextImageId = images[currentImage].uuid;
		// Update URL without triggering navigation
		window.history.pushState({}, '', `/images/${nextImageId}`);
	}

	onMount(() => {
    fetchImageUrls.then(() => {
			imagesLoaded = true;
			if (params?.id) {
				const index = gallery.findImageIndexById(params.id);
				if (index !== -1) {
					currentImage = index;
				}
			}
		})
	});

</script>

<div class="artboard full">
  <div class="loading-wrapper">
		{#await fetchImageUrls}
			<p>loading...</p>
    {:then}
    <nav class="image-nav full">
      <ArtboardBtn disabled={currentImage === 0} clickHandler={() => updateCurrent(-1)}>prev</ArtboardBtn>
      <ArtboardBtn disabled={currentImage === gallery.getTotalImages() - 1} clickHandler={() => updateCurrent(1)}>next</ArtboardBtn>
    </nav>
    <img async class="image-container" alt="art" src={gallery.getImageByIndex(currentImage).url} />
		{/await}
  </div>
</div>

<style>
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

	.loading-wrapper {
		display: flex;
		height: 100vh;
		justify-content: center;
		align-items: center;
	}

	.loading-wrapper p {
		width: 100px;
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
