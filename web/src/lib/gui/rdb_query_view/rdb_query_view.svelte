<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";
  import ContextMenu from "../common/ContextMenu.svelte";
  import type { PageList } from "../rdb_view/page_list_filter";
  import Table from "../rdb_view/table/table.svelte";
  import type { PropertyHeader } from "../rdb_view/types";
  import { RdbList } from "./rdb_list";

  export let workspace_id: string;

  let rdb_list: RdbList = new RdbList(workspace_id);

  async function getRdbData() {
    if (current_rdb_id === undefined) return;

    const res = await flvFetch(`rdbs/${current_rdb_id}`);
    rdb_data = await res.json();
  }
  let rdb_data:
    | {
        title: string;
        properties?: PropertyHeader[];
        constraints?: {
          id: string;
          type: string;
          option: object;
        }[];
      }
    | undefined = undefined;

  async function getRdbPageList() {
    if (current_rdb_id === undefined) return;

    const res = await flvFetch(`rdbs/${current_rdb_id}/pages`);
    if (res.ok === false) return;
    rdb_page_list = await res.json();
  }
  let rdb_page_list: PageList | undefined = undefined;

  let current_rdb_id: string | undefined = undefined;

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
        {current_rdb_id === undefined
          ? "Select RDB"
          : $rdb_list.find((v) => v._id === current_rdb_id)?.title}
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
          current_rdb_id = item._id;
          getRdbData();
          getRdbPageList();
          rdb_list_hidden = true;
        }}
      >
        {item.title}
      </Button>
    {/each}
  </ContextMenu>
</div>

{#if current_rdb_id !== undefined && rdb_data !== undefined && rdb_page_list !== undefined}
  <Table
    rdb_id={undefined}
    properties={rdb_data.properties === undefined ? [] : rdb_data.properties}
    constraints={rdb_data.constraints === undefined ? [] : rdb_data.constraints}
    page_list={rdb_page_list}
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
