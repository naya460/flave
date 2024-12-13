<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import MenuAddProperty from "./menu_add_property.svelte";
  import type { FiltablePropertyList } from "$lib/gui/rdb_query_view/rdb_data/filtable_property_list";

  export let rdb_id: string;
  export let block_id: string;

  export let property_list: FiltablePropertyList;

  export let display_menu: { dir: string; title: string }[] = [];
  export let menu_next: (dir: string, title: string) => void;
</script>

<div>
  {#if display_menu.length === 0}
    {#each $property_list.filtered_properties as property (property.id)}
      <div style:display="flex" style:flex-direction="row">
        <div style:flex-grow={1}>{property.name}</div>
        <Button
          style={{
            buttonStyle: "text",
            width: "2rem",
          }}
          on:click={async () => {
            property_list.moveUp(property.id);
            await flvFetch(`blocks/${block_id}`, "PATCH", {
              data: { display: $property_list.display },
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
            property_list.moveDown(property.id);
            await flvFetch(`blocks/${block_id}`, "PATCH", {
              data: { display: $property_list.display },
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
            property_list.remove(property.id);
            await flvFetch(`blocks/${block_id}`, "PATCH", {
              data: { display: $property_list.display },
            });
          }}
        >
          -
        </Button>
      </div>
    {/each}
    {#each $property_list.properties as property (property.id)}
      {#if $property_list.display.includes(property.id) === false}
        <div style:display="flex" style:flex-direction="row">
          <div style:flex-grow={1}>{property.name}</div>
          <Button
            style={{
              buttonStyle: "text",
              width: "2rem",
            }}
            on:click={async () => {
              property_list.add(property.id);
              await flvFetch(`blocks/${block_id}`, "PATCH", {
                data: { display: $property_list.display },
              });
            }}
          >
            +
          </Button>
        </div>
      {/if}
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
      display_menu={display_menu.toSpliced(0, 1)}
      {menu_next}
    />
  {/if}
</div>
