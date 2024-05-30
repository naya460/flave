<script lang="ts">
  import type { blockListStore } from "$lib/types/block_list";
  import Paragraph from "./Paragraph.svelte";

  export let page_id: string;

  export let block_data: {
    _id: string;
    text: string;
    level?: number;
  } | null;

  export let block_list: blockListStore;
</script>

<Paragraph
  {page_id}
  {block_data}
  {block_list}
  style={(() => {
    return {
      fontSize: "1.5rem",
    };
  })()}
/>
