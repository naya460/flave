<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import RdbList from "./RdbList.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import ToggleMenu from "$lib/gui/common/ToggleMenu.svelte";
  import type { Writable } from "svelte/store";
  import PageTree from "./PageTree.svelte";
  import TrashBox from "./TrashBox.svelte";
  import MenuHeader from "./MenuHeader.svelte";

  export let workspace_id: string;
  export let workspace_name: string;

  export let page_path_store: Writable<string[]>;

  export let workspace_list: {
    _id: string;
    name: string;
  }[];

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

<MenuHeader {workspace_id} {workspace_name} {workspace_list} />

<div class="contents">
  <div class="heading">
    <div>Pages</div>
    <Button {style} on:click={createPage}>+</Button>
  </div>
  <PageTree {workspace_id} {page_path_store} />
</div>

<div class="contents">
  <Button
    style={{ ...style, width: "100%", textAlign: "left" }}
    on:click={() => location.assign("query_view")}
  >
    RDB Query View
  </Button>
</div>

<div class="contents">
  <div class="heading">
    <div>RDBs</div>
    <Button {style} on:click={createRdb}>+</Button>
  </div>
  <RdbList {workspace_id} />
</div>

<div class="contents">
  <ToggleMenu style={{ darker: true }}>
    <div slot="summary">Trash Box</div>
    <div slot="contents">
      <TrashBox {workspace_id} />
    </div>
  </ToggleMenu>
</div>

<style>
  .contents {
    margin-top: 1rem;
  }

  .heading {
    display: grid;
    grid-template-columns: 1fr auto;
  }
</style>
