<script lang="ts">
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import type { PageData } from "./$types";
  import { flvFetch } from "$lib/flv_fetch";
  import View from "$lib/gui/rdb_view/view.svelte";

  export let data: PageData;
</script>

<TextInput
  style={{ outline: false, fontSize: "1.5rem" }}
  value={data.rdb_data.title}
  onChange={async (event) => {
    await flvFetch(`rdbs/${data.rdb_id}`, "PATCH", {
      title: event.currentTarget.value,
    });
  }}
/>

{#if data.rdb_data !== undefined}
  {@const properties =
    data.rdb_data.properties === undefined ? [] : data.rdb_data.properties}
  <View
    block_id=""
    rdb_id={data.rdb_id}
    display={properties.map((v) => v.id)}
    rdb_data={data.rdb_data}
  />
{/if}
