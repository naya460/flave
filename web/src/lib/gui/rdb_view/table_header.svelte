<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";
  import TextInput from "../common/TextInput.svelte";

  export let rdb_id: string;

  export let properties: {
    id: string;
    type: string;
    name: string;
  }[];

  export let display: string[];

  export let property_menu_hidden: boolean;
</script>

{#if display.includes("page") === true}
  <div class="item" style:padding="0.2rem 0.5rem" style:box-sizing="border-box">
    page
  </div>
{/if}

{#if properties !== undefined}
  {#each display as display_id}
    {@const property = properties.find((v) => v.id === display_id)}
    {#if property !== undefined}
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
    {/if}
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
      property_menu_hidden = false;
    }}
  >
    ...
  </Button>
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
