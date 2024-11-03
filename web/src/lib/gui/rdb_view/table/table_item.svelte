<script lang="ts">
  import Item from "../item/item.svelte";

  export let property: {
    id: string;
    type: string;
    option?: unknown;
    value: unknown;
  };

  export let page_id: string;

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
