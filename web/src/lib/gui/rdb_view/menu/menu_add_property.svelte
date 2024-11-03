<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import { workspace_id_store } from "$lib/store/workspace";
  import Button from "../../common/Button.svelte";

  export let rdb_id: string;

  export let properties: {
    id: string;
    type: string;
    name: string;
    option?: unknown;
  }[];

  let rdb_list: { _id: string; title: string }[] = [];

  flvFetch(`workspaces/${$workspace_id_store}/rdbs`).then((res) => {
    res.json().then((value) => {
      rdb_list = value;
    });
  });
  export let display_menu: { dir: string; title: string }[] = [];
  export let menu_next: (dir: string, title: string) => void;
</script>

{#if display_menu.length === 0}
  <div>
    <Button
      style={{
        buttonStyle: "text",
        width: "100%",
        textAlign: "left",
      }}
      on:click={async () => {
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
      }}
    >
      text
    </Button>
    <Button
      style={{
        buttonStyle: "text",
        width: "100%",
        textAlign: "left",
      }}
      on:click={async () => {
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
      }}
    >
      checkbox
    </Button>
    <Button
      style={{
        buttonStyle: "text",
        width: "100%",
        textAlign: "left",
      }}
      on:click={() => {
        menu_next("add relation", "add relation");
      }}
    >
      relation
    </Button>
  </div>
{:else if display_menu[0].dir === "add relation"}
  {#each rdb_list as v}
    <Button
      style={{
        buttonStyle: "text",
        width: "100%",
        textAlign: "left",
      }}
      on:click={async () => {
        const res = await flvFetch(`rdbs/${rdb_id}/property`, "POST", {
          type: "relation",
          name: "new relation property",
          option: {
            rdb: v._id,
          },
        });
        properties.push({
          id: await res.text(),
          type: "relation",
          name: "new relation property",
          option: {
            rdb: v._id,
          },
        });
        properties = properties;
      }}
    >
      {v.title}
    </Button>
  {/each}
{/if}
