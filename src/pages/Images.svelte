<script>
	import {onMount} from 'svelte';
	import ArtboardBtn from '../components/ArtboardBtn.svelte';

	export let params;

	const {apiHost, apiPort} = process.env;
	const fetchImageUrls = (async () => {
		const response = await fetch(`//${apiHost}/api/v1/assets`);
		const images = await response.json();
		const imageIds = await images.images.map(image => Object.keys(image)[0]);

		return images;
	})();
	
	let currentImage = 0;

	function updateCurrent (inc, data) {
		const nextImageId = data.images[currentImage + inc].uuid;
		const urlLen = window.location.pathname.split('/').length;

		const url = (urlLen === 2) ? `image/${nextImageId}` : `${nextImageId}`;
		history.pushState({page: `Image ${nextImageId}`}, 'next', url);
		currentImage += inc;
	}

	onMount(() => {
    fetchImageUrls.then(data => {
			if (!params) return;
			data.images.forEach((image, i) => {
				if(image.uuid === params.id) {
					currentImage = i;
				}
			});
		})
	});

</script>

<div class="artboard full">
  <div class="loading-wrapper">
		{#await fetchImageUrls}
			<p>loading...</p>
    {:then data}
    <nav class="image-nav full">
      <ArtboardBtn disabled={currentImage === 0} clickHandler={() => updateCurrent(-1, data)}>prev</ArtboardBtn>
      <ArtboardBtn disabled={currentImage === data.images.length -1} clickHandler={() => updateCurrent(1, data)}>next</ArtboardBtn>
    </nav>
    <img async class="image-container" alt="art" src={data.images[currentImage].url} />
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