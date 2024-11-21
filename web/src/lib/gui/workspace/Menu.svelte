<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import PageList from "./PageList.svelte";
  import RdbList from "./RdbList.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import ToggleMenu from "$lib/gui/common/ToggleMenu.svelte";
  import type { Writable } from "svelte/store";

  export let page_path_store: Writable<string[]>;

  export let workspace_id: string;
  export let workspace_name: string;

  let first = true;

  async function getPageList(deleted?: boolean): Promise<
    {
      _id: string;
      title: string;
      deleted: boolean;
    }[]
  > {
    const res = await flvFetch(
      `workspaces/${workspace_id}/pages${deleted === undefined ? "" : "?deleted=" + deleted}`
    );
    return await res.json();
  }

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

<div>{workspace_name}</div>

<Button
  style={{
    buttonStyle: "text",
    buttonDarker: true,
  }}
  on:click={async () => {
    await flvFetch(`pages`, "POST", { workspace_id: workspace_id });
  }}
>
  Create Page
</Button>

{#await getPageList() then pages}
  <PageList
    {workspace_id}
    {pages}
    page_path={[]}
    bind:first
    bind:page_path_store
  />
{/await}

<Button
  style={{
    buttonStyle: "text",
    buttonDarker: true,
  }}
  on:click={async () => {
    await flvFetch(`rdbs`, "POST", { workspace: workspace_id });
  }}
>
  Create Relational Database
</Button>

{#await getRdbList() then rdbs}
  <RdbList {workspace_id} rdb_list={rdbs} />
{/await}

<ToggleMenu>
  <div slot="summary">Trash Box</div>
  <div slot="contents">
    {#await getPageList(true) then pages}
      {#each pages as page}
        <div style={"display: grid; grid-template-columns: 1fr auto;"}>
          <div>{page.title}</div>
          <Button
            style={{
              buttonStyle: "text",
            }}
            on:click={async () => {
              await flvFetch(`pages/${page._id}/recover`, "PATCH");
            }}
          >
            ↑
          </Button>
        </div>
      {/each}
    {/await}
  </div>
</ToggleMenu>
