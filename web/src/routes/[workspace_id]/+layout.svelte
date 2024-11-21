<script lang="ts" context="module">
  import { type Writable } from "svelte/store";

  export const main_page_path_id = "page_path";
  export type main_page_path_type = Writable<string[]>;

  export const main_page_title_id = "page_title";
  export type main_page_title_type = Writable<string>;
</script>

<script lang="ts">
  import { onMount, setContext } from "svelte";
  import type { LayoutData } from "./$types";
  import Menu from "../../lib/gui/workspace/Menu.svelte";
  import { workspace_contents_scroll_store } from "$lib/store/workspace";
  import { writable } from "svelte/store";
  import Split from "$lib/gui/common/Split.svelte";

  export let data: LayoutData;

  let content_dom: HTMLDivElement;

  let page_title_store = writable("");
  let page_path_store = writable([]);

  setContext(main_page_title_id, page_title_store);
  setContext(main_page_path_id, page_path_store);

  onMount(() => {
    content_dom.addEventListener("scroll", () => {
      $workspace_contents_scroll_store = content_dom.scrollTop;
    });
  });

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
      {page_title_store}
      {page_path_store}
      workspace_id={data.workspace_id}
      workspace_name={data.name}
      page_id={data.page_id}
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
