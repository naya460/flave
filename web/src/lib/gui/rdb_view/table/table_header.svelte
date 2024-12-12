<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../../common/Button.svelte";
  import ContextMenu from "../../common/ContextMenu.svelte";
  import TextInput from "../../common/TextInput.svelte";
  import type { PropertyHeader } from "../types";

  export let rdb_id: string | undefined;

  export let properties: PropertyHeader[];

  export let set_menu: (menu: { dir: string; title: string }[]) => void;

  let context_id: string | null = null;
</script>

<div class="item" style:width="4rem" />

{#if properties !== undefined}
  {#each properties as property (property.id)}
    <div class="item">
      {#if property.type === "page"}
        <div
          class="item"
          style:padding="0.2rem 0.5rem"
          style:box-sizing="border-box"
        >
          page
        </div>
      {:else}
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
              if (rdb_id === undefined) return;
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
          {#if property.type === "relation"}
            <div style:display="flex" style:flex-direction="row">
              <input
                type="checkbox"
                checked={(() => {
                  if (
                    typeof property.option === "object" &&
                    property.option !== null
                  ) {
                    if (
                      "only" in property.option &&
                      typeof property.option.only === "boolean"
                    ) {
                      return property.option.only;
                    }
                  }
                  return false;
                })()}
                on:change={(event) => {
                  if (rdb_id === undefined) return;
                  let target_property = properties.find(
                    (v) => v.id === property.id
                  );
                  if (target_property !== undefined) {
                    if (
                      target_property.option !== undefined &&
                      target_property.option !== null &&
                      typeof target_property.option === "object" &&
                      "only" in target_property.option &&
                      typeof target_property.option.only === "boolean"
                    ) {
                      target_property.option.only = event.currentTarget.checked;
                    } else {
                      Object.assign(target_property, {
                        option: {
                          only: event.currentTarget.checked,
                        },
                      });
                    }
                    properties = [...properties];

                    flvFetch(
                      `rdbs/${rdb_id}/property/${property.id}`,
                      "PATCH",
                      {
                        option: {
                          only: event.currentTarget.checked,
                        },
                      }
                    );
                  }
                }}
              />
              <div>only</div>
            </div>
          {/if}
        </ContextMenu>
        <Button
          style={{
            buttonStyle: "text",
            width: "100%",
            textAlign: "left",
          }}
          on:click={() => {
            if (rdb_id === undefined) return;
            context_id = property.id;
          }}
        >
          {property.name}
        </Button>
      {/if}
    </div>
  {/each}
{/if}

{#if rdb_id !== undefined}
  <div style:display="flex" style:flex-direction="row">
    <Button
      style={{
        buttonStyle: "text",
      }}
      on:click={() => {
        set_menu([
          { dir: "properties", title: "properties" },
          { dir: "add property", title: "add property" },
        ]);
      }}
    >
      +
    </Button>
    <Button
      style={{
        buttonStyle: "text",
      }}
      on:click={() => {
        set_menu([{ dir: "properties", title: "properties" }]);
      }}
    >
      …
    </Button>
  </div>
{/if}

<style>
  .item {
    width: 20rem;
    flex-shrink: 0;
    border: 0 solid #dddddd;
    border-right-width: 1px;
    box-sizing: border-box;
  }
</style>
