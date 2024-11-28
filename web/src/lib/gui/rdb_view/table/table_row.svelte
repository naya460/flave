<script lang="ts">
  import TableItem from "./table_item.svelte";
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

{#each properties as property (property.id)}
  <TableItem
    page_id={page._id}
    property={toProperty(
      property,
      page.properties?.find((v) => v.id === property.id)?.value
    )}
  />
{/each}
