<script lang="ts">
  import type { PageData } from "./$types";
  import Cards from "$lib/gui/common/Cards.svelte";

  export let data: PageData;
</script>

<Cards items={data.items}>
  <div slot="item" let:item>
    <div>{item.id}</div>
    <div>user_id: {item.user_id}</div>
  </div>
</Cards>
