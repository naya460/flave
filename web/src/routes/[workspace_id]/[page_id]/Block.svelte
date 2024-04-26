<script lang="ts">
  import type { PageData } from "./$types";
  import BlockParagraph from "./Block_Paragraph.svelte";

  export let data: PageData;

  export let block: {
    _id: string;
    type: "paragraph";
    data: unknown;
  };

  let block_data: { _id: string; text: string } | null;
  $: block_data = (() => {
    if (
      block.type === "paragraph" &&
      typeof block.data === "object" &&
      block.data !== null &&
      "text" in block.data &&
      typeof block.data.text === "string"
    ) {
      return {
        _id: block._id,
        text: block.data.text,
      };
    }
    return null;
  })();
</script>

<div>
  {#if block.type === "paragraph"}
    <BlockParagraph {block_data} {data} />
  {/if}
</div>
