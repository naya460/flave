<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import RdbList from "./RdbList.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import ToggleMenu from "$lib/gui/common/ToggleMenu.svelte";
  import type { Writable } from "svelte/store";
  import PageTree from "./PageTree.svelte";
  import TrashBox from "./TrashBox.svelte";

  export let workspace_id: string;
  export let workspace_name: string;

  export let page_path_store: Writable<string[]>;

  async function createPage() {
    await flvFetch(`pages`, "POST", { workspace_id: workspace_id });
  }

  async function createRdb() {
    await flvFetch(`rdbs`, "POST", { workspace: workspace_id });
  }

  const style = {
    buttonStyle: "text",
    buttonDarker: true,
  } as const;
</script>

<div>{workspace_name}</div>

<Button {style} on:click={createPage}>Create Page</Button>

<PageTree {workspace_id} {page_path_store} />

<Button {style} on:click={createRdb}>Create Relational Database</Button>

<RdbList {workspace_id} />

<ToggleMenu style={{ darker: true }}>
  <div slot="summary">Trash Box</div>
  <div slot="contents">
    <TrashBox {workspace_id} />
  </div>
</ToggleMenu>
