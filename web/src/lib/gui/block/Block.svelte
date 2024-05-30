<script lang="ts">
  import Paragraph from "$lib/gui/block/Paragraph.svelte";
  import type { blockListStore } from "$lib/types/block_list";
  import Heading from "./Heading.svelte";
  import RdbView from "./RdbView.svelte";

  export let page_id: string;

  export let block: {
    _id: string;
    type: string;
    data: unknown;
  };

  export let block_list: blockListStore;

  let block_data: { _id: string; text: string } | null;
  $: block_data = (() => {
    if (
      (block.type === "paragraph" || block.type === "heading") &&
      typeof block.data === "object" &&
      block.data !== null &&
      "text" in block.data &&
      typeof block.data.text === "string"
    ) {
      return {
        _id: block._id,
        text: block.data.text,
      };
    } else if (
      block.type === "rdb_view" &&
      typeof block.data === "object" &&
      block.data !== null &&
      "rdb_id" in block.data &&
      typeof block.data.rdb_id === "string"
    ) {
      return {
        _id: block.data.rdb_id,
        text: "",
      };
    }
    return null;
  })();
</script>

<div>
  {#if block.type === "paragraph"}
    <Paragraph {block_data} {page_id} {block_list} />
  {:else if block.type === "rdb_view"}
    <RdbView rdb_id={block_data?._id} />
  {:else if block.type === "heading"}
    <Heading {block_data} {page_id} {block_list} />
  {:else}
    <div>Undefined Block Type</div>
  {/if}
</div>
