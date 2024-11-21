<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import ToggleMenu from "$lib/gui/common/ToggleMenu.svelte";
  import { afterUpdate } from "svelte";
  import PageList from "./PageList.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import ContextMenu from "$lib/gui/common/ContextMenu.svelte";
  import type { Writable } from "svelte/store";

  type PageData = {
    _id: string;
    title: string;
    deleted: boolean;
  };

  export let workspace_id: string;
  export let page_id: string | undefined;

  export let page: PageData;
  export let page_path: string[] = [];

  export let first: boolean;

  export let page_title_store: Writable<string>;
  export let page_path_store: Writable<string[]>;

  let expand = false;

  let child_pages: PageData[] | null = null;

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

  let mouse_over = false;
  let submenu_hidden = true;
</script>

<ToggleMenu bind:expand style={{ darker: true }}>
  <!-- title and page creation button -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <div
    slot="summary"
    class="summary"
    on:mouseover={() => {
      mouse_over = true;
    }}
    on:mouseleave={() => {
      mouse_over = false;
    }}
  >
    <!-- page title-->
    <div class="title">
      <Button
        style={{
          buttonStyle: "text",
          buttonDarker: true,
          textAlign: "left",
          width: "100%",
        }}
        on:click={() => {
          location.assign(`/${workspace_id}/${page._id}`);
        }}
      >
        <div class="title_text">
          {#if page._id === page_id}
            {$page_title_store}
          {:else}
            {page.title}
          {/if}
        </div>
      </Button>
    </div>
    {#if mouse_over}
      <div class="over">
        <!-- submenu button -->
        <Button
          style={{
            buttonStyle: "text",
            buttonDarker: true,
          }}
          on:click={() => {
            submenu_hidden = false;
          }}
        >
          …
        </Button>
        <!-- page creation button -->
        <Button
          style={{
            buttonStyle: "text",
            buttonDarker: true,
          }}
          on:click={async () => {
            await flvFetch(`pages`, "POST", {
              workspace_id: workspace_id,
              parent: page._id,
            });
          }}
        >
          +
        </Button>
      </div>
    {/if}
    <ContextMenu bind:hidden={submenu_hidden}>
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
          textAlign: "left",
          height: "2rem",
        }}
        on:click={async () => {
          await flvFetch(`pages/${page._id}`, "DELETE");
          submenu_hidden = true;
        }}
      >
        Delete this page
      </Button>
    </ContextMenu>
  </div>
  <!-- child pages -->
  <div slot="contents" class="contents">
    {#if child_pages !== null}
      <PageList
        {workspace_id}
        {page_id}
        pages={child_pages}
        {page_path}
        bind:first
        bind:page_title_store
        bind:page_path_store
      />
    {/if}
  </div>
</ToggleMenu>

<style>
  .summary {
    display: grid;
    grid-template-columns: 1fr auto;
    width: 100%;
  }

  .title {
    width: 100%;
    overflow: hidden;
  }

  .title_text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .over {
    height: 100%;
    align-content: center;
  }

  .contents {
    margin-left: 1rem;
  }
</style>
