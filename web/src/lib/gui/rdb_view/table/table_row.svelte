<script lang="ts">
  import TableItem from "./table_item.svelte";
  import { workspace_id_store } from "$lib/store/workspace";
  import { toProperty, type PropertyHeader } from "../types";

  export let properties: PropertyHeader[];

  export let constraints: {
    id: string;
    type: string;
    option: object;
  }[];

  export let page: {
    _id: string;
    title: string;
    properties?: {
      id: string;
      value: unknown;
    }[];
    constraints?: {
      id: string;
      result: boolean;
    }[];
  };

  export let display: string[];

  let result = (() => {
    for (const v of constraints) {
      const tmp = page.constraints?.find((w) => w.id === v.id);
      if (tmp !== undefined) {
        if (tmp.result === false) return false;
      } else {
        return null;
      }
    }
    return true;
  })();
</script>

<TableItem
  page_id={page._id}
  property={{
    id: "",
    type: "validated",
    value: {
      result,
    },
  }}
  style={{
    width: "4rem",
  }}
/>

{#if display.includes("page") === true}
  <TableItem
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
    <TableItem
      page_id={page._id}
      property={toProperty(
        property,
        page.properties?.find((v) => v.id === property.id)?.value
      )}
    />
  {/if}
{/each}
