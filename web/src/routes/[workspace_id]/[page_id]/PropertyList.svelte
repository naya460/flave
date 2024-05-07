<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import TextInput from "$lib/gui/common/TextInput.svelte";

  export let page_id: string;
  export let rdb_id: string;

  export let properties: {
    id: string;
    value: string;
  }[];

  async function getRdbProperties(): Promise<{ id: string; name: string }[]> {
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
      <TextInput
        style={{ outline: false }}
        value={properties.some((v) => v.id === rdb_property.id)
          ? properties.find((v) => v.id === rdb_property.id)?.value
          : ""}
        onChange={async (event) => {
          await flvFetch(
            `pages/${page_id}/property/${rdb_property.id}`,
            "PATCH",
            { value: event.currentTarget.value }
          );
        }}
      />
    </div>
  {/each}
{/await}

<style>
  .property {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>
