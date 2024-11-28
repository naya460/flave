<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import { onMount } from "svelte";
  import Button from "../common/Button.svelte";
  import TextInput from "../common/TextInput.svelte";
  import MenuTop from "./menu/menu_top.svelte";
  import Table from "./table/table.svelte";
  import type { PropertyHeader } from "./types";
  import { toFilteredPageList, type PageList } from "./page_list_filter";

  export let block_id: string;
  export let rdb_id: string;
  export let display: string[];

  let filters: {
    id: string;
    value: string | boolean;
  }[] = [];

  let title: string = "";

  let properties: PropertyHeader[] = [];

  let constraints: {
    id: string;
    type: string;
    option: object;
  }[] = [];

  let page_list: PageList = [];

  let set_menu: (menu: { dir: string; title: string }[]) => void;

  onMount(async () => {
    const res = await flvFetch(`rdbs/${rdb_id}`);
    const rdb_data: {
      title: string;
      properties?: PropertyHeader[];
      constraints?: {
        id: string;
        type: string;
        option: object;
      }[];
    } = await res.json();

    title = rdb_data.title;

    if (rdb_data.properties !== undefined) {
      properties = rdb_data.properties;
    }

    if (rdb_data.constraints !== undefined) {
      constraints = rdb_data.constraints;
    }
  });

  onMount(async () => {
    const res = await flvFetch(`rdbs/${rdb_id}/pages`);
    if (res.ok === false) return;
    page_list = await res.json();
  });
</script>

<div class="top">
  <div class="header">
    <TextInput
      style={{ outline: false, fontSize: "1.5rem" }}
      value={title}
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
      {properties}
      page_list={toFilteredPageList(properties, page_list, filters)}
      {constraints}
      {display}
      {set_menu}
      push_page={(page) => {
        page_list = [...page_list, page];
      }}
    />
    <MenuTop
      {rdb_id}
      {block_id}
      {properties}
      {constraints}
      bind:display
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
