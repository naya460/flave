<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import ToggleMenu from "$lib/gui/common/ToggleMenu.svelte";
  import { afterUpdate } from "svelte";
  import type { LayoutData } from "./$types";
  import PageList from "./PageList.svelte";

  type PageData = {
    _id: string;
    title: string;
  };

  export let data: LayoutData;

  export let page: PageData;

  let expand = false;
  let child_pages: PageData[] | null = null;

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
      {page.title}
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
      <PageList {data} pages={child_pages} />
    {/if}
  </div>
</ToggleMenu>

<style>
  .summary {
    display: grid;
    grid-template-columns: 1fr 1.5rem;
    width: 10rem;
  }

  .contents {
    margin-left: 1rem;
  }
</style>
