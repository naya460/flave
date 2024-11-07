<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import type { LayoutData } from "./$types";
  import PageList from "./PageList.svelte";
  import RdbList from "./RdbList.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import ToggleMenu from "$lib/gui/common/ToggleMenu.svelte";

  export let data: LayoutData;

  let first = true;

  async function getPageList(deleted?: boolean): Promise<
    {
      _id: string;
      title: string;
      deleted: boolean;
    }[]
  > {
    const res = await flvFetch(
      `workspaces/${data.workspace_id}/pages${deleted === undefined ? "" : "?deleted=" + deleted}`
    );
    return await res.json();
  }

  async function getRdbList(): Promise<
    {
      _id: string;
      title: string;
    }[]
  > {
    const res = await flvFetch(`workspaces/${data.workspace_id}/rdbs`);
    return await res.json();
  }
</script>

<div>{data.name}</div>

<Button
  style={{
    buttonStyle: "text",
    buttonDarker: true,
  }}
  on:click={async () => {
    await flvFetch(`pages`, "POST", { workspace_id: data.workspace_id });
  }}
>
  Create Page
</Button>

{#await getPageList() then pages}
  <PageList {data} {pages} page_path={[]} bind:first />
{/await}

<Button
  style={{
    buttonStyle: "text",
    buttonDarker: true,
  }}
  on:click={async () => {
    await flvFetch(`rdbs`, "POST", { workspace: data.workspace_id });
  }}
>
  Create Relational Database
</Button>

{#await getRdbList() then rdbs}
  <RdbList rdb_list={rdbs} {data} />
{/await}

<ToggleMenu>
  <div slot="summary">Trash Box</div>
  <div slot="contents">
    {#await getPageList(true) then pages}
      {#each pages as page}
        <div>{page.title}</div>
      {/each}
    {/await}
  </div>
</ToggleMenu>
