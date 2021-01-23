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

  .button:focus,
  .button:hover {
    background: #dedede;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 40px;
    padding: 0 0 2px;
    background: #ececec;
    transition: 250ms all ease;
  }

</style>
