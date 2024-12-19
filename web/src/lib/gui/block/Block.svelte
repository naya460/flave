<script lang="ts">
  import Paragraph from "$lib/gui/block/Paragraph.svelte";
  import type {
    blockListStore,
    TextFunctionsType,
  } from "$lib/types/block_list";
  import { onMount } from "svelte";
  import Heading from "./Heading.svelte";
  import RdbView from "./RdbView.svelte";
  import BulletList from "./BulletList.svelte";
  import File from "./File.svelte";

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
      const display = (() => {
        if (
          typeof block.data === "object" &&
          block.data !== null &&
          "display" in block.data &&
          Array.isArray(block.data.display) &&
          block.data.display.every((v) => typeof v === "string") === true
        ) {
          return block.data.display;
        } else {
          return [];
        }
      })();

      return {
        _id: block.data.rdb_id,
        display: display,
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

  function checkBulletList() {
    if (
      block.type === "bullet_list" &&
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

  function checkFile() {
    if (
      block.type === "file" &&
      typeof block.data === "object" &&
      block.data !== null &&
      "file_id" in block.data &&
      typeof block.data.file_id === "string"
    ) {
      return {
        _id: block._id,
        file_id: block.data.file_id,
      };
    } else {
      return null;
    }
  }

  let own: HTMLDivElement;

  let text_functions: TextFunctionsType | undefined = undefined;

  onMount(() => {
    const index = $block_list.findIndex((v) => v._id === block._id);
    $block_list[index].dom_node = own;
    if (text_functions !== undefined) {
      $block_list[index].text_functions = text_functions;
    }
    $block_list = $block_list;
  });
</script>

<div style:min-height={"1.5rem"}>
  {#if block.type === "paragraph"}
    {@const block_data = checkParagraph()}
    {#if block_data !== null}
      <Paragraph
        {block_data}
        {page_id}
        {block_list}
        bind:own
        bind:text_functions
      />
    {:else}
      <div>Error: Paragraph</div>
    {/if}
  {:else if block.type === "rdb_view"}
    {@const block_data = checkRdbView()}
    {#if block_data !== null}
      <RdbView
        rdb_id={block_data._id}
        block_id={block._id}
        display={block_data.display}
        bind:own
      />
    {:else}
      <div>Error: Rdb View</div>
    {/if}
  {:else if block.type === "heading"}
    {@const block_data = checkHeading()}
    {#if block_data !== null}
      <Heading
        {block_data}
        {page_id}
        {block_list}
        bind:own
        bind:text_functions
      />
    {:else}
      <div>Error: Heading</div>
    {/if}
  {:else if block.type === "bullet_list"}
    {@const block_data = checkBulletList()}
    {#if block_data !== null}
      <BulletList
        {block_data}
        {page_id}
        {block_list}
        bind:own
        bind:text_functions
      />
    {:else}
      <div>Error: BulletList</div>
    {/if}
  {:else if block.type === "file"}
    {@const block_data = checkFile()}
    {#if block_data !== null}
      <File {block_data} bind:own />
    {/if}
  {:else}
    <div>Undefined Block Type</div>
  {/if}
</div>
