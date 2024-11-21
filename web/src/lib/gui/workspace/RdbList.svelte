<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";

  export let workspace_id: string;

  export let rdb_list: {
    _id: string;
    title: string;
  }[];
</script>

<div class="top">
  {#each rdb_list as rdb}
    <Button
      style={{
        buttonStyle: "text",
        textAlign: "left",
        height: "2rem",
      }}
      on:click={() => {
        location.assign(`/${workspace_id}/rdb/${rdb._id}`);
      }}
    >
      {rdb.title}
    </Button>
  {/each}
</div>

<style>
  .top {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }
</style>
