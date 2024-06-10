<script lang="ts">
  import type { LayoutData } from "./$types";
  import Menu from "./Menu.svelte";

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

  window.addEventListener("resize", () => {
    if (width >= top_dom.clientWidth / 2 && top_dom.clientWidth >= 400) {
      width = top_dom.clientWidth / 2;
    }
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
    <Menu {data} />
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="split">
    <div
      on:mousedown={() => {
        dragging = true;
      }}
    />
  </div>
  <div class="contents thin-scrollbar" style:width={`calc(100% - ${width}px)`}>
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
