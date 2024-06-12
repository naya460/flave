<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import TableRow from "$lib/gui/rdb_view/table_row.svelte";
  import TableHeader from "$lib/gui/rdb_view/table_header.svelte";
  import { onMount } from "svelte";
  import { workspace_id_store } from "$lib/store/workspace";

  export let block_id: string;
  export let rdb_id: string;

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

  export let display: string[];

  onMount(async () => {
    const res = await flvFetch(`rdbs/${rdb_id}/pages`);
    if (res.ok === false) return;
    page_list = await res.json();
  });
</script>

<div class="top">
  <div class="table">
    <div class="row">
      <TableHeader {rdb_id} {properties} {block_id} bind:display />
    </div>
    {#each page_list as page}
      <div class="row">
        {#if properties !== undefined}
          <TableRow {properties} {page} {display} />
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
          const res = await flvFetch(`pages`, "POST", {
            workspace_id: $workspace_id_store,
            rdb_id: rdb_id,
          });
          if (res.ok === true) {
            const id = await res.text();
            console.log(id);
            page_list.push({
              _id: id,
              title: "New Page",
              properties: [],
            });
            page_list = page_list;
          }
        }}
      >
        + Create New Page
      </Button>
    </div>
  </div>
</div>

<style>
  .top {
    width: 100%;
    overflow-x: scroll;
  }

  .table {
    width: fit-content;
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #dddddd;
  }
</style>
