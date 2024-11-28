<script lang="ts">
  import View from "../rdb_view/view.svelte";

  export let block_id: string;
  export let rdb_id: string;
  export let display: string[];

  export let own: HTMLDivElement;
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
  <View {block_id} {rdb_id} {display} />
</div>
