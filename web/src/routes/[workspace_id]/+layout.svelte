<script lang="ts" context="module">
  import { type Writable } from "svelte/store";

  export const main_page_path_id = "page_path";
  export type main_page_path_type = Writable<string[]>;
</script>

<script lang="ts">
  import { setContext } from "svelte";
  import type { LayoutData } from "./$types";
  import Menu from "../../lib/gui/workspace/Menu.svelte";
  import { writable } from "svelte/store";
  import Split from "$lib/gui/common/Split.svelte";

  export let data: LayoutData;

  let content_dom: HTMLDivElement;

  let page_path_store = writable([]);

  setContext(main_page_path_id, page_path_store);

  let default_width = (() => {
    let item = localStorage.getItem("menu_width");
    if (item === null) {
      return 300;
    } else {
      return parseInt(item);
    }
  })();
</script>

<Split
  width={default_width}
  afterResize={(width) => localStorage.setItem("menu_width", width.toString())}
>
  <div slot="left" class="menu">
    <Menu
      {page_path_store}
      workspace_id={data.workspace_id}
      workspace_name={data.name}
      workspace_list={data.workspaces}
    />
  </div>
  <div bind:this={content_dom} slot="right" class="contents">
    <slot />
  </div>
</Split>

<style>
  .menu {
    background-color: #f8f8f8;
    padding: 0.5rem;
    box-sizing: border-box;
    overflow-y: auto;
    height: 100%;
  }

  .contents {
    box-sizing: border-box;
    overflow-y: scroll;
    height: 100%;
  }
</style>
