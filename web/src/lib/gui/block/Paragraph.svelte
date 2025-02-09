<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import type {
    blockListStore,
    TextFunctionsType,
  } from "$lib/types/block_list";
  import { onDestroy } from "svelte";
  import {
    concatEnd,
    deleteBlock,
    insertBlock,
    onKeyDown,
    setBegin,
    setCursor,
    setEnd,
    setText,
  } from "./Paragraph";

  export let page_id: string;

  export let block_data: {
    _id: string;
    text: string;
  };

  export let block_list: blockListStore;

  export let style: {
    fontSize: `${number}rem`;
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

  export const text_functions: TextFunctionsType = {
    setEnd: () => setEnd(own),
    setBegin: () => setBegin(own),
    setCursor: (left: number) => {
      setCursor(own, left, {
        family: "sans-serif",
        size: parseFloat(style.fontSize),
      });
    },
    concatEnd: (text: string) => concatEnd(own, block_data._id, text),
    deleteBlock: () => {
      $block_list = deleteBlock($block_list, block_data._id);
    },
    insertBlock: (type, data) => {
      insertBlock(page_id, block_data._id, type, data, (id) => {
        const index = $block_list.findIndex((v) => v._id === block_data._id);
        $block_list.splice(index + 1, 0, {
          _id: id,
          type,
          data,
        });
        $block_list = $block_list;
      });
    },
    setText: (text) => setText(own, block_data._id, text),
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
      const changed = onKeyDown(
        event,
        $block_list.filter((v) => v?.text_functions !== undefined),
        { family: "sans-serif", size: parseFloat(style.fontSize) }
      );

      if (!timeout && changed) {
        timeout = setInterval(timeoutHandler, 1000);
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
    font-family: sans-serif;
  }
</style>
