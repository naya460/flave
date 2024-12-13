<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import TableRow from "./table_row.svelte";
  import TableHeader from "./table_header.svelte";
  import { workspace_id_store } from "$lib/store/workspace";
  import type { RdbData } from "$lib/gui/rdb_query_view/rdb_data/rdb_data";
  import type { RdbPageList } from "$lib/gui/rdb_query_view/rdb_page_list";
  import { afterUpdate } from "svelte";
  import { toFilteredPageList, type PageList } from "../page_list_filter";
  import type { FiltablePropertyList } from "$lib/gui/rdb_query_view/rdb_data/filtable_property_list";

  export let rdb_id: string;

  export let rdb_data: RdbData;
  export let property_list: FiltablePropertyList;

  export let rdb_page_list: RdbPageList;

  export let menu_enable = true;

  export let filters: {
    id: string;
    value: string | boolean;
  }[] = [];

  let page_list: PageList = [];
  afterUpdate(() => {
    page_list = toFilteredPageList(
      rdb_id,
      $property_list.filtered_properties,
      $rdb_page_list.page_list,
      filters
    );
  });

  export let set_menu: (menu: { dir: string; title: string }[]) => void;

  async function postPage() {
    if (menu_enable === false) return;

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
        {menu_enable}
        properties={$property_list.filtered_properties}
        {set_menu}
      />
    </div>
    {#if $property_list.filtered_properties.length !== 0}
      {#each page_list as page (page._id)}
        <div class="row">
          <TableRow
            properties={$property_list.filtered_properties}
            constraints={$rdb_data.constraints}
            {page}
          />
        </div>
      {/each}
    {/if}
    {#if menu_enable}
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
