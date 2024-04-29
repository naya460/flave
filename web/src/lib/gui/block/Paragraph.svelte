<script lang="ts">
  import type { blockListStore } from "$lib/types/block_list";
  import { onDestroy } from "svelte";

  export let page_id: string;

  export let block_data: {
    _id: string;
    text: string;
  } | null;

  export let block_list: blockListStore;

  let own: HTMLDivElement;
  let timeout: number | undefined = undefined;

  async function timeoutHandler() {
    await applyUpdate();
    clearTimeout(timeout);
    timeout = undefined;
  }

  async function applyUpdate() {
    await fetch(`http://${location.hostname}:8080/blocks/${block_data?._id}`, {
      method: "PATCH",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: { text: own.innerText },
      }),
    });
  }

  onDestroy(() => {
    clearTimeout(timeout);
  });
</script>

{#if block_data !== null}
  <div
    class="top"
    contenteditable={true}
    role="textbox"
    tabindex={0}
    bind:this={own}
    on:keydown={(event) => {
      if (!timeout) {
        timeout = setInterval(timeoutHandler, 1000);
      }

      if (event.key === "Enter") {
        const res = fetch(`http://${location.hostname}:8080/blocks`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page_id: page_id,
            next_of: block_data._id,
            type: "paragraph",
            data: { text: "" },
          }),
        });

        res.then((v) => {
          v.text().then((w) => {
            if (typeof w !== "string") return;
            const index = $block_list.findIndex(
              (v) => v._id === block_data._id
            );
            $block_list.splice(index + 1, 0, {
              _id: w,
              type: "paragraph",
              data: { text: "" },
            });
            $block_list = $block_list;
          });
        });

        event.preventDefault();
      } else if (event.key === "Backspace") {
        if (own.innerText.length === 0) {
          const res = fetch(
            `http://${location.hostname}:8080/blocks/${block_data._id}`,
            {
              method: "DELETE",
              mode: "cors",
              credentials: "include",
            }
          );

          res.then((v) => {
            if (v.ok === false) return;

            const index = $block_list.findIndex(
              (v) => v._id === block_data._id
            );
            $block_list.splice(index, 1);
            $block_list = $block_list;
          });

          event.preventDefault();
        }
      }
    }}
  >
    {block_data.text}
  </div>
{/if}

<style>
  .top {
    outline: none;
  }
</style>
