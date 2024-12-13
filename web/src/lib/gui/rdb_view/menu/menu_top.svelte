<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import type { RdbData } from "$lib/gui/rdb_query_view/rdb_data";
  import type { RdbFilteredProperties } from "$lib/gui/rdb_query_view/rdb_filtered_properties";
  import MenuConstraint from "./menu_constraint.svelte";
  import MenuFilter from "./menu_filter.svelte";
  import MenuProperty from "./menu_property.svelte";

  export let rdb_id: string;
  export let block_id: string;

  export let rdb_data: RdbData;
  export let rdb_filtered_properties: RdbFilteredProperties;

  export let filters: {
    id: string;
    value: string | boolean;
  }[] = [];

  let menu_hidden = true;

  let display_menu: { dir: string; title: string }[] = [];
  function menu_back() {
    display_menu.pop();
    display_menu = display_menu;
  }
  function menu_next(dir: string, title: string) {
    display_menu.push({ dir, title });
    display_menu = display_menu;
  }
  export function set_menu(menu: { dir: string; title: string }[]) {
    if (menu_hidden === true) {
      menu_hidden = false;
      display_menu = menu;
    } else {
      menu_hidden = true;
      display_menu = [];
    }
  }
</script>

{#if menu_hidden === false}
  <div class="contents">
    <div class="header">
      {#if display_menu.length !== 0}
        <Button
          style={{
            buttonStyle: "text",
          }}
          on:click={() => {
            menu_back();
          }}
        >
          {"<"}
        </Button>
      {:else}
        <div />
      {/if}
      <div>
        {display_menu.length === 0
          ? "RDB View Option"
          : display_menu[display_menu.length - 1].title}
      </div>
      <Button
        style={{
          buttonStyle: "text",
        }}
        on:click={() => {
          menu_hidden = true;
        }}
      >
        x
      </Button>
    </div>
    {#if display_menu.length === 0}
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
          textAlign: "left",
          height: "2rem",
        }}
        on:click={() => {
          menu_next("properties", "properties");
        }}
      >
        properties
      </Button>
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
          textAlign: "left",
          height: "2rem",
        }}
        on:click={() => {
          menu_next("constraints", "constraints");
        }}
      >
        constraints
      </Button>
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
          textAlign: "left",
          height: "2rem",
        }}
        on:click={() => {
          menu_next("filter", "filter");
        }}
      >
        filter
      </Button>
    {:else if display_menu[0].dir === "properties"}
      <MenuProperty
        {rdb_id}
        {block_id}
        {rdb_data}
        {rdb_filtered_properties}
        display_menu={display_menu.toSpliced(0, 1)}
        {menu_next}
      />
    {:else if display_menu[0].dir === "constraints"}
      <MenuConstraint
        {rdb_id}
        properties={$rdb_data.properties}
        constraints={$rdb_data.constraints}
        display_menu={display_menu.toSpliced(0, 1)}
        {menu_next}
      />
    {:else if display_menu[0].dir === "filter"}
      <MenuFilter
        properties={$rdb_data.properties}
        display_menu={display_menu.toSpliced(0, 1)}
        {menu_next}
        {menu_back}
        bind:filters
      />
    {/if}
  </div>
{/if}

<style>
  .contents {
    background-color: #ffffff;
    width: 15rem;
    height: 100%;
    box-shadow: 0 0 6px -3px rgba(0, 0, 0, 128);
    padding: 0.5rem;
    box-sizing: border-box;
    border-radius: 0.5rem;
  }

  .header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 0.5rem;
  }
</style>
