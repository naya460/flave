<script lang="ts">
  import MenuProperty from "./menu_property.svelte";
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
    }[];
  };

  let property_menu_hidden: boolean = true;

  let properties = rdb_data.properties === undefined ? [] : rdb_data.properties;
</script>

<div class="top">
  <Table {rdb_id} {properties} {display} bind:property_menu_hidden />
  <MenuProperty
    {block_id}
    {rdb_id}
    {properties}
    bind:display
    bind:popup_hidden={property_menu_hidden}
  />
</div>

<style>
  .top {
    position: relative;
  }
</style>
