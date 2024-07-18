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

  export let display: string[];

  export let property_menu_hidden: boolean;
  export let add_property_menu_hidden: boolean;

  let context_id: string | null = null;
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
        <ContextMenu
          hidden={property.id !== context_id}
          hide_parent={() => {
            context_id = null;
          }}
        >
          <TextInput
            style={{ outline: false }}
            value={property.name}
            onChange={async (event) => {
              const value = event.currentTarget.value;
              await flvFetch(
                `rdbs/${rdb_id}/property/${property.id}`,
                "PATCH",
                {
                  name: value,
                }
              );
              const target_property = properties.find(
                (v) => v.id === property.id
              );
              if (target_property !== undefined) {
                target_property.name = value;
              }
              properties = properties;
              context_id = null;
            }}
          />
        </ContextMenu>
        <Button
          style={{
            buttonStyle: "text",
            width: "100%",
            textAlign: "left",
          }}
          on:click={() => {
            context_id = property.id;
          }}
        >
          {property.name}
        </Button>
      </div>
    {/if}
  {/each}
{/if}

<div style:display="flex" style:flex-direction="row">
  <Button
    style={{
      buttonStyle: "text",
    }}
    on:click={() => {
      add_property_menu_hidden = false;
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
