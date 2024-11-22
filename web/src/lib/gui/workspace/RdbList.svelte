<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "$lib/gui/common/Button.svelte";

  export let workspace_id: string;

  async function getRdbList(): Promise<
    {
      _id: string;
      title: string;
    }[]
  > {
    const res = await flvFetch(`workspaces/${workspace_id}/rdbs`);
    return await res.json();
  }
</script>

{#await getRdbList()}
  <div>Loading</div>
{:then rdb_list}
  <div class="list">
    {#each rdb_list as rdb}
      <Button
        style={{
          buttonStyle: "text",
          textAlign: "left",
          height: "2rem",
          buttonDarker: true,
        }}
        on:click={() => {
          location.assign(`/${workspace_id}/rdb/${rdb._id}`);
        }}
      >
        {rdb.title}
      </Button>
    {/each}
  </div>
{:catch}
  <div>Failed to load</div>
{/await}

<style>
  .list {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }
</style>
