<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import ContextMenu from "../common/ContextMenu.svelte";

  export let rdb_id: string;

  export let popup_hidden = true;

  export let properties: {
    id: string;
    type: string;
    name: string;
  }[];
</script>

<div class="top">
  <ContextMenu
    bind:hidden={popup_hidden}
    contents={[
      {
        name: "text",
        onClick: async () => {
          const res = await flvFetch(`rdbs/${rdb_id}/property`, "POST", {
            type: "text",
            name: "new text property",
          });
          properties.push({
            id: await res.text(),
            type: "text",
            name: "new text property",
          });
          properties = properties;
        },
      },
      {
        name: "checkbox",
        onClick: async () => {
          const res = await flvFetch(`rdbs/${rdb_id}/property`, "POST", {
            type: "checkbox",
            name: "new checkbox property",
          });
          properties.push({
            id: await res.text(),
            type: "checkbox",
            name: "new checkbox property",
          });
          properties = properties;
        },
      },
    ]}
  />
</div>

<style>
  .top {
    position: absolute;
    top: 0;
    right: 20rem;
    z-index: 1;
  }
</style>
