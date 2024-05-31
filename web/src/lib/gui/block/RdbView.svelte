<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import { workspace_id_store } from "$lib/store/workspace";
  import Table from "../rdb_view/table.svelte";

  export let rdb_id;

  let rdb_data: {
    title: string;
    properties?: {
      id: string;
      type: string;
      name: string;
    }[];
  };

  $: {
    flvFetch(`rdbs/${rdb_id}`).then((res) => {
      res.json().then((value) => {
        rdb_data = value;
      });
    });
  }
</script>

<div contenteditable="false">
  {#if rdb_data !== undefined && rdb_data.properties !== undefined}
    <Table
      {rdb_id}
      workspace_id={$workspace_id_store}
      properties={rdb_data.properties}
    />
  {/if}
</div>
