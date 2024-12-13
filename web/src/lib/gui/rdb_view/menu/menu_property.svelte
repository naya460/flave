<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import MenuAddProperty from "./menu_add_property.svelte";
  import type { RdbFilteredProperties } from "$lib/gui/rdb_query_view/rdb_filtered_properties";
  import type { RdbData } from "$lib/gui/rdb_query_view/rdb_data";

  export let rdb_id: string;
  export let block_id: string;

  export let rdb_data: RdbData;
  export let rdb_filtered_properties: RdbFilteredProperties;

  export let display_menu: { dir: string; title: string }[] = [];
  export let menu_next: (dir: string, title: string) => void;
</script>

<div>
  {#if display_menu.length === 0}
    <div style:display="flex" style:flex-direction="row">
      <div style:flex-grow={1}>page</div>
      <Button
        style={{
          buttonStyle: "text",
          width: "2rem",
        }}
        on:click={async () => {
          if ($rdb_filtered_properties.display.includes("page")) {
            rdb_filtered_properties.remove("page");
          } else {
            rdb_filtered_properties.add("page");
          }
          await flvFetch(`blocks/${block_id}`, "PATCH", {
            data: { display: $rdb_filtered_properties.display },
          });
        }}
      >
        {$rdb_filtered_properties.display.includes("page") ? "-" : "+"}
      </Button>
    </div>
    {#each $rdb_filtered_properties.properties as property (property.id)}
      <div style:display="flex" style:flex-direction="row">
        <div style:flex-grow={1}>{property.name}</div>
        <Button
          style={{
            buttonStyle: "text",
            width: "2rem",
          }}
          on:click={async () => {
            rdb_filtered_properties.moveUp(property.id);
            await flvFetch(`blocks/${block_id}`, "PATCH", {
              data: { display: $rdb_filtered_properties.display },
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
            rdb_filtered_properties.moveDown(property.id);
            await flvFetch(`blocks/${block_id}`, "PATCH", {
              data: { display: $rdb_filtered_properties.display },
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
            rdb_filtered_properties.remove(property.id);
            await flvFetch(`blocks/${block_id}`, "PATCH", {
              data: { display: $rdb_filtered_properties.display },
            });
          }}
        >
          -
        </Button>
      </div>
    {/each}
    {#each $rdb_data.properties as property (property.id)}
      {#if $rdb_filtered_properties.display.includes(property.id) === false}
        <div style:display="flex" style:flex-direction="row">
          <div style:flex-grow={1}>{property.name}</div>
          <Button
            style={{
              buttonStyle: "text",
              width: "2rem",
            }}
            on:click={async () => {
              rdb_filtered_properties.add(property.id);
              await flvFetch(`blocks/${block_id}`, "PATCH", {
                data: { display: $rdb_filtered_properties.display },
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
      {rdb_data}
      {rdb_filtered_properties}
      display_menu={display_menu.toSpliced(0, 1)}
      {menu_next}
    />
  {/if}
</div>
