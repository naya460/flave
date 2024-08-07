<script lang="ts">
  import ContextMenu from "../common/ContextMenu.svelte";
  import MenuConstraint from "./menu_constraint.svelte";
  import MenuProperty from "./menu_property.svelte";

  export let rdb_id: string;
  export let block_id: string;

  export let properties: {
    id: string;
    type: string;
    name: string;
  }[];

  export let constraints: {
    id: string;
    type: string;
    option: object;
  }[];

  export let display: string[];

  export let popup_hidden = true;

  let properties_popup_hidden = true;
  let constraint_popup_hidden = true;
</script>

<div class="top">
  <ContextMenu
    bind:hidden={popup_hidden}
    contents={[
      {
        name: "properties",
        onClick: () => {
          properties_popup_hidden = false;
        },
      },
      {
        name: "constraints",
        onClick: () => {
          constraint_popup_hidden = false;
        },
      },
    ]}
  />
</div>

<MenuProperty
  {block_id}
  {properties}
  bind:display
  bind:popup_hidden={properties_popup_hidden}
/>

<MenuConstraint
  {rdb_id}
  {properties}
  {constraints}
  bind:popup_hidden={constraint_popup_hidden}
/>

<style>
  .top {
    position: absolute;
    top: 0;
    right: 20rem;
    z-index: 1;
  }
</style>
