<script lang="ts">
  import Block from "../../../lib/gui/block/Block.svelte";
  import type { PageData } from "./$types";
  import type { blockListStore } from "$lib/types/block_list";
  import { writable } from "svelte/store";
  import { flvFetch } from "$lib/flv_fetch";
  import BlockHandle from "./BlockHandle.svelte";
  import { selecting_block_store } from "$lib/store/page";

  let blocks: blockListStore = writable([]);
  let node: Node;

  export let data: PageData;

  async function getBlocks() {
    const res = await flvFetch(`pages/${data.page_id}/blocks`);
    let list: {
      _id: string;
      type: "paragraph" | "rdb_view";
      next_of: string | null;
      data: unknown;
    }[] = await res.json();

    for (const block of list.filter((v) => v.next_of === null)) {
      $blocks.push(block);
    }
    list = list.filter((v) => v.next_of !== null);

    while (list.length !== 0) {
      const last_id = $blocks[$blocks.length - 1]._id;
      const next_list = list.filter((v) => v.next_of === last_id);
      if (next_list.length === 0) break;
      for (const block of next_list) {
        $blocks.push(block);
      }
      list = list.filter((v) => v.next_of !== last_id);
    }

    $blocks.push({ _id: "", type: "paragraph", data: { text: "" } });
  }
</script>

{#await getBlocks()}
  <div>Loading...</div>
{:then}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    bind:this={node}
    contenteditable="true"
    style:outline="none"
    on:mousedown={(event) => {
      const exists = $blocks.some((v) => v.dom_node === event.target);
      if (exists === false) {
        event.preventDefault();
      }
    }}
    on:keydown={(event) => {
      if (event.key === "ArrowRight") {
        const selection = window.getSelection();
        if (selection === null) return;
        const focus_node = selection.focusNode;
        if (focus_node === null) return;

        if (selection.focusOffset === focus_node.nodeValue?.length) {
          event.preventDefault();
        }
      }

      if (event.key === "ArrowLeft") {
        const selection = window.getSelection();
        if (selection === null) return;
        const focus_node = selection.focusNode;
        if (focus_node === null) return;

        if (selection.focusOffset === 0) {
          event.preventDefault();
        }
      }

      if (event.key === "ArrowDown") {
        const selection = window.getSelection();
        if (selection === null) return;
        const focus_node = selection.focusNode;
        if (focus_node === null) return;

        const index = $blocks.findIndex(
          (v) => v.dom_node?.childNodes[0] === focus_node
        );
        if (index < 0) return;

        if (index === $blocks.length - 2) {
          event.preventDefault();
        } else if (
          $blocks[index + 1].dom_node?.childNodes[0].nodeValue?.length === 0 &&
          event.shiftKey === false
        ) {
          const node = $blocks[index + 1]?.dom_node;
          if (node !== undefined) {
            selection.setPosition(node);
          }
          event.preventDefault();
        }
      }

      if (event.key === "ArrowUp") {
        const selection = window.getSelection();
        if (selection === null) return;
        const focus_node = selection.focusNode;
        if (focus_node === null) return;

        const index = $blocks.findIndex(
          (v) => v.dom_node?.childNodes[0] === focus_node
        );
        if (index < 1) return;

        if (
          $blocks[index - 1].dom_node?.childNodes[0].nodeValue?.length === 0 &&
          event.shiftKey === false
        ) {
          const node = $blocks[index - 1]?.dom_node;
          if (node !== undefined) {
            selection.setPosition(node);
          }
          event.preventDefault();
        }
      }
    }}
    on:beforeinput={(event) => {
      const selection = window.getSelection();
      if (selection === null) return;
      if (selection.anchorNode !== selection.focusNode) {
        event.preventDefault();
      }
      if (
        event.inputType === "deleteContentBackward" &&
        selection.anchorOffset === 0
      ) {
        event.preventDefault();
      }
    }}
    on:input={(event) => {
      const selection = window.getSelection();
      if (selection === null) return;
      const focus_node = selection.focusNode;
      if (focus_node === null) return;

      const index = $blocks.findIndex(
        (v) => v.dom_node?.childNodes[0] === focus_node
      );

      const send_event = new InputEvent("input");

      $blocks[index].dom_node?.dispatchEvent(send_event);
      event.preventDefault();
    }}
  >
    {#each $blocks as block (block._id)}
      <div
        class="block"
        contenteditable="false"
        on:mouseenter={() => {
          $selecting_block_store = block._id;
        }}
      >
        <Block {block} page_id={data.page_id} block_list={blocks} />
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          style:height={"0.5rem"}
          contenteditable="false"
          on:dragover={(event) => {
            if (event.dataTransfer?.types.includes("application/flv-blk-id")) {
              event.dataTransfer.dropEffect = "move";
              event.preventDefault();
            }
          }}
          on:drop={async (event) => {
            const block_id = event.dataTransfer?.getData(
              "application/flv-blk-id"
            );
            if (block_id === block._id) return;

            // create new block
            await flvFetch(`blocks/${block_id}`, "PATCH", {
              next_of: block._id,
            });

            const block_list = $blocks;
            const target_index = block_list.findIndex(
              (v) => v._id === block_id
            );
            const [target] = block_list.splice(target_index, 1);
            const this_index = block_list.findIndex((v) => v._id === block._id);
            block_list.splice(this_index + 1, 0, target);
            $blocks = block_list;

            event.preventDefault();
          }}
        />
      </div>
    {/each}
  </div>
{:catch}
  <div>Failed loading</div>
{/await}

{#if node?.parentElement?.getBoundingClientRect !== undefined}
  {@const rect = node.parentElement.getBoundingClientRect()}
  <BlockHandle {blocks} {data} offset_x={rect.x} offset_y={rect.y} />
{/if}

<style>
  .block {
    margin: 0 4rem;
    position: relative;
  }
</style>
