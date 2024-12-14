<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import ContextMenu from "$lib/gui/common/ContextMenu.svelte";
  import Frame from "../frame.svelte";
  import type { RdbList } from "../rdb_list";
  import { RdbFromClause } from "./from";

  export let rdb_list: RdbList;

  export let rdb_from_clause: RdbFromClause;

  let rdb_list_hidden = true;
  let rdb_title: string = "";
</script>

<Frame>
  <div slot="heading">FROM</div>
  <div slot="contents">
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
          {rdb_title}
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
            rdb_from_clause.changeRdb(item._id);
            rdb_list_hidden = true;
            rdb_title = item.title;
          }}
        >
          {item.title}
        </Button>
      {/each}
    </ContextMenu>
  </div>
</Frame>

<style>
  .select {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 0.2rem 0.5rem;
  }
</style>
