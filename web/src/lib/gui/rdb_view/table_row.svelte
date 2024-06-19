<script lang="ts">
  import Item from "$lib/gui/rdb_view/table_item.svelte";
  import { workspace_id_store } from "$lib/store/workspace";

  export let properties: {
    id: string;
    type: string;
    name: string;
  }[];

  export let page: {
    _id: string;
    title: string;
    properties?: {
      id: string;
      value: unknown;
    }[];
  };

  export let display: string[];
</script>

{#if display.includes("page") === true}
  <Item
    page_id={page._id}
    property={{
      id: "",
      type: "page",
      value: {
        workspace_id: $workspace_id_store,
        title: page.title,
      },
    }}
  />
{/if}

{#each display as display_id (display_id)}
  {@const property = properties.find((v) => v.id === display_id)}
  {#if property !== undefined}
    <Item
      page_id={page._id}
      property={{
        id: property.id,
        type: property.type,
        value: (() => {
          const value = page.properties?.find(
            (v) => v.id === property.id
          )?.value;
          if (value === undefined) return "";
          return value;
        })(),
      }}
    />
  {/if}
{/each}
