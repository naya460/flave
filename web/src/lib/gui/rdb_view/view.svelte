<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";
  import TextInput from "../common/TextInput.svelte";
  import Table from "./table/table.svelte";
  import { RdbData } from "../rdb_query_view/rdb_data/rdb_data";
  import MenuTop from "./menu/menu_top.svelte";
  import { RdbSelectClause } from "../rdb_query_view/query/select";

  export let block_id: string;
  export let rdb_id: string;
  export let display: string[];

  let filters: {
    id: string;
    value: string | boolean;
  }[] = [];

  let rdb_data = new RdbData(rdb_id);
  let rdb_select_clause = new RdbSelectClause({
    properties: [],
    constraints: [],
    page_list: [],
  });

  rdb_data.subscribe((v) => {
    rdb_select_clause.updateRdbResources(v.rdb_resources);
  });

  for (const display_id of display) {
    rdb_select_clause.displayProperty(display_id);
  }

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
      property_list={$rdb_select_clause.rdb_resources.properties}
      constraints={$rdb_select_clause.rdb_resources.constraints}
      page_list={$rdb_select_clause.rdb_resources.page_list}
      {set_menu}
      add_page={(id) =>
        rdb_data.getPageList().addPage({ _id: id, title: "New Page" })}
    />
    <MenuTop
      {rdb_id}
      {block_id}
      {rdb_data}
      {rdb_select_clause}
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
