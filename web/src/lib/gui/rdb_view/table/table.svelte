<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import TableRow from "./table_row.svelte";
  import TableHeader from "./table_header.svelte";
  import { workspace_id_store } from "$lib/store/workspace";
  import type { RdbQuery } from "$lib/gui/rdb_query_view/query/query";

  export let rdb_id: string | null;

  export let rdb_query: RdbQuery;

  export let menu_enable = true;

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
        property_list={rdb_query.getRdbData().getPropertyList()}
        rdb_select_clause={rdb_query.getRdbSelectClause()}
        {set_menu}
      />
    </div>
    {#if $rdb_query.properties.length !== 0}
      {#each $rdb_query.page_list as page (page._id)}
        <div class="row">
          <TableRow
            properties={$rdb_query.properties}
            constraints={$rdb_query.constraints}
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
