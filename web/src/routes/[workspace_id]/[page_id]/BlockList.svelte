<script lang="ts">
  import Block from "./Block.svelte";
  import Button from "$lib/gui/common/Button.svelte";
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
    blocks = await res.json();
  }
</script>

{#await getBlocks()}
  <div>Loading...</div>
{:then}
  {#each blocks as block}
    <Block {block} />
  {/each}
{:catch}
  <div>Failed loading</div>
{/await}

<Button
  on:click={async () => {
    // create new block
    const post_res = await fetch(`http://${location.hostname}:8080/blocks`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_id: data.page_id,
        next_of: blocks.length === 0 ? null : blocks[blocks.length - 1]._id,
        type: "paragraph",
        data: { text: "" },
      }),
    });
    // get new block id
    const _id = await post_res.json();
    // push new block
    blocks = [
      ...blocks,
      {
        _id,
        type: "paragraph",
        data: { text: "" },
      },
    ];
  }}
>
  Create Block
</Button>
