<script lang="ts">
  import MenuAddProperty from "./menu_add_property.svelte";
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

  let top_menu_hidden: boolean = true;
  let add_property_menu_hidden: boolean = true;

  let properties = rdb_data.properties === undefined ? [] : rdb_data.properties;
  let constraints =
    rdb_data.constraints === undefined ? [] : rdb_data.constraints;
</script>

<div class="top">
  <Table
    {rdb_id}
    {properties}
    {display}
    bind:top_menu_hidden
    bind:add_property_menu_hidden
  />
  <MenuTop
    {rdb_id}
    {block_id}
    {properties}
    {constraints}
    bind:display
    bind:popup_hidden={top_menu_hidden}
  />
  <MenuAddProperty
    {rdb_id}
    bind:popup_hidden={add_property_menu_hidden}
    bind:properties
  />
</div>

<style>
  .top {
    position: relative;
  }
</style>
