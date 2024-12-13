<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import TableRow from "./table_row.svelte";
  import TableHeader from "./table_header.svelte";
  import { workspace_id_store } from "$lib/store/workspace";
  import type { RdbFilteredProperties } from "$lib/gui/rdb_query_view/rdb_filtered_properties";
  import type { RdbData } from "$lib/gui/rdb_query_view/rdb_data";
  import type { RdbPageList } from "$lib/gui/rdb_query_view/rdb_page_list";
  import { afterUpdate } from "svelte";
  import { toFilteredPageList, type PageList } from "../page_list_filter";

  export let rdb_id: string | undefined;

  export let rdb_data: RdbData;
  export let rdb_filtered_properties: RdbFilteredProperties;

  export let rdb_page_list: RdbPageList;

  export let filters: {
    id: string;
    value: string | boolean;
  }[] = [];

  let page_list: PageList = [];
  afterUpdate(() => {
    page_list = toFilteredPageList(
      $rdb_filtered_properties.properties,
      $rdb_page_list.page_list,
      filters
    );
  });

  export let set_menu: (menu: { dir: string; title: string }[]) => void;

  async function postPage() {
    if (rdb_id === undefined) return;

    const res = await flvFetch(`pages`, "POST", {
      workspace_id: $workspace_id_store,
      rdb_id: rdb_id,
    });

    if (res.ok === true) {
      const id = await res.text();
      rdb_page_list.addPage({
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
      <TableHeader
        {rdb_id}
        properties={$rdb_filtered_properties.properties}
        {set_menu}
      />
    </div>
    {#if $rdb_filtered_properties.properties.length !== 0}
      {#each page_list as page (page._id)}
        <div class="row">
          <TableRow
            properties={$rdb_filtered_properties.properties}
            constraints={$rdb_data.constraints}
            {page}
          />
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
