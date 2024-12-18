<script lang="ts">
  import type { PageData } from "./$types";
  import View from "$lib/gui/rdb_view/view.svelte";

  export let data: PageData;
</script>

{#if data.rdb_data !== undefined}
  {@const properties =
    data.rdb_data.properties === undefined ? [] : data.rdb_data.properties}
  <View
    block_id=""
    rdb_id={data.rdb_id}
    display={properties.map((v) => v.id)}
  />
{/if}
