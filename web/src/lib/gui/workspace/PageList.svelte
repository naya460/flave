<script lang="ts">
  import type { Writable } from "svelte/store";
  import PageContents from "./PageContents.svelte";

  export let workspace_id: string;

  export let page_path: string[] = [];

  export let pages: {
    _id: string;
    title: string;
    deleted: boolean;
  }[];

  export let first: boolean;

  export let page_path_store: Writable<string[]>;
</script>

<div class="top">
  {#each pages as page}
    <PageContents
      {workspace_id}
      {page}
      page_path={[...page_path, page._id]}
      bind:first
      bind:page_path_store
    />
  {/each}
</div>
