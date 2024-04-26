<script lang="ts">
  import Block from "./Block.svelte";
  import type { PageData } from "./$types";

  let blocks: {
    _id: string;
    type: "paragraph";
    data: unknown;
  }[] = [];

  export let data: PageData;

  async function getBlocks() {
    const res = await fetch(
      `http://${location.hostname}:8080/pages/${data.page_id}/blocks`,
      { credentials: "include" }
    );
    let list: {
      _id: string;
      type: "paragraph";
      next_of: string | null;
      data: unknown;
    }[] = await res.json();

    for (const block of list.filter((v) => v.next_of === null)) {
      blocks.push(block);
    }
    list = list.filter((v) => v.next_of !== null);

    while (list.length !== 0) {
      const last_id = blocks[blocks.length - 1]._id;
      const next_list = list.filter((v) => v.next_of === last_id);
      if (next_list.length === 0) break;
      for (const block of next_list) {
        blocks.push(block);
      }
      list = list.filter((v) => v.next_of !== last_id);
    }
  }
</script>

{#await getBlocks()}
  <div>Loading...</div>
{:then}
  {#each blocks as block}
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
      <Block {block} {data} />
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
          await fetch(`http://${location.hostname}:8080/blocks/${block_id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              next_of: block._id,
            }),
          });

          const target_index = blocks.findIndex((v) => v._id === block_id);
          const [target] = blocks.splice(target_index, 1);
          const this_index = blocks.findIndex((v) => v._id === block._id);
          blocks.splice(this_index + 1, 0, target);
          blocks = blocks;

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
