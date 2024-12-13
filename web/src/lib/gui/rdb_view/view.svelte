<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import { afterUpdate } from "svelte";
  import Button from "../common/Button.svelte";
  import TextInput from "../common/TextInput.svelte";
  import Table from "./table/table.svelte";
  import { RdbData } from "../rdb_query_view/rdb_data/rdb_data";
  import { RdbPageList } from "../rdb_query_view/rdb_page_list";
  import MenuTop from "./menu/menu_top.svelte";

  export let block_id: string;
  export let rdb_id: string;
  export let display: string[];

  let filters: {
    id: string;
    value: string | boolean;
  }[] = [];

  let rdb_data = new RdbData(null);
  let property_list = rdb_data.getPropertyList();

  let rdb_page_list: RdbPageList = new RdbPageList(null);

  let set_menu: (menu: { dir: string; title: string }[]) => void;

  afterUpdate(() => {
    rdb_data.changeRdb(rdb_id);
    rdb_page_list.changeRdb(rdb_id);
    display.forEach((v) => property_list.add(v));
  });
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
      {rdb_data}
      {property_list}
      {rdb_page_list}
      bind:filters
      {set_menu}
    />
    <MenuTop
      {rdb_id}
      {block_id}
      {rdb_data}
      {property_list}
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
