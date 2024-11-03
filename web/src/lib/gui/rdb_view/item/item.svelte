<script lang="ts">
  import Checkbox from "./checkbox.svelte";
  import Page from "./page.svelte";
  import Relation from "./relation.svelte";
  import Text from "./text.svelte";

  export let property: {
    id: string;
    type: string;
    option?: unknown;
    value: unknown;
  };

  export let page_id: string;
</script>

{#if property.type === "text" || property.type === undefined}
  <Text {page_id} property_id={property.id} value={property.value} />
{:else if property.type === "page"}
  <Page {page_id} value={property.value} />
{:else if property.type === "checkbox"}
  <Checkbox {page_id} property_id={property.id} value={property.value} />
{:else if property.type === "relation"}
  <Relation
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
