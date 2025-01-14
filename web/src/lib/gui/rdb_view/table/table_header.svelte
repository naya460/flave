<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import type { RdbSelectClause } from "$lib/gui/rdb_query_view/query/select";
  import type { PropertyList } from "$lib/gui/rdb_query_view/rdb_data/property_list";
  import Button from "../../common/Button.svelte";
  import ContextMenu from "../../common/ContextMenu.svelte";
  import TextInput from "../../common/TextInput.svelte";

  export let rdb_id: string | null;
  export let menu_enable: boolean;

  export let property_list: PropertyList;
  export let rdb_select_clause: RdbSelectClause;

  export let set_menu: (menu: { dir: string; title: string }[]) => void;

  let context_id: string | null = null;
</script>

<div class="item" style:width="4rem" />

{#if property_list !== undefined}
  {#each $rdb_select_clause.rdb_select_resources.display_properties as property (property.id)}
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
            if (menu_enable === false) return;

            const value = event.currentTarget.value;
            await flvFetch(`rdbs/${rdb_id}/property/${property.id}`, "PATCH", {
              name: value,
            });
            property_list.renameProperty(property.id, value);
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
                if (menu_enable === false) return;

                property_list.setPropertyOption(property.id, {
                  rdb_id: property.option.rdb,
                  only: event.currentTarget.checked,
                });

                flvFetch(`rdbs/${rdb_id}/property/${property.id}`, "PATCH", {
                  option: {
                    only: event.currentTarget.checked,
                  },
                });
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
          if (property.type === "page") return;
          if (menu_enable === false) return;
          context_id = property.id;
        }}
      >
        {property.name}
      </Button>
    </div>
  {/each}
{/if}

{#if menu_enable}
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
