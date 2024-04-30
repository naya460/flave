<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import type { LayoutData } from "./$types";
  import PageList from "./PageList.svelte";
  import { page_path_store } from "$lib/store/page_path";
  import { get } from "svelte/store";
  import RdbList from "./RdbList.svelte";

  export let data: LayoutData;

  async function getPageList(): Promise<
    {
      _id: string;
      title: string;
    }[]
  > {
    const res = await fetch(
      `http://${location.hostname}:8080/workspaces/${data.workspace_id}/pages`,
      { credentials: "include" }
    );
    return await res.json();
  }

  async function getRdbList(): Promise<
    {
      _id: string;
      title: string;
    }[]
  > {
    const res = await fetch(
      `http://${location.hostname}:8080/workspaces/${data.workspace_id}/rdbs`,
      { credentials: "include" }
    );
    return await res.json();
  }
</script>

<div>{data.name}</div>

<Button
  style={{
    buttonStyle: "text",
  }}
  on:click={async () => {
    await fetch(`http://${location.hostname}:8080/pages`, {
      method: "post",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace_id: data.workspace_id,
      }),
    });
  }}
>
  Create Page
</Button>

{#await getPageList() then pages}
  <PageList {data} {pages} page_path={get(page_path_store)} />
{/await}

<Button
  style={{
    buttonStyle: "text",
  }}
  on:click={async () => {
    await fetch(`http://${location.hostname}:8080/rdbs`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace: data.workspace_id,
      }),
    });
  }}
>
  Create Relational Database
</Button>

{#await getRdbList() then rdbs}
  <RdbList rdb_list={rdbs} />
{/await}
