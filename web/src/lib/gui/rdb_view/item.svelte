<script lang="ts">
  import ItemCheckbox from "./item_checkbox.svelte";
  import ItemPage from "./item_page.svelte";
  import ItemRelation from "./item_relation.svelte";
  import ItemText from "./item_text.svelte";

  export let property: {
    id: string;
    type: string;
    option?: unknown;
    value: unknown;
  };

  export let page_id: string;
</script>

{#if property.type === "text" || property.type === undefined}
  <ItemText {page_id} property_id={property.id} value={property.value} />
{:else if property.type === "page"}
  <ItemPage {page_id} value={property.value} />
{:else if property.type === "checkbox"}
  <ItemCheckbox {page_id} property_id={property.id} value={property.value} />
{:else if property.type === "relation"}
  <ItemRelation
    {page_id}
    property_id={property.id}
    option={property.option}
    value={property.value}
  />
{:else if property.type === "validated"}
  <div>
    {#if typeof property.value === "object" && property.value !== null && "result" in property.value}
      {#if property.value.result === null}
        <div>?</div>
      {:else if property.value.result === true}
        <div>v</div>
      {:else}
        <div>x</div>
      {/if}
    {/if}
  </div>
{/if}
