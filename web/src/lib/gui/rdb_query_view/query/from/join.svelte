<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import ContextMenu from "$lib/gui/common/ContextMenu.svelte";
  import Frame from "../../frame.svelte";
  import type { RdbList } from "../../rdb_list";
  import type { RdbJoinClause } from "./join";

  export let rdb_list: RdbList;
  export let join_clause: RdbJoinClause;

  let join_type_hidden = true;
  let rdb_list_hidden = true;
  let value1_hidden = true;
  let value2_hidden = true;

  const join_type_list = ["INNER", "LEFT", "RIGHT"] as const;
</script>

<Frame>
  <div slot="heading">JOIN</div>
  <div slot="contents">
    <div class="line">
      <!-- join type -->
      <div>
        <Button
          style={{
            buttonStyle: "outline",
            width: "15rem",
            height: "2.5rem",
          }}
          on:click={() => {
            join_type_hidden = false;
          }}
        >
          <div class="select">
            <div>
              {$join_clause.join_data.type}
            </div>
            <div>v</div>
          </div>
        </Button>
        <ContextMenu bind:hidden={join_type_hidden}>
          {#each join_type_list as join_type}
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
                  type: join_type,
                });
                join_type_hidden = true;
              }}
            >
              {join_type}
            </Button>
          {/each}
        </ContextMenu>
      </div>
      <!-- rdb id -->
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
                  type: $join_clause.join_data.type,
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
      </div>
    </div>
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
                : join_clause
                    .getUsableProperties()
                    .find((v) => v.id === $join_clause.join_data.on.value1)
                    ?.name}
            </div>
            <div>v</div>
          </div>
        </Button>
        <ContextMenu bind:hidden={value1_hidden}>
          {#each join_clause.getUsableProperties() as item}
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
                : join_clause
                    .getUsableProperties()
                    .find((v) => v.id === $join_clause.join_data.on.value2)
                    ?.name}
            </div>
            <div>v</div>
          </div>
        </Button>
        <ContextMenu bind:hidden={value2_hidden}>
          {#each join_clause.getUsableProperties() as item}
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
