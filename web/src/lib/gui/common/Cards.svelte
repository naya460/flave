<script lang="ts">
  type T = $$Generic;
  export let items: T[];
  export let onItemClick: ((event: MouseEvent, item: T) => void) | null = null;

  function handleItemClick(event: MouseEvent, item: T) {
    if (onItemClick !== null) {
      return onItemClick(event, item);
    }
  }
</script>

<div class="top">
  {#each items as item}
    <button
      class="item"
      disabled={onItemClick === null}
      on:click={(e) => handleItemClick(e, item)}
    >
      <slot name="item" {item} />
    </button>
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
    border: none;
    font-size: 1rem;
    text-align: start;
    line-height: 1.5rem;
    color: black;
  }

  .item:hover:not(:disabled) {
    background-color: #f8f8f8;
    cursor: pointer;
  }
</style>
