<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Table from "../rdb_view/table.svelte";

  export let rdb_id: string;

  let rdb_data: {
    title: string;
    properties?: {
      id: string;
      type: string;
      name: string;
    }[];
  };

  export let own: HTMLDivElement;

  $: {
    flvFetch(`rdbs/${rdb_id}`).then((res) => {
      res.json().then((value) => {
        rdb_data = value;
      });
    });
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  contenteditable="false"
  bind:this={own}
  on:mousedown={(event) => {
    event.stopPropagation();
  }}
  on:beforeinput={(event) => {
    event.stopImmediatePropagation();
  }}
  on:input={(event) => {
    event.stopPropagation();
  }}
>
  {#if rdb_data !== undefined}
    {@const properties =
      rdb_data.properties === undefined ? [] : rdb_data.properties}
    <Table {rdb_id} {properties} />
  {/if}
</div>
