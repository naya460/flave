<script lang="ts">
  import BlockParagraph from "./Block_Paragraph.svelte";

  export let block: {
    _id: string;
    type: "paragraph";
    data: unknown;
  };

  function getParagraph(): { _id: string; text: string } | null {
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
  }
</script>

<div>
  {#if block.type === "paragraph"}
    <BlockParagraph block_data={getParagraph()} />
  {/if}
</div>
