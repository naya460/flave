<script lang="ts">
  import Block from "../../../lib/gui/block/Block.svelte";
  import type { PageData } from "./$types";
  import type { blockListStore } from "$lib/types/block_list";
  import { writable } from "svelte/store";
  import { flvFetch } from "$lib/flv_fetch";

  let blocks: blockListStore = writable([]);

  export let data: PageData;

  async function getBlocks() {
    const res = await flvFetch(`pages/${data.page_id}/blocks`);
    let list: {
      _id: string;
      type: "paragraph";
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
  {#each $blocks as block}
    <div class="block">
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        draggable="true"
        on:dragstart={(event) => {
          event.dataTransfer?.setData("application/flv-blk-id", block._id);
        }}
      >
        ::
      </div>
      <Block {block} page_id={data.page_id} block_list={blocks} />
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
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
          await flvFetch(`blocks/${block_id}`, "PATCH", { next_of: block._id });

          const block_list = $blocks;
          const target_index = block_list.findIndex((v) => v._id === block_id);
          const [target] = block_list.splice(target_index, 1);
          const this_index = block_list.findIndex((v) => v._id === block._id);
          block_list.splice(this_index + 1, 0, target);
          $blocks = block_list;

          event.preventDefault();
        }}
      />
    </div>
  {/each}
{:catch}
  <div>Failed loading</div>
{/await}

<style>
  .block {
    margin: 0 4rem;
    position: relative;
  }
  .block div:first-child {
    position: absolute;
    left: -2rem;
    cursor: grab;
  }
  .block div ~ div {
    position: initial;
    width: 100%;
    height: 10px;
  }
</style>
