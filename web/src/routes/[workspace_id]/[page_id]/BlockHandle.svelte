<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import ContextMenu from "$lib/gui/common/ContextMenu.svelte";
  import { selecting_block_store } from "$lib/store/page";
  import type { blockListStore } from "$lib/types/block_list";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  export let blocks: blockListStore;

  let block_id: string;

  let context_hidden = true;
  let context_id = "";

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

  let rdb_list: {
    _id: string;
    title: string;
  }[] = [];

  onMount(async () => {
    const res = await flvFetch(`workspaces/${data.workspace_id}/rdbs`);
    rdb_list = await res.json();
  });
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

<div
  style:left={`${position_x}px`}
  style:top={`${position_y}px`}
  style:position={"fixed"}
>
  <ContextMenu
    bind:hidden={context_hidden}
    contents={[
      {
        name: "Insert Paragraph",
        onClick: () => {
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
        },
      },
      {
        name: "Insert Heading",
        contents: (() => {
          let list = [];
          for (let i = 0; i < 3; i++) {
            list.push({
              name: `Heading ${i + 1}`,
              onClick: () => {
                const res = flvFetch("blocks", "POST", {
                  page_id: data.page_id,
                  next_of: context_id,
                  type: "heading",
                  data: { text: "", level: 1 },
                });

                res.then((v) => {
                  v.text().then((w) => {
                    if (typeof w !== "string") return;
                    const index = $blocks.findIndex(
                      (v) => v._id === context_id
                    );
                    $blocks.splice(index + 1, 0, {
                      _id: w,
                      type: "heading",
                      data: { text: "", level: i + 1 },
                    });
                    $blocks = $blocks;
                  });
                });

                context_hidden = true;
              },
            });
          }
          return list;
        })(),
      },
      {
        name: "Insert RDB View",
        contents: (() => {
          return rdb_list.map((rdb) => {
            return {
              name: rdb.title,
              onClick: () => {
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
              },
            };
          });
        })(),
      },
      {
        name: "Delete Block",
        onClick: () => {
          const res = flvFetch(`blocks/${context_id}`, "DELETE");
          res.then(() => {
            const index = $blocks.findIndex(
              (block) => block._id === context_id
            );
            $blocks.splice(index, 1);
            $blocks = $blocks;
          });
          context_hidden = true;
        },
      },
    ]}
  />
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
