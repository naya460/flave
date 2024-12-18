<script lang="ts">
  import TableItem from "./table_item.svelte";
  import { toProperty, type PropertyHeader } from "../types";
  import type { PageType } from "$lib/gui/rdb_query_view/rdb_page_list";

  export let properties: PropertyHeader[];

  export let constraints: {
    id: string;
    type: string;
    option: object;
  }[];

  export let page: PageType;

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
