<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import ContextMenu from "$lib/gui/common/ContextMenu.svelte";
  import Frame from "../../frame.svelte";
  import type { RdbData } from "../../rdb_data/rdb_data";
  import type { RdbList } from "../../rdb_list";
  import type { RdbJoinClause } from "./join";

  export let rdb_list: RdbList;
  export let rdb_data: RdbData;
  export let join_clause: RdbJoinClause;

  let rdb_list_hidden = true;
  let value1_hidden = true;
  let value2_hidden = true;
</script>

<Frame>
  <div slot="heading">JOIN</div>
  <div slot="contents">
    INNER
    <!-- rdb id -->
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
          {$join_clause.title}
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
            join_clause.updateJoinData({
              id: item._id,
              on: {
                ...$join_clause.join_data.on,
                value2: null,
              },
            });
            rdb_list_hidden = true;
          }}
        >
          {item.title}
        </Button>
      {/each}
    </ContextMenu>
    <div class="line">
      <!-- value1 -->
      <div>
        <Button
          style={{
            buttonStyle: "outline",
            width: "15rem",
            height: "2.5rem",
          }}
          on:click={() => {
            value1_hidden = false;
          }}
        >
          <div class="select">
            <div>
              {$join_clause.join_data.on.value1 === null
                ? ""
                : $rdb_data.rdb_resources.properties.find(
                    (v) => v.id === $join_clause.join_data.on.value1
                  )?.name}
            </div>
            <div>v</div>
          </div>
        </Button>
        <ContextMenu bind:hidden={value1_hidden}>
          {#each $rdb_data.rdb_resources.properties as item}
            <Button
              style={{
                buttonStyle: "text",
                width: "100%",
                height: "2rem",
                textAlign: "left",
              }}
              on:click={() => {
                join_clause.updateJoinData({
                  ...$join_clause.join_data,
                  on: {
                    ...$join_clause.join_data.on,
                    value1: item.id,
                  },
                });
                value1_hidden = true;
              }}
            >
              {item.name}
            </Button>
          {/each}
        </ContextMenu>
      </div>
      =
      <!-- value2 -->
      <div>
        <Button
          style={{
            buttonStyle: "outline",
            width: "15rem",
            height: "2.5rem",
          }}
          on:click={() => {
            value2_hidden = false;
          }}
        >
          <div class="select">
            <div>
              {$join_clause.join_data.on.value2 === null
                ? ""
                : $join_clause.abailable_properties.find(
                    (v) => v.id === $join_clause.join_data.on.value2
                  )?.name}
            </div>
            <div>v</div>
          </div>
        </Button>
        <ContextMenu bind:hidden={value2_hidden}>
          {#each $join_clause.abailable_properties as item}
            <Button
              style={{
                buttonStyle: "text",
                width: "100%",
                height: "2rem",
                textAlign: "left",
              }}
              on:click={() => {
                join_clause.updateJoinData({
                  ...$join_clause.join_data,
                  on: {
                    ...$join_clause.join_data.on,
                    value2: item.id,
                  },
                });
                value2_hidden = true;
              }}
            >
              {item.name}
            </Button>
          {/each}
        </ContextMenu>
      </div>
    </div>
  </div>
</Frame>

<style>
  .select {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 0.2rem 0.5rem;
  }

  .line {
    display: flex;
    flex-direction: row;
    margin-top: 0.5rem;
    align-items: center;
  }
</style>
