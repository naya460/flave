<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";

  export let workspace_id: string;

  async function getPageList(): Promise<
    {
      _id: string;
      title: string;
    }[]
  > {
    const res = await flvFetch(`workspaces/${workspace_id}/pages?deleted=true`);
    return await res.json();
  }

  async function recoverPage(page_id: string) {
    await flvFetch(`pages/${page_id}/recover`, "PATCH");
  }
</script>

{#await getPageList()}
  <div>Loading</div>
{:then pages}
  {#each pages as page}
    <div class="page">
      <div>{page.title}</div>
      <Button
        style={{
          buttonStyle: "text",
        }}
        on:click={() => recoverPage(page._id)}
      >
        ↑
      </Button>
    </div>
  {/each}
{:catch}
  <div>Failed to load</div>
{/await}

<style>
  .page {
    display: grid;
    grid-template-columns: 1fr auto;
  }
</style>
