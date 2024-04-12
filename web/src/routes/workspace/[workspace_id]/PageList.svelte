<script lang="ts">
  import PageContents from "./PageContents.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  export let pages: {
    _id: string;
    title: string;
  }[];
</script>

{#each pages as page}
  <PageContents {data} {page} />
{/each}
