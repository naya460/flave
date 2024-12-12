<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import TableRow from "./table_row.svelte";
  import TableHeader from "./table_header.svelte";
  import { workspace_id_store } from "$lib/store/workspace";
  import type { PropertyHeader } from "../types";
  import type { PageList, PageType } from "../page_list_filter";

  export let rdb_id: string | undefined;

  export let properties: PropertyHeader[];

  export let constraints: {
    id: string;
    type: string;
    option: object;
  }[];

  export let page_list: PageList = [];

  export let set_menu: (menu: { dir: string; title: string }[]) => void;

  export let push_page: (page: PageType) => void;

  async function postPage() {
    if (rdb_id === undefined) return;

    const res = await flvFetch(`pages`, "POST", {
      workspace_id: $workspace_id_store,
      rdb_id: rdb_id,
    });
    if (res.ok === true) {
      const id = await res.text();
      push_page({
        _id: id,
        title: "New Page",
        properties: [],
      });
    }
  }
</script>

<div class="top">
  <div class="table">
    <div class="row">
      <TableHeader {rdb_id} {properties} {set_menu} />
    </div>
    {#if properties.length !== 0}
      {#each page_list as page (page._id)}
        <div class="row">
          <TableRow {properties} {constraints} {page} />
        </div>
      {/each}
    {/if}
    {#if rdb_id !== undefined}
      <Button
        style={{
          buttonStyle: "text",
          textAlign: "left",
          width: "100%",
        }}
        on:click={postPage}
      >
        + Create New Page
      </Button>
    {/if}
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
