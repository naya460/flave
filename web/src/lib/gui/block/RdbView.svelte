<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import View from "../rdb_view/view.svelte";

  export let block_id: string;
  export let rdb_id: string;
  export let display: string[];

  let rdb_data: {
    title: string;
    properties?: {
      id: string;
      type: string;
      name: string;
      option: unknown;
    }[];
    constraints?: {
      id: string;
      type: string;
      option: object;
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
    <View {block_id} {rdb_id} {rdb_data} {display} />
  {/if}
</div>
