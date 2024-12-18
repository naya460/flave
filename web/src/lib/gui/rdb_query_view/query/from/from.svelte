<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import ContextMenu from "$lib/gui/common/ContextMenu.svelte";
  import Frame from "../../frame.svelte";
  import type { RdbList } from "../../rdb_list";
  import { RdbFromClause } from "./from";
  import Join from "./join.svelte";

  export let rdb_list: RdbList;

  export let rdb_from_clause: RdbFromClause;

  let rdb_list_hidden = true;
  let rdb_title: string = "";

  const heading_style = {
    buttonStyle: "outline",
    buttonDarker: true,
    width: "1.5rem",
    height: "1.5rem",
  } as const;
</script>

<Frame>
  <div slot="heading" style:display="flex" style:gap="1rem">
    <div>SELECT</div>
    <div style:gap="1rem">
      <Button
        style={heading_style}
        on:click={() => {
          rdb_from_clause.addJoin(null, { value1: null, value2: null });
        }}
      >
        +
      </Button>
    </div>
  </div>
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
    {#each $rdb_from_clause.join_list as join_clause}
      <Join {rdb_list} rdb_data={rdb_from_clause.getRdbData()} {join_clause} />
    {/each}
  </div>
</Frame>

<style>
  .select {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 0.2rem 0.5rem;
  }
</style>
