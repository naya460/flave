<script lang="ts">
  import { afterUpdate } from "svelte";
  import Button from "./Button.svelte";

  type Item =
    | {
        name: string;
        onClick: () => void;
      }
    | {
        name: string;
        contents: Contents;
      };

  type Contents = Item[];

  export let hidden: boolean = true;

  export let contents: Contents = [];

  export let submenu = false;
  export let hide_parent: (() => void) | null = null;

  const setHidden = () => {
    hidden = true;
    selecting_submenu = null;
    if (hide_parent !== null) {
      hide_parent();
    }
  };

  let selecting_submenu: null | number = null;

  let contents_node: HTMLDivElement;
  let top_node: HTMLDivElement;

  let content_position_x: number;
  let content_position_y: number;

  afterUpdate(() => {
    if (hidden === true) {
      contents_node.hidePopover();
    } else {
      content_position_x = top_node.getBoundingClientRect().x;
      content_position_y = top_node.getBoundingClientRect().y;
      contents_node.showPopover();
    }
  });
</script>

<div class="top" style:position={"relative"} bind:this={top_node}>
  {#if submenu === false && hidden === false}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click={setHidden} class="background" />
  {/if}
  <!-- <div on:click={setHidden} class="background" /> -->
  <div
    class="contents"
    popover="manual"
    bind:this={contents_node}
    style:left={`${content_position_x}px`}
    style:top={`${content_position_y}px`}
  >
    {#if $$slots.default === true}
      <slot />
    {:else}
      {#each contents as item, i}
        {#if "contents" in item}
          <Button
            on:click={() => (selecting_submenu = i)}
            style={{
              buttonStyle: "text",
              width: "100%",
              height: "2rem",
              textAlign: "left",
            }}
          >
            {item.name}
            {">"}
          </Button>
          <div style:position="absolute">
            <svelte:self
              contents={item.contents}
              hidden={selecting_submenu !== i}
              submenu={true}
              hide_parent={setHidden}
            />
          </div>
        {:else if "onClick" in item}
          <Button
            on:click={() => {
              item.onClick();
              setHidden();
            }}
            on:mouseenter={() => (selecting_submenu = null)}
            style={{
              buttonStyle: "text",
              width: "100%",
              height: "2rem",
              textAlign: "left",
            }}
          >
            {item.name}
          </Button>
        {:else}
          <div>ERROR</div>
        {/if}
      {/each}
    {/if}
  </div>
</div>

<style>
  .top {
    position: absolute;
    display: flex;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    align-items: center;
    justify-content: center;
  }

  .background {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0);
  }

  .contents {
    position: fixed;
    background-color: rgb(255, 255, 255);
    width: 20rem;
    height: 20rem;
    padding: 1rem;
    box-sizing: border-box;
    border-radius: 0.5rem;
    box-shadow: 0 0 6px -2px rgba(0, 0, 0, 128);
    border: none;
    margin: 0;
  }
</style>
