<script lang="ts">
  import Item from "$lib/gui/rdb_view/table_item.svelte";

  export let workspace_id: string;

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
      value: string;
    }[];
  };
</script>

<Item
  page_id={page._id}
  property={{
    id: "",
    type: "page",
    value: {
      workspace_id: workspace_id,
      title: page.title,
    },
  }}
/>
{#each properties as property}
  <Item
    page_id={page._id}
    property={{
      id: property.id,
      type: property.type,
      value: (() => {
        const value = page.properties?.find((v) => v.id === property.id)?.value;
        if (value === undefined) return "";
        return value;
      })(),
    }}
  />
{/each}
