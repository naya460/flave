<script lang="ts">
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import type { PageData } from "./$types";
  import {
    page_block_moving_id,
    type page_block_moving_type,
    page_path_id,
    type page_path_type,
    page_title_id,
    type page_title_type,
    selecting_block_id,
    type selecting_block_type,
  } from "$lib/types/page";
  import { getContext, setContext } from "svelte";
  import BlockList from "./BlockList.svelte";
  import PropertyList from "./PropertyList.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import { writable, type Writable } from "svelte/store";

  export let data: PageData;

  let page_title_store = getContext<Writable<page_title_type>>(page_title_id);
  let selecting_block_store = writable<selecting_block_type>(undefined);
  let page_block_moving_store = writable<page_block_moving_type>(undefined);

  setContext(selecting_block_id, selecting_block_store);
  setContext(page_block_moving_id, page_block_moving_store);

  getContext<Writable<page_path_type>>(page_path_id).set(data.page_path);
  page_title_store.set(data.page_data.title);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="top"
  on:mouseleave={() => {
    $selecting_block_store = undefined;
  }}
>
  <div class="title">
    <TextInput
      style={{ outline: false, fontSize: "1.5rem", padding: "0px" }}
      value={data.page_data.title}
      onChange={async (event) => {
        await flvFetch(`pages/${data.page_id}`, "PATCH", {
          title: event.currentTarget.value,
        });
      }}
      onKeyUp={(event) => {
        page_title_store.set(event.currentTarget.value);
      }}
    />
  </div>

  {#if data.page_data.rdb !== undefined && data.page_data.properties !== undefined}
    <PropertyList
      page_id={data.page_id}
      rdb_id={data.page_data.rdb}
      properties={data.page_data.properties}
    />
  {/if}

  <div style:position={"relative"}>
    <BlockList {data} />
  </div>
</div>

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
