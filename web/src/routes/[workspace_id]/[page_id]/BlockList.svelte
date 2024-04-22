<script lang="ts">
  import Block from "./Block.svelte";
  import Button from "$lib/gui/common/Button.svelte";
  import type { PageData } from "./$types";

  export let blocks: {
    _id: string;
    type: "paragraph";
    data: unknown;
  }[];

  export let data: PageData;
</script>

{#each blocks as block}
  <Block {block} />
{/each}

<Button
  on:click={async () => {
    await fetch(`http://${location.hostname}:8080/blocks`, {
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
  }}
>
  Create Block
</Button>
