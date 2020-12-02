<script>
  export let clickHandler;
  export let disabled;
</script>

<button on:click={clickHandler} disabled={disabled} class="button-wrapper">
  <div class="button">
    <slot></slot>
  </div>
</button>

<style>

  .button-wrapper{
    padding: 0;
    border: none;
    cursor: pointer;
  }

  .button-wrapper:focus,
  .button-wrapper:hover {
    
  }
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 40px;
    padding: 0 0 2px;
    background: white;
  }
</style>
