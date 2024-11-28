<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import Item from "$lib/gui/rdb_view/item/item.svelte";
  import { toProperty, type PropertyHeader } from "../rdb_view/types";

  export let page_id: string;
  export let rdb_id: string;

  export let properties:
    | {
        id: string;
        value: unknown;
      }[]
    | undefined;

  async function getRdbProperties(): Promise<PropertyHeader[]> {
    const res = await flvFetch(`rdbs/${rdb_id}`);
    return (await res.json()).properties;
  }
</script>

{#await getRdbProperties() then rdb_properties}
  {#each rdb_properties as rdb_property (rdb_property.id)}
    <div class="property">
      <div class="text_input">
        <TextInput
          style={{ outline: false }}
          value={rdb_property.name}
          onChange={async (event) => {
            await flvFetch(
              `rdbs/${rdb_id}/property/${rdb_property.id}`,
              "PATCH",
              { name: event.currentTarget.value }
            );
          }}
        />
      </div>
      <div>
        <Item
          property={toProperty(
            rdb_property,
            properties?.find((v) => v.id === rdb_property.id)?.value
          )}
          {page_id}
        />
      </div>
    </div>
  {/each}
{/await}

<style>
  .property {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 1.5rem;
    margin: 0.5rem 0;
  }

  .text_input {
    height: 1.5rem;
  }
</style>
