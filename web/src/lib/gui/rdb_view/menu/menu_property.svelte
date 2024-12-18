<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import MenuAddProperty from "./menu_add_property.svelte";
  import type { RdbSelectClause } from "$lib/gui/rdb_query_view/query/select";
  import type { PropertyList } from "$lib/gui/rdb_query_view/rdb_data/property_list";

  export let rdb_id: string;
  export let block_id: string;

  export let property_list: PropertyList;
  export let rdb_select_clause: RdbSelectClause;

  export let display_menu: { dir: string; title: string }[] = [];
  export let menu_next: (dir: string, title: string) => void;
  export let menu_back: () => void;
</script>

<div>
  {#if display_menu.length === 0}
    {#each $rdb_select_clause.rdb_select_resources.display_properties as property (property.id)}
      <div style:display="flex" style:flex-direction="row">
        <div style:flex-grow={1}>{property.name}</div>
        <Button
          style={{
            buttonStyle: "text",
            width: "2rem",
          }}
          on:click={async () => {
            rdb_select_clause.moveUpProperty(property.id);
            await flvFetch(`blocks/${block_id}`, "PATCH", {
              data: {
                display: $rdb_select_clause.rdb_select_resources.display,
              },
            });
          }}
        >
          ↑
        </Button>
        <Button
          style={{
            buttonStyle: "text",
            width: "2rem",
          }}
          on:click={async () => {
            rdb_select_clause.moveDownProperty(property.id);
            await flvFetch(`blocks/${block_id}`, "PATCH", {
              data: {
                display: $rdb_select_clause.rdb_select_resources.display,
              },
            });
          }}
        >
          ↓
        </Button>
        <Button
          style={{
            buttonStyle: "text",
            width: "2rem",
          }}
          on:click={async () => {
            rdb_select_clause.hideProperty(property.id);
            await flvFetch(`blocks/${block_id}`, "PATCH", {
              data: {
                display: $rdb_select_clause.rdb_select_resources.display,
              },
            });
          }}
        >
          -
        </Button>
      </div>
    {/each}
    {#each $rdb_select_clause.rdb_select_resources.hidden_properties as property (property.id)}
      <div style:display="flex" style:flex-direction="row">
        <div style:flex-grow={1}>{property.name}</div>
        <Button
          style={{
            buttonStyle: "text",
            width: "2rem",
          }}
          on:click={async () => {
            rdb_select_clause.displayProperty(property.id);
            await flvFetch(`blocks/${block_id}`, "PATCH", {
              data: {
                display: $rdb_select_clause.rdb_select_resources.display,
              },
            });
          }}
        >
          +
        </Button>
      </div>
    {/each}
    <Button
      style={{
        buttonStyle: "text",
      }}
      on:click={() => {
        menu_next("add property", "add property");
      }}
    >
      + Add Property
    </Button>
  {:else if display_menu[0].dir === "add property"}
    <MenuAddProperty
      {rdb_id}
      {property_list}
      {rdb_select_clause}
      display_menu={display_menu.toSpliced(0, 1)}
      {menu_next}
      {menu_back}
    />
  {/if}
</div>
