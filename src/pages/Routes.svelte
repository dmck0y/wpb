<script>
  import router from 'page';
  import Index from './Index.svelte';

  function index (ctx) {
    console.log({ctx})
    return Index;
  }

  // Routing
  let page;
  let id = 0;
  router.base('/image');
  router('/', '/0');
  router('/:id', (ctx, next) => { 
    console.log({ctx, next})
    if (ctx && ctx.params && ~~ctx.params) id = params.id
    page = Index;
  });
  router('/about', () => page = 'about this');
  router.start();
</script>

<main>
 <svelte:component id={id} this={page} />
</main>

<style>
</style>