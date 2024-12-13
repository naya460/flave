<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import type { RdbData } from "$lib/gui/rdb_query_view/rdb_data";
  import type { RdbFilteredProperties } from "$lib/gui/rdb_query_view/rdb_filtered_properties";
  import { workspace_id_store } from "$lib/store/workspace";
  import Button from "../../common/Button.svelte";
  import type { PropertyHeader } from "../types";

  export let rdb_id: string;

  export let rdb_data: RdbData;
  export let rdb_filtered_properties: RdbFilteredProperties;

  let rdb_list: { _id: string; title: string }[] = [];

  flvFetch(`workspaces/${$workspace_id_store}/rdbs`).then((res) => {
    res.json().then((value) => {
      rdb_list = value;
    });
  });
  export let display_menu: { dir: string; title: string }[] = [];
  export let menu_next: (dir: string, title: string) => void;

  async function createTextProperty() {
    const res = await flvFetch(`rdbs/${rdb_id}/property`, "POST", {
      type: "text",
      name: "new text property",
    });
    const id = await res.text();
    rdb_data.addProperty({
      id,
      type: "text",
      name: "new text property",
    } as PropertyHeader);
    rdb_filtered_properties.add(id);
  }

  async function createCheckboxProperty() {
    const res = await flvFetch(`rdbs/${rdb_id}/property`, "POST", {
      type: "checkbox",
      name: "new checkbox property",
    });
    const id = await res.text();
    rdb_data.addProperty({
      id,
      type: "checkbox",
      name: "new checkbox property",
    } as PropertyHeader);
    rdb_filtered_properties.add(id);
  }

  async function createRelationProperty(rdb_id: string) {
    const res = await flvFetch(`rdbs/${rdb_id}/property`, "POST", {
      type: "relation",
      name: "new relation property",
      option: {
        rdb: rdb_id,
      },
    });
    const id = await res.text();
    rdb_data.addProperty({
      id,
      type: "relation",
      name: "new relation property",
      option: {
        rdb: rdb_id,
      },
    } as PropertyHeader);
    rdb_filtered_properties.add(id);
  }
</script>

{#if display_menu.length === 0}
  <div>
    <Button
      style={{
        buttonStyle: "text",
        width: "100%",
        textAlign: "left",
      }}
      on:click={createTextProperty}
    >
      text
    </Button>
    <Button
      style={{
        buttonStyle: "text",
        width: "100%",
        textAlign: "left",
      }}
      on:click={createCheckboxProperty}
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
      on:click={async () => createRelationProperty(v._id)}
    >
      {v.title}
    </Button>
  {/each}
{/if}
