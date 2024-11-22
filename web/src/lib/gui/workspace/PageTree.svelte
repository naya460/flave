<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import type { Writable } from "svelte/store";
  import PageList from "./PageList.svelte";

  export let workspace_id: string;

  export let page_path_store: Writable<string[]>;

  async function getPageList(): Promise<
    {
      _id: string;
      title: string;
      deleted: boolean;
    }[]
  > {
    const res = await flvFetch(`workspaces/${workspace_id}/pages`);
    return await res.json();
  }

  let first = true;
</script>

{#await getPageList() then pages}
  <PageList
    {workspace_id}
    {pages}
    page_path={[]}
    bind:first
    bind:page_path_store
  />
{/await}
