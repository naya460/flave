<script lang="ts">
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import type { PageData } from "./$types";
  import { page_title_store, selecting_block_store } from "$lib/store/page";
  import { onMount } from "svelte";
  import BlockList from "./BlockList.svelte";
  import PropertyList from "./PropertyList.svelte";
  import { flvFetch } from "$lib/flv_fetch";

  export let data: PageData;

  onMount(() => {
    page_title_store.set(data.page_data.title);
  });
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
