<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import type { blockListStore } from "$lib/types/block_list";
  import { onDestroy } from "svelte";
  import { onKeyDown, setEnd } from "./Paragraph";

  export let page_id: string;

  export let block_data: {
    _id: string;
    text: string;
  };

  export let block_list: blockListStore;

  export let style: {
    fontSize?: `${number}${"px" | "rem"}`;
  } = {
    fontSize: "1rem",
  };

  export let updateHandler = async (id: string, text: string) => {
    await flvFetch(`blocks/${id}`, "PATCH", {
      data: { text },
    });
  };

  export let own: HTMLDivElement;
  let timeout: number | undefined = undefined;

  export const text_functions = {
    setEnd: () => {
      setEnd(own);
    },
  };

  async function timeoutHandler() {
    if (block_data !== null) {
      await updateHandler(block_data._id, own.innerText);
    }
    clearTimeout(timeout);
    timeout = undefined;
  }

  onDestroy(() => {
    clearTimeout(timeout);
  });
</script>

{#if block_data !== null}
  <div
    class="top"
    contenteditable="true"
    unselectable="off"
    role="textbox"
    tabindex={0}
    style:font-size={style.fontSize}
    bind:this={own}
    on:input={() => {
      if (!timeout) {
        timeout = setInterval(timeoutHandler, 1000);
      }
    }}
    on:keydown={(event) => {
      onKeyDown(
        event,
        $block_list.filter((v) => v?.text_functions !== undefined)
      );

      if (!timeout) {
        timeout = setInterval(timeoutHandler, 1000);
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
    min-height: 1rem;
  }
</style>
