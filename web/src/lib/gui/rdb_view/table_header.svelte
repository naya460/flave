<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";
  import ContextMenu from "../common/ContextMenu.svelte";
  import TextInput from "../common/TextInput.svelte";

  export let rdb_id: string;

  export let properties: {
    id: string;
    type: string;
    name: string;
  }[];

  let popup_hidden = true;
</script>

<div class="item" style:padding="0.2rem 0.5rem" style:box-sizing="border-box">
  page
</div>

{#if properties !== undefined}
  {#each properties as property}
    <div class="item">
      <TextInput
        style={{ outline: false }}
        value={property.name}
        onChange={async (event) => {
          await flvFetch(`rdbs/${rdb_id}/property/${property.id}`, "PATCH", {
            name: event.currentTarget.value,
          });
        }}
      />
    </div>
  {/each}
{/if}

<div style:display="flex" style:flex-direction="row">
  <Button
    style={{
      buttonStyle: "text",
    }}
    on:click={async () => {
      await flvFetch(`rdbs/${rdb_id}/property`, "POST", {
        type: "text",
        name: "new property",
      });
    }}
  >
    +
  </Button>
  <Button
    style={{
      buttonStyle: "text",
    }}
    on:click={() => {
      popup_hidden = false;
    }}
  >
    ...
  </Button>
  <div style:position="absolute" style:z-index={100} style:right="20rem">
    <ContextMenu bind:hidden={popup_hidden}>
      {#each properties as property}
        <div>{property.name}</div>
      {/each}
    </ContextMenu>
  </div>
</div>

<style>
  .item {
    width: 20rem;
    flex-shrink: 0;
    border: 0 solid #dddddd;
    border-right-width: 1px;
    box-sizing: border-box;
  }
</style>
