<script lang="ts" context="module">
  import { type Writable } from "svelte/store";

  export const page_path_id = "page_path";
  export type page_path_type = Writable<string[]>;

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
  import Button from "../common/Button.svelte";
  import { setPage } from "$lib/store/page";

  export let workspace_id: string;
  export let page_id: string;

  export let page_path: page_path_type = writable([]);
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
    setPage(page_id, data.title);
    page_path.set(path);
    return { ...data, path };
  }

  setContext(selecting_block_id, selecting_block);
  setContext(page_block_moving_id, page_block_moving);
  setContext(page_path_id, page_path);

  let hidden_history_view = true;
</script>

{#await load_page_data() then page_data}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="top"
    on:mouseleave={() => {
      $selecting_block = undefined;
    }}
  >
    <div class="header">
      <div />
      <Button
        style={{
          buttonStyle: "text",
        }}
        on:click={() => {
          hidden_history_view = !hidden_history_view;
        }}
      >
        History
      </Button>
    </div>
    <div class="contents">
      <div class="block_list">
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
              setPage(page_id, event.currentTarget.value);
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
      {#if !hidden_history_view}
        <div class="history">
          {#await flvFetch(`pages/${page_id}/history`)}
            <div>loading</div>
          {:then res}
            {#await res.json()}
              <div>parsing</div>
            {:then history}
              <div>histories : {Array(history).length}</div>
              {#each history as v}
                <div>
                  <div>{v.edited_at}</div>
                  <div>{v.update_data.type}</div>
                </div>
              {/each}
            {/await}
          {/await}
        </div>
      {/if}
    </div>
  </div>
{/await}

<style>
  .top {
    width: 100%;
  }

  .header {
    padding: 0.2rem 0.5rem;
    height: 1.5rem;
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .contents {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .block_list {
    width: 100%;
    max-width: 50rem;
    padding: 1rem 3rem;
    box-sizing: border-box;
    margin: auto;
  }

  .title {
    margin-bottom: 0.5rem;
  }

  .history {
    background-color: #f8f8f8;
    padding: 1rem;
  }
</style>
