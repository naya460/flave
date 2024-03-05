<script lang="ts">
  export let initial_items: string[] = [];
  let items: string[] = initial_items;

  export function addItem(new_item: string) {
    items = [...items, new_item];
  }
</script>

{#each items as item}
  <p>{item}</p>
{/each}
