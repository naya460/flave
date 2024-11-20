<script lang="ts">
  import Cards from "$lib/gui/common/Cards.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<Cards items={data.items}>
  <div slot="item" let:item>
    <div>{item.name}</div>
    <div>id: {item.id}</div>
    <div>owner: {item.owner}</div>
  </div>
</Cards>
