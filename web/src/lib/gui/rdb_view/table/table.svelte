<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import TableRow from "./table_row.svelte";
  import TableHeader from "./table_header.svelte";
  import { workspace_id_store } from "$lib/store/workspace";
  import { type PageList } from "../page_list_filter";
  import type { ConstraintType } from "$lib/gui/rdb_query_view/rdb_data/rdb_data";
  import type { PropertyHeader } from "../types";

  export let rdb_id: string | null;

  export let property_list: PropertyHeader[];

  export let constraints: ConstraintType[];

  export let menu_enable = true;

  export let page_list: PageList;

  export let set_menu: (menu: { dir: string; title: string }[]) => void;
  export let add_page: (id: string) => void;

  async function postPage() {
    if (menu_enable === false) return;

    const res = await flvFetch(`pages`, "POST", {
      workspace_id: $workspace_id_store,
      rdb_id: rdb_id,
    });

    if (res.ok === true) {
      const id = await res.text();
      add_page(id);
    }
  }
</script>

<div class="top">
  <div class="table">
    <div class="row">
      <TableHeader
        {rdb_id}
        {menu_enable}
        properties={property_list}
        {set_menu}
      />
    </div>
    {#if property_list.length !== 0}
      {#each page_list as page (page._id)}
        <div class="row">
          <TableRow properties={property_list} {constraints} {page} />
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
