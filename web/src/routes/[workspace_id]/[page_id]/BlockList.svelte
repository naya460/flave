<script lang="ts">
  import Block from "../../../lib/gui/block/Block.svelte";
  import type { PageData } from "./$types";
  import type { blockListStore } from "$lib/types/block_list";
  import { writable } from "svelte/store";
  import { flvFetch } from "$lib/flv_fetch";
  import { setBlockList } from "$lib/gui/block/block_list_manager";
  import Button from "$lib/gui/common/Button.svelte";
  import Popup from "$lib/gui/common/Popup.svelte";

  let blocks: blockListStore = writable([]);
  let node: Node;
  let popup_hidden = true;

  let context_hidden = true;
  let context_id = "";

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

  setBlockList(blocks);
</script>

{#await getBlocks()}
  <div>Loading...</div>
{:then}
  <div bind:this={node}>
    {#each $blocks as block}
      <div class="block">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          draggable="true"
          on:dragstart={(event) => {
            event.dataTransfer?.setData("application/flv-blk-id", block._id);
          }}
          on:contextmenu={(event) => {
            context_id = block._id;
            context_hidden = false;
            event.preventDefault();
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

<Popup bind:hidden={context_hidden}>
  <Button
    style={{
      buttonStyle: "text",
      width: "100%",
      height: "2rem",
      textAlign: "left",
    }}
    on:click={() => {
      const res = flvFetch(`blocks`, "POST", {
        page_id: data.page_id,
        next_of: context_id,
        type: "paragraph",
        data: { text: "" },
      });

      res.then((v) => {
        v.text().then((w) => {
          if (typeof w !== "string") return;
          const index = $blocks.findIndex((v) => v._id === context_id);
          $blocks.splice(index + 1, 0, {
            _id: w,
            type: "paragraph",
            data: { text: "" },
          });
          $blocks = $blocks;
        });
      });

      context_hidden = true;
    }}
  >
    Insert Paragraph
  </Button>
  <Button
    style={{
      buttonStyle: "text",
      width: "100%",
      height: "2rem",
      textAlign: "left",
    }}
    on:click={() => {
      popup_hidden = false;
      context_hidden = true;
    }}
  >
    Insert RDB View
  </Button>
  <Button
    style={{
      buttonStyle: "text",
      width: "100%",
      height: "2rem",
      textAlign: "left",
    }}
    on:click={() => {
      const res = flvFetch(`blocks/${context_id}`, "DELETE");
      res.then(() => {
        const index = $blocks.findIndex((block) => block._id === context_id);
        $blocks.splice(index, 1);
        $blocks = $blocks;
      });
      context_hidden = true;
    }}
  >
    Delete Block
  </Button>
</Popup>

<Popup bind:hidden={popup_hidden}>
  {#await flvFetch(`workspaces/${data.workspace_id}/rdbs`) then res}
    {#await res.json() then value}
      <div>Insert RDB View</div>
      {#each value as rdb}
        <Button
          style={{
            buttonStyle: "text",
            width: "100%",
            height: "2rem",
          }}
          on:click={() => {
            const res = flvFetch(`blocks`, "POST", {
              page_id: data.page_id,
              next_of: context_id,
              type: "rdb_view",
              data: { rdb_id: rdb._id },
            });

            res.then((v) => {
              v.text().then((w) => {
                if (typeof w !== "string") return;
                const index = $blocks.findIndex(
                  (block) => block._id === context_id
                );
                $blocks.splice(index + 1, 0, {
                  _id: w,
                  type: "rdb_view",
                  data: { rdb_id: rdb._id },
                });
                $blocks = $blocks;
              });
            });
            popup_hidden = true;
          }}
        >
          {rdb.title}
        </Button>
      {/each}
    {/await}
  {/await}
</Popup>

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
