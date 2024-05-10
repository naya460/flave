<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";
  import TextInput from "../common/TextInput.svelte";

  export let rdb_id: string;

  export let properties:
    | {
        id: string;
        type: string;
        name: string;
      }[]
    | undefined;
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

<div>
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
