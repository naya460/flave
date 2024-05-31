<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "$lib/gui/common/Button.svelte";
  import Popup from "$lib/gui/common/Popup.svelte";
  import { selecting_block_store } from "$lib/store/page";
  import type { blockListStore } from "$lib/types/block_list";
  import type { PageData } from "./$types";

  export let data: PageData;
  export let blocks: blockListStore;

  let block_id: string;

  let popup_hidden = true;
  let context_hidden = true;
  let context_id = "";

  let node: HTMLDivElement;

  $: {
    if (popup_hidden === true && context_hidden === true) {
      node?.hidePopover();
    } else {
      node?.showPopover();
    }
  }

  let enable = false;
  let position_x = 0;
  let position_y = 0;

  $: {
    if ($selecting_block_store === undefined || $selecting_block_store === "") {
      enable = false;
    } else {
      block_id = $selecting_block_store;

      const block = $blocks.find((w) => w._id === $selecting_block_store);

      const rect = block?.dom_node?.parentElement?.getBoundingClientRect();

      if (rect !== undefined) {
        position_x = rect.x;
        position_y = rect.y;
        enable = true;
      } else {
        enable = false;
      }
    }
  }
</script>

{#if enable === true}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="handle"
    style:left={`${position_x}px`}
    style:top={`${position_y}px`}
  >
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="top"
      draggable="true"
      contenteditable="false"
      on:dragstart={(event) => {
        event.dataTransfer?.setData("application/flv-blk-id", block_id);
      }}
      on:contextmenu={(event) => {
        context_id = block_id;
        context_hidden = false;
        event.preventDefault();
      }}
    >
      ::
    </div>
  </div>
{/if}

<div popover="manual" bind:this={node}>
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
        const res = flvFetch("blocks", "POST", {
          page_id: data.page_id,
          next_of: context_id,
          type: "heading",
          data: { text: "", level: 1 },
        });

        res.then((v) => {
          v.text().then((w) => {
            if (typeof w !== "string") return;
            const index = $blocks.findIndex((v) => v._id === context_id);
            $blocks.splice(index + 1, 0, {
              _id: w,
              type: "heading",
              data: { text: "", level: 1 },
            });
            $blocks = $blocks;
          });
        });

        context_hidden = true;
      }}
    >
      Insert Heading
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
</div>

<style>
  .top {
    position: absolute;
    left: -2rem;
    cursor: grab;
  }

  .handle {
    position: fixed;
  }
</style>
