<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import ContextMenu from "$lib/gui/common/ContextMenu.svelte";
  import Frame from "../frame.svelte";
  import { RdbData } from "../rdb_data/rdb_data";
  import type { RdbList } from "../rdb_list";
  import { RdbFromClause } from "./from";

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

  let add_hidden = true;
  let add_id = "";
  let add_1 = "";
  let add_2 = "";

  const add_rdb_data = new RdbData(null);
</script>

<Frame>
  <div slot="heading" style:display="flex" style:gap="1rem">
    <div>SELECT</div>
    <div style:gap="1rem">
      <Button style={heading_style} on:click={() => (add_hidden = false)}>
        +
      </Button>
      <ContextMenu bind:hidden={add_hidden}>
        {#each $rdb_list as item}
          <Button
            style={{
              buttonStyle: "text",
              width: "100%",
              height: "2rem",
              textAlign: "left",
            }}
            on:click={() => {
              add_id = item._id;
              add_rdb_data.changeRdb(item._id);
            }}
          >
            {item.title}
          </Button>
        {/each}
        <div>=====</div>
        {#each $rdb_from_clause.resources.properties as item}
          <Button
            style={{
              buttonStyle: "text",
              width: "100%",
              height: "2rem",
              textAlign: "left",
            }}
            on:click={() => {
              add_1 = item.id;
            }}
          >
            {item.name}
          </Button>
        {/each}
        <div>=====</div>
        {#each $add_rdb_data.rdb_resources.properties as item}
          <Button
            style={{
              buttonStyle: "text",
              width: "100%",
              height: "2rem",
              textAlign: "left",
            }}
            on:click={() => {
              add_2 = item.id;
            }}
          >
            {item.name}
          </Button>
        {/each}
        <Button
          style={{
            buttonStyle: "outline",
            width: "100%",
            height: "2rem",
            textAlign: "left",
          }}
          on:click={() => {
            rdb_from_clause.addJoin(add_id, { value1: add_1, value2: add_2 });
            add_rdb_data.changeRdb(null);
            add_hidden = true;
          }}
        >
          Add Join
        </Button>
      </ContextMenu>
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
    <div>
      {#each $rdb_from_clause.join_list as join_data}
        <div>
          JOIN
          {$rdb_list.find((v) => v._id === join_data.id)?.title}
          ON
          {join_data.on.value1}
          =
          {join_data.on.value2}
        </div>
      {/each}
    </div>
  </div>
</Frame>

<style>
  .select {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 0.2rem 0.5rem;
  }
</style>
