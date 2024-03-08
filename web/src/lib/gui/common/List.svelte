<script lang="ts">
  export let initial_items: { title: string; description: string }[] = [];
  let items: { title: string; description: string }[] = initial_items;

  export function addItem(new_item: { title: string; description: string }) {
    items = [...items, new_item];
  }
</script>

<div class="top">
  {#each items as item}
    <div class="item">
      <div>{item.title}</div>
      <div class="description">{item.description}</div>
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

  .description {
    color: #666666;
  }
</style>
