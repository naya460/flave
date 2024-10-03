<script lang="ts">
  import PageContents from "./PageContents.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
  export let page_path: string[] = [];

  export let pages: {
    _id: string;
    title: string;
  }[];
</script>

<div class="top">
  {#each pages as page}
    <PageContents {data} {page} page_path={[...page_path, page._id]} />
  {/each}
</div>
