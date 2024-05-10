<script lang="ts">
  import ItemPage from "./item_page.svelte";
  import ItemText from "./item_text.svelte";

  export let property: {
    id: string;
    type: string;
    value: unknown;
  };

  export let page_id: string;
</script>

{#if property.type === "text" || property.type === undefined}
  <ItemText {page_id} property_id={property.id} value={property.value} />
{:else if property.type === "page"}
  <ItemPage {page_id} value={property.value} />
{/if}
