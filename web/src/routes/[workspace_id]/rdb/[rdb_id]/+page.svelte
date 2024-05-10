<script lang="ts">
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import type { PageData } from "./$types";
  import { flvFetch } from "$lib/flv_fetch";
  import Table from "$lib/gui/rdb_view/table.svelte";

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

{#if data.rdb_data.properties !== undefined}
  <Table
    rdb_id={data.rdb_id}
    workspace_id={data.workspace_id}
    properties={data.rdb_data.properties}
  />
{/if}
