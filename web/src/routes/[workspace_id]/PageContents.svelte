<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import ToggleMenu from "$lib/gui/common/ToggleMenu.svelte";
  import { afterUpdate, getContext } from "svelte";
  import type { LayoutData } from "./$types";
  import PageList from "./PageList.svelte";
  import {
    main_page_path_id,
    main_page_title_id,
    type main_page_path_type,
    type main_page_title_type,
  } from "./+layout.svelte";
  import { flvFetch } from "$lib/flv_fetch";

  type PageData = {
    _id: string;
    title: string;
  };

  export let data: LayoutData;

  export let page: PageData;

  export let page_path: string[] = [];

  export let first: boolean;

  let expand = false;

  let child_pages: PageData[] | null = null;

  let page_title_store: main_page_title_type = getContext(main_page_title_id);
  let page_path_store: main_page_path_type = getContext(main_page_path_id);

  page_path_store.subscribe((v) => {
    if (v[page_path.length - 1] == page._id) {
      expand = first;
      if (v.length === page_path.length) {
        first = false;
      }
    }
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

<ToggleMenu bind:expand style={{ darker: true }}>
  <!-- title and page creation button -->
  <div slot="summary" class="summary">
    <!-- page title-->
    <Button
      style={{
        buttonStyle: "text",
        buttonDarker: true,
        textAlign: "left",
      }}
      on:click={() => {
        location.assign(`/${data.workspace_id}/${page._id}`);
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
        buttonDarker: true,
      }}
      on:click={async () => {
        await flvFetch(`pages`, "POST", {
          workspace_id: data.workspace_id,
          parent: page._id,
        });
      }}
    >
      +
    </Button>
  </div>
  <!-- child pages -->
  <div slot="contents" class="contents">
    {#if child_pages !== null}
      <PageList {data} pages={child_pages} {page_path} bind:first />
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
