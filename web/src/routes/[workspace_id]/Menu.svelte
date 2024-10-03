<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import type { LayoutData } from "./$types";
  import PageList from "./PageList.svelte";
  import { page_path_id, type page_path_type } from "$lib/types/page";
  import { type Writable } from "svelte/store";
  import RdbList from "./RdbList.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import { getContext } from "svelte";

  export let data: LayoutData;

  let page_path_store = getContext<Writable<page_path_type>>(page_path_id);
  console.log($page_path_store);
  page_path_store.subscribe((v) => console.log(v));

  async function getPageList(): Promise<
    {
      _id: string;
      title: string;
    }[]
  > {
    const res = await flvFetch(`workspaces/${data.workspace_id}/pages`);
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
  }}
  on:click={async () => {
    await flvFetch(`pages`, "POST", { workspace_id: data.workspace_id });
  }}
>
  Create Page
</Button>

{#await getPageList() then pages}
  <PageList {data} {pages} page_path={$page_path_store} />
{/await}

<Button
  style={{
    buttonStyle: "text",
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
