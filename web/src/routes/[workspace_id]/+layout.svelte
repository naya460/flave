<script lang="ts">
  import type { LayoutData } from "./$types";
  import Menu from "./Menu.svelte";

  export let data: LayoutData;
</script>

<div class="top">
  <div class="menu">
    <Menu {data} />
  </div>
  <div>
    <slot />
  </div>
</div>

<style>
  .top {
    display: grid;
    grid-template-columns: auto 1fr;
  }

  .menu {
    min-width: 10rem;
    max-width: 20rem;
  }
</style>
