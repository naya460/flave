<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import type { blockListStore } from "$lib/types/block_list";
  import Paragraph from "./Paragraph.svelte";

  export let page_id: string;

  export let block_data: {
    _id: string;
    text: string;
    level: number;
  };

  export let block_list: blockListStore;

  export let own: HTMLDivElement;
</script>

<Paragraph
  {page_id}
  {block_data}
  {block_list}
  bind:own
  updateHandler={async (id, text) => {
    await flvFetch(`blocks/${id}`, "PATCH", {
      data: { text },
    });
  }}
  style={(() => {
    if (block_data.level === 1) {
      return {
        fontSize: "1.6rem",
      };
    } else if (block_data.level === 2) {
      return {
        fontSize: "1.4rem",
      };
    } else {
      return {
        fontSize: "1.2rem",
      };
    }
  })()}
/>
