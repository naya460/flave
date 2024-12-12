<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import type {
    blockListStore,
    TextFunctionsType,
  } from "$lib/types/block_list";
  import { afterUpdate } from "svelte";
  import Paragraph from "./Paragraph.svelte";

  export let page_id: string;

  export let block_data: {
    _id: string;
    text: string;
  };

  export let block_list: blockListStore;

  export let own: HTMLDivElement;

  let tmp_text_functions: TextFunctionsType | undefined;
  export let text_functions: TextFunctionsType | undefined;

  afterUpdate(() => {
    if (tmp_text_functions !== undefined) {
      text_functions = {
        ...tmp_text_functions,
        insertBlock: (type, data) => {
          tmp_text_functions?.insertBlock("bullet_list", data);
        },
      };
    }
  });
</script>

<div contenteditable="false" class="top">
  <div>・</div>
  <Paragraph
    {page_id}
    {block_data}
    {block_list}
    bind:own
    bind:text_functions={tmp_text_functions}
    updateHandler={async (id, text) => {
      await flvFetch(`blocks/${id}`, "PATCH", {
        data: { text },
      });
    }}
  />
</div>

<style>
  .top {
    width: 100%;
    display: grid;
    grid-template-columns: 1.5rem 1fr;
  }
</style>
