<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import TableRow from "$lib/gui/rdb_view/table_row.svelte";
  import TableHeader from "$lib/gui/rdb_view/table_header.svelte";
  import { onMount } from "svelte";

  export let rdb_id: string;
  export let workspace_id: string;

  export let properties: {
    id: string;
    type: string;
    name: string;
  }[];

  let page_list: {
    _id: string;
    title: string;
    properties?: {
      id: string;
      value: string;
    }[];
  }[] = [];

  onMount(async () => {
    const res = await flvFetch(`rdbs/${rdb_id}/pages`);
    if (res.ok === false) return;
    page_list = await res.json();
  });
</script>

<div class="top">
  <div class="table">
    <div class="row">
      <TableHeader {rdb_id} {properties} />
    </div>
    {#each page_list as page}
      <div class="row">
        {#if properties !== undefined}
          <TableRow {properties} {workspace_id} {page} />
        {/if}
      </div>
    {/each}
    <div style:width="100%">
      <Button
        style={{
          buttonStyle: "text",
          textAlign: "left",
          width: "100%",
        }}
        on:click={async () => {
          await flvFetch(`pages`, "POST", {
            workspace_id: workspace_id,
            rdb_id: rdb_id,
          });
        }}
      >
        + Create New Page
      </Button>
    </div>
  </div>
</div>

<style>
  .top {
    position: relative;
    width: 100%;
    height: fit-content;
  }

  .table {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-x: scroll;
  }

  .row {
    display: flex;
    width: fit-content;
    border-bottom: 1px solid #dddddd;
  }
</style>
