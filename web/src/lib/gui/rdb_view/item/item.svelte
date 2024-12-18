<script lang="ts">
  import type { Property } from "../types";
  import Checkbox from "./checkbox.svelte";
  import Page from "./page.svelte";
  import Relation from "./relation.svelte";
  import Text from "./text.svelte";

  export let property: Property | null;

  export let page_id: string | null;
</script>

{#if property === null}
  <div>Invalid Property</div>
{:else if property.type === "text"}
  <Text {page_id} property_id={property.id} value={property.value} />
{:else if property.type === "page"}
  <Page value={property.value} />
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
