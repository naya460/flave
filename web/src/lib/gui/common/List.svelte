<script lang="ts">
  export let initial_items: string[] = [];
  let items: string[] = initial_items;

  export function addItem(new_item: string) {
    items = [...items, new_item];
  }
</script>

<div class="top">
  {#each items as item}
    <div class="item">
      <p>{item}</p>
    </div>
  {/each}
</div>

<style>
  .top {
    display: grid;
    grid-template-rows: auto;
    background-color: #dddddd;
    gap: 1px;
  }

  .item {
    background-color: #ffffff;
  }
</style>
