<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import Item from "$lib/gui/rdb_view/item/item.svelte";

  export let page_id: string;
  export let rdb_id: string;

  export let properties: {
    id: string;
    value: unknown;
  }[];

  async function getRdbProperties(): Promise<
    { id: string; type: string; name: string; option?: unknown }[]
  > {
    const res = await flvFetch(`rdbs/${rdb_id}`);
    return (await res.json()).properties;
  }
</script>

{#await getRdbProperties() then rdb_properties}
  {#each rdb_properties as rdb_property}
    <div class="property">
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
      <Item
        property={{
          ...rdb_property,
          value: properties.find((v) => v.id === rdb_property.id),
        }}
        {page_id}
      />
    </div>
  {/each}
{/await}

<style>
  .property {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 1.5rem;
    margin: 0.5rem 0;
  }
</style>
