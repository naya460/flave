<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
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
    if (block_data?._id === "") return;

    await flvFetch(`blocks/${block_data?._id}`, "PATCH", {
      data: { text: own.innerText },
    });
  }

  async function onCreate() {
    if (block_data?._id !== "") return;
    if (own.innerText === "") return;

    const res = await flvFetch(`blocks`, "POST", {
      page_id: page_id,
      next_of:
        $block_list.length < 2 ? null : $block_list[$block_list.length - 2]._id,
      type: "paragraph",
      data: { text: "" },
    });
    $block_list[$block_list.length - 1] = {
      _id: await res.text(),
      type: "paragraph",
      data: { text: own.innerText },
    };
    $block_list.push({
      _id: "",
      type: "paragraph",
      data: { text: "" },
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

      if (block_data?._id === "") {
        onCreate();
        return;
      }

      if (event.key === "Enter") {
        const res = flvFetch(`blocks`, "POST", {
          page_id: page_id,
          next_of: block_data._id,
          type: "paragraph",
          data: { text: "" },
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
          const res = flvFetch(`blocks/${block_data._id}`, "DELETE");

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
