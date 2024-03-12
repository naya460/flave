<script lang="ts">
  type T = $$Generic;
  export let items: T[];
</script>

<div class="top">
  {#each items as item}
    <div class="item">
      <slot name="item" {item} />
    </div>
  {/each}
</div>

<style>
  .top {
    display: grid;
    grid-template-rows: auto;
    gap: 0.4rem;
    margin: 0.4rem 0;
  }

  .item {
    background-color: #ffffff;
    padding: 0.5rem;
    box-shadow: 0 0 1px #000000;
    border-radius: 0.4rem;
  }
</style>
