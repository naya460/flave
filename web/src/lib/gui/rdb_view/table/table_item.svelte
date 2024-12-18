<script lang="ts">
  import Item from "../item/item.svelte";
  import type { Property } from "../types";

  export let property: Property | null;

  export let page_id: string | null;

  export let style: {
    width: `${number}${"rem"}`;
  } = {
    width: "20rem",
  };
</script>

<div class="item" style:width={style.width}>
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
