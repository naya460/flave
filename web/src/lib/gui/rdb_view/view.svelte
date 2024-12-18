<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";
  import TextInput from "../common/TextInput.svelte";
  import Table from "./table/table.svelte";
  import MenuTop from "./menu/menu_top.svelte";
  import { RdbQuery } from "../rdb_query_view/query/query";

  export let block_id: string;
  export let rdb_id: string;
  export let display: string[];

  let filters: {
    id: string;
    value: string | boolean;
  }[] = [];

  let rdb_query = new RdbQuery(rdb_id);
  let rdb_data = rdb_query.getRdbData();

  let init = true;
  rdb_data.subscribe((v) => {
    if (init === true && v.rdb_resources.properties.length !== 0) {
      const select_clause = rdb_query.getRdbSelectClause();
      for (const display_id of display) {
        select_clause.displayProperty(display_id);
      }
      init = false;
    }
  });

  let set_menu: (menu: { dir: string; title: string }[]) => void;
</script>

<div class="top">
  <div class="header">
    <TextInput
      style={{ outline: false, fontSize: "1.5rem" }}
      value={$rdb_data.title}
      onChange={async (event) => {
        await flvFetch(`rdbs/${rdb_id}`, "PATCH", {
          title: event.currentTarget.value,
        });
      }}
    />
    <Button
      style={{
        buttonStyle: "text",
      }}
      on:click={() => {
        set_menu([]);
      }}
    >
      ...
    </Button>
  </div>
  <div class="contents">
    <Table
      {rdb_id}
      {rdb_query}
      {set_menu}
      add_page={(id) =>
        rdb_data.getPageList().addPage({ _id: id, title: "New Page" })}
    />
    <MenuTop
      {rdb_id}
      {block_id}
      {rdb_data}
      rdb_select_clause={rdb_query.getRdbSelectClause()}
      bind:set_menu
      bind:filters
    />
  </div>
</div>

<style>
  .top {
    position: relative;
  }

  .header {
    font-size: 1.5rem;
    border-bottom: 1px solid #dddddd;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
  }

  .contents {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
  }
</style>
