<script lang="ts">
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import type { PageData } from "./$types";
  import { page_title_store } from "$lib/store/page_title";
  import { onMount } from "svelte";
  import BlockList from "./BlockList.svelte";
  import PropertyList from "./PropertyList.svelte";
  import { flvFetch } from "$lib/flv_fetch";

  export let data: PageData;

  onMount(() => {
    page_title_store.set(data.page_data.title);
  });
</script>

<TextInput
  style={{ outline: false, fontSize: "1.5rem" }}
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

{#if data.page_data.rdb !== undefined && data.page_data.properties !== undefined}
  <PropertyList
    page_id={data.page_id}
    rdb_id={data.page_data.rdb}
    properties={data.page_data.properties}
  />
{/if}

<BlockList {data} />
