<script lang="ts">
  import TextInput from "$lib/gui/common/TextInput.svelte";

  export let page_id: string;
  export let rdb_id: string;

  export let properties: {
    id: string;
    value: string;
  }[];

  async function getRdbProperties(): Promise<{ id: string; name: string }[]> {
    const res = await fetch(`http://${location.hostname}:8080/rdbs/${rdb_id}`, {
      credentials: "include",
    });
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
          await fetch(
            `http://${location.hostname}:8080/rdbs/${rdb_id}/property/${rdb_property.id}`,
            {
              method: "PATCH",
              mode: "cors",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: event.currentTarget.value }),
            }
          );
        }}
      />
      <TextInput
        style={{ outline: false }}
        value={properties.some((v) => v.id === rdb_property.id)
          ? properties.find((v) => v.id === rdb_property.id)?.value
          : ""}
        onChange={async (event) => {
          await fetch(
            `http://${location.hostname}:8080/pages/${page_id}/property/${rdb_property.id}`,
            {
              method: "PATCH",
              mode: "cors",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ value: event.currentTarget.value }),
            }
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
