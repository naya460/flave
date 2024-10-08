<script lang="ts" context="module">
  import { type Writable } from "svelte/store";

  export const page_path_id = "page_path";
  export type page_path_type = Writable<string[]>;

  export const page_title_id = "page_title";
  export type page_title_type = Writable<string>;

  export const selecting_block_id = "selecting_block";
  export type selecting_block_type = Writable<string | undefined>;

  export const page_block_moving_id = "page_block_moving";
  export type page_block_moving_type = Writable<string | undefined>;
</script>

<script lang="ts">
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import BlockList from "./BlockList.svelte";
  import PropertyList from "./PropertyList.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  export let workspace_id: string;
  export let page_id: string;

  export let page_path: page_path_type = writable([]);
  export let page_title: page_title_type = writable("");
  export let selecting_block: selecting_block_type = writable(undefined);
  export let page_block_moving: page_block_moving_type = writable(undefined);

  async function load_page_data(): Promise<{
    title: string;
    rdb?: string;
    properties?: {
      id: string;
      value: string;
    }[];
    path: string[];
  }> {
    let data = await (await flvFetch(`pages/${page_id}`)).json();
    let path = await (await flvFetch(`pages/${page_id}/path`)).json();
    page_title.set(data.title);
    page_path.set(path);
    return { ...data, path };
  }

  setContext(page_title_id, page_title);
  setContext(selecting_block_id, selecting_block);
  setContext(page_block_moving_id, page_block_moving);
  setContext(page_path_id, page_path);
</script>

{#await load_page_data() then page_data}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="top"
    on:mouseleave={() => {
      $selecting_block = undefined;
    }}
  >
    <div class="title">
      <TextInput
        style={{ outline: false, fontSize: "1.5rem", padding: "0px" }}
        value={page_data.title}
        onChange={async (event) => {
          await flvFetch(`pages/${page_id}`, "PATCH", {
            title: event.currentTarget.value,
          });
        }}
        onKeyUp={(event) => {
          page_title.set(event.currentTarget.value);
        }}
      />
    </div>

    {#if page_data.rdb !== undefined && page_data.properties !== undefined}
      <PropertyList
        {page_id}
        rdb_id={page_data.rdb}
        properties={page_data.properties}
      />
    {/if}

    <div style:position={"relative"}>
      <BlockList {workspace_id} {page_id} />
    </div>
  </div>
{/await}

<style>
  .top {
    width: 100%;
    max-width: 50rem;
    padding: 1rem 3rem;
    box-sizing: border-box;
    margin: auto;
  }

  .title {
    margin-bottom: 0.5rem;
  }
</style>
