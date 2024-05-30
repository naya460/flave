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

  function checkParagraph() {
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
    } else {
      return null;
    }
  }

  function checkRdbView() {
    if (
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
    } else {
      return null;
    }
  }

  function checkHeading() {
    if (
      block.type === "heading" &&
      typeof block.data === "object" &&
      block.data !== null &&
      "text" in block.data &&
      typeof block.data.text === "string" &&
      "level" in block.data &&
      typeof block.data.level === "number"
    ) {
      return {
        _id: block._id,
        text: block.data.text,
        level: block.data.level,
      };
    } else {
      return null;
    }
  }
</script>

<div>
  {#if block.type === "paragraph"}
    {@const block_data = checkParagraph()}
    {#if block_data !== null}
      <Paragraph {block_data} {page_id} {block_list} />
    {:else}
      <div>Error: Paragraph</div>
    {/if}
  {:else if block.type === "rdb_view"}
    {@const block_data = checkRdbView()}
    {#if block_data !== null}
      <RdbView rdb_id={block_data._id} />
    {:else}
      <div>Error: Rdb View</div>
    {/if}
  {:else if block.type === "heading"}
    {@const block_data = checkHeading()}
    {#if block_data !== null}
      <Heading {block_data} {page_id} {block_list} />
    {:else}
      <div>Error: Heading</div>
    {/if}
  {:else}
    <div>Undefined Block Type</div>
  {/if}
</div>
