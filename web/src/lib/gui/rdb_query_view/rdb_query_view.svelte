<script lang="ts">
  import Button from "../common/Button.svelte";
  import ContextMenu from "../common/ContextMenu.svelte";
  import Table from "../rdb_view/table/table.svelte";
  import { RdbList } from "./rdb_list";
  import { RdbData } from "./rdb_data";
  import { RdbPageList } from "./rdb_page_list";

  export let workspace_id: string;

  let rdb_list: RdbList = new RdbList(workspace_id);

  let rdb_data: RdbData = new RdbData(null);

  let rdb_page_list: RdbPageList = new RdbPageList(null);

  let rdb_list_hidden = true;
</script>

<div>
  <Button
    style={{
      buttonStyle: "outline",
      width: "15rem",
      height: "2.5rem",
    }}
    on:click={() => {
      rdb_list_hidden = false;
    }}
  >
    <div class="select">
      <div>
        {$rdb_data.title}
      </div>
      <div>v</div>
    </div>
  </Button>

  <ContextMenu bind:hidden={rdb_list_hidden}>
    {#each $rdb_list as item}
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
          height: "2rem",
          textAlign: "left",
        }}
        on:click={() => {
          rdb_data.changeRdb(item._id);
          rdb_page_list.changeRdb(item._id);
          rdb_list_hidden = true;
        }}
      >
        {item.title}
      </Button>
    {/each}
  </ContextMenu>
</div>

{#if $rdb_data.rdb_id !== null && $rdb_page_list.rdb_id !== null}
  <Table
    rdb_id={undefined}
    properties={$rdb_data.properties}
    constraints={$rdb_data.constraints}
    page_list={$rdb_page_list.page_list}
    set_menu={() => {}}
    push_page={() => {}}
  />
{/if}

<style>
  .select {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 0.2rem 0.5rem;
  }
</style>
