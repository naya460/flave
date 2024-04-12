<script lang="ts">
  import Button from "./Button.svelte";

  export let expand = false;
</script>

<div class="header">
  <Button
    style={{
      buttonStyle: "text",
      width: "0.5rem",
      boxSizing: "content-box",
    }}
    on:click={() => {
      expand = !expand;
    }}
  >
    {expand ? "v" : ">"}
  </Button>
  <div style:height="100%">
    <slot name="summary" />
  </div>
</div>
<div>
  {#if expand === true}
    <slot name="contents" />
  {/if}
</div>

<style>
  .header {
    display: grid;
    grid-template-columns: auto 1fr;
    height: "2rem";
  }
</style>
