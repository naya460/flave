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

  export let data: LayoutData;

  let width = (() => {
    const item = localStorage.getItem("menu_width");
    if (item === null) return 300;
    const num = parseInt(item);
    if (200 < num) return num;
    return 300;
  })();
  let dragging = false;

  let top_dom: HTMLDivElement;
  let content_dom: HTMLDivElement;

  let page_title_store = writable("");
  let page_path_store = writable([]);

  setContext(main_page_title_id, page_title_store);
  setContext(main_page_path_id, page_path_store);

  window.addEventListener("resize", () => {
    if (width >= top_dom.clientWidth / 2 && top_dom.clientWidth >= 400) {
      width = top_dom.clientWidth / 2;
    }
  });

  onMount(() => {
    content_dom.addEventListener("scroll", () => {
      $workspace_contents_scroll_store = content_dom.scrollTop;
    });
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="top"
  bind:this={top_dom}
  on:mouseup={() => {
    dragging = false;
    localStorage.setItem("menu_width", width.toString());
  }}
  on:mouseleave={() => {
    dragging = false;
    localStorage.setItem("menu_width", width.toString());
  }}
  on:mousemove={(event) => {
    if (dragging === false) return;
    if (200 < event.pageX && event.pageX < top_dom.clientWidth / 2) {
      width = event.pageX;
    }
    event.preventDefault();
  }}
>
  <div class="menu" style:width={`${width}px`}>
    <Menu
      {page_title_store}
      {page_path_store}
      workspace_id={data.workspace_id}
      workspace_name={data.name}
      page_id={data.page_id}
    />
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="split">
    <div
      on:mousedown={() => {
        dragging = true;
      }}
    />
  </div>
  <div
    bind:this={content_dom}
    class="contents"
    style:width={`calc(100% - ${width}px)`}
  >
    <slot />
  </div>
</div>

<style>
  .top {
    display: flex;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .menu {
    background-color: #f8f8f8;
    padding: 0.5rem;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .split {
    position: relative;
    width: 0;
    height: 100%;
  }

  .split div {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -0.2rem;
    width: 0.4rem;
    transition: background-color 0.1s ease-in-out;
    cursor: col-resize;
  }

  .split div:hover {
    background-color: #c0ddd0c0;
  }

  .contents {
    box-sizing: border-box;
    overflow-y: scroll;
  }
</style>
