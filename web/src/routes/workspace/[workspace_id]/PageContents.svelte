<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import ToggleMenu from "$lib/gui/common/ToggleMenu.svelte";
  import { afterUpdate, onMount } from "svelte";
  import type { LayoutData } from "./$types";
  import PageList from "./PageList.svelte";
  import { page_title_store } from "$lib/store/page_title";

  type PageData = {
    _id: string;
    title: string;
  };

  export let data: LayoutData;

  export let page: PageData;

  export let page_path: string[] = [];

  let expand = false;

  let child_pages: PageData[] | null = null;

  onMount(() => {
    if (page_path.length === 0) return;
    expand = true;
  });

  afterUpdate(async () => {
    if (expand === true && child_pages === null) {
      const url = new URL(`http://${location.hostname}:8080/pages`);
      url.searchParams.append("parent", page._id);
      const res = await fetch(url, { credentials: "include" });
      child_pages = await res.json();
    }
  });
</script>

<ToggleMenu bind:expand>
  <!-- title and page creation button -->
  <div slot="summary" class="summary">
    <!-- page title-->
    <Button
      style={{
        buttonStyle: "text",
        textAlign: "left",
      }}
      on:click={() => {
        location.assign(`/workspace/${data.workspace_id}/${page._id}`);
      }}
    >
      {#if page._id === data.page_id}
        {$page_title_store}
      {:else}
        {page.title}
      {/if}
    </Button>
    <!-- page creation button -->
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
            parent: page._id,
          }),
        });
      }}
    >
      +
    </Button>
  </div>
  <!-- child pages -->
  <div slot="contents" class="contents">
    {#if child_pages !== null}
      <PageList
        {data}
        pages={child_pages}
        page_path={page_path.length !== 0 ? page_path.slice(1) : []}
      />
    {/if}
  </div>
</ToggleMenu>

<style>
  .summary {
    display: grid;
    grid-template-columns: 1fr 1.5rem;
    width: 100%;
  }

  .contents {
    margin-left: 1rem;
  }
</style>
