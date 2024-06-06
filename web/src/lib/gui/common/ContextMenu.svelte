<script lang="ts">
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
</script>

{#if hidden === false}
  <div class="top" style:position={"relative"}>
    {#if submenu === false}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div on:click={setHidden} class="background" />
    {/if}
    <!-- <div on:click={setHidden} class="background" /> -->
    <div class="contents">
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
    </div>
  </div>
{/if}

<style>
  .top {
    position: absolute;
    display: flex;
    left: 0;
    top: 0;
    width: 10rem;
    height: 10rem;
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
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgb(255, 255, 255);
    width: 20rem;
    height: 20rem;
    padding: 1rem;
    box-sizing: border-box;
    border-radius: 0.5rem;
    box-shadow: 0 0 6px -2px rgba(0, 0, 0, 128);
  }
</style>
