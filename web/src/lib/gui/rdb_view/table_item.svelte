<script lang="ts">
  import Item from "./item.svelte";

  export let property: {
    id: string;
    type: string;
    option?: unknown;
    value: unknown;
  };

  export let page_id: string;
</script>

<div class="item">
  <Item {property} {page_id} />
</div>

<style>
  .item {
    width: 20rem;
    flex-shrink: 0;
    border: 0 solid #dddddd;
    border-right-width: 1px;
    box-sizing: border-box;
  }
</style>
