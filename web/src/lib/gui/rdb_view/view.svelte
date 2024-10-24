<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";
  import TextInput from "../common/TextInput.svelte";
  import MenuTop from "./menu_top.svelte";
  import Table from "./table.svelte";

  export let block_id: string;
  export let rdb_id: string;
  export let display: string[];

  export let rdb_data: {
    title: string;
    properties?: {
      id: string;
      type: string;
      name: string;
      option: unknown;
    }[];
    constraints?: {
      id: string;
      type: string;
      option: object;
    }[];
  };

  let filters: {
    id: string;
    value: string | boolean;
  }[] = [];

  let properties = rdb_data.properties === undefined ? [] : rdb_data.properties;
  let constraints =
    rdb_data.constraints === undefined ? [] : rdb_data.constraints;

  let set_menu: (menu: { dir: string; title: string }[]) => void;
</script>

<div class="top">
  <div class="header">
    <TextInput
      style={{ outline: false, fontSize: "1.5rem" }}
      value={rdb_data.title}
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
    <Table {rdb_id} {properties} {constraints} {display} {set_menu} {filters} />
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
