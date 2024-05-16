<script lang="ts">
  import type { LayoutData } from "./$types";
  import Menu from "./Menu.svelte";

  export let data: LayoutData;
</script>

<div class="top">
  <div class="menu">
    <Menu {data} />
  </div>
  <div class="contents">
    <slot />
  </div>
</div>

<style>
  .top {
    display: flex;
  }

  .menu {
    width: 15rem;
  }

  .contents {
    width: calc(100% - 15rem);
  }
</style>
