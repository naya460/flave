<script lang="ts">
  import { beforeUpdate } from "svelte";

  export let width = 100;
  export let min_width = 200;

  export let afterResize: (size: number) => void = () => {};

  let top_dom: HTMLDivElement;
  let dragging = false;

  window.addEventListener("resize", () => {
    if (
      width >= top_dom.clientWidth / 2 &&
      top_dom.clientWidth >= min_width * 2
    ) {
      width = top_dom.clientWidth / 2;
    }
  });

  beforeUpdate(() => {
    if (top_dom === undefined) return;
    if (width < min_width) {
      width = min_width;
    }
    if (width > top_dom.clientWidth / 2) {
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
    afterResize(width);
  }}
  on:mouseleave={() => {
    dragging = false;
    afterResize(width);
  }}
  on:mousemove={(event) => {
    if (dragging === false) return;
    width = event.pageX;
    event.preventDefault();
  }}
>
  <div style:width={`${width}px`}>
    <slot name="left" />
  </div>
  <div class="split">
    <div
      on:mousedown={() => {
        dragging = true;
      }}
    />
  </div>
  <div style:width={`calc(100% - ${width}px)`}>
    <slot name="right" />
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
</style>
