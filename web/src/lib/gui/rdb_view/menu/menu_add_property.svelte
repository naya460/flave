<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import type { RdbSelectClause } from "$lib/gui/rdb_query_view/query/select";
  import type { PropertyList } from "$lib/gui/rdb_query_view/rdb_data/property_list";
  import { RdbList } from "$lib/gui/rdb_query_view/rdb_list";
  import { workspace_id_store } from "$lib/store/workspace";
  import Button from "../../common/Button.svelte";
  import type { PropertyHeader } from "../types";

  export let rdb_id: string;

  export let property_list: PropertyList;
  export let rdb_select_clause: RdbSelectClause;

  let rdb_list = new RdbList($workspace_id_store);

  export let display_menu: { dir: string; title: string }[] = [];
  export let menu_next: (dir: string, title: string) => void;
  export let menu_back: () => void;

  async function createProperty(type: string, name: string, option?: unknown) {
    const res = await flvFetch(`rdbs/${rdb_id}/property`, "POST", {
      type,
      name,
      option,
    });
    const id = await res.text();
    property_list.addProperty({ id, type, name, option } as PropertyHeader);
    rdb_select_clause.displayProperty(id);
    menu_back();
  }

  async function createTextProperty() {
    createProperty("text", "new text property");
  }

  async function createCheckboxProperty() {
    createProperty("checkbox", "new checkbox property");
  }

  async function createRelationProperty(rdb_id: string) {
    createProperty("relation", "new relation property", {
      option: { rdb: rdb_id },
    });
  }

  const style = {
    buttonStyle: "text",
    width: "100%",
    textAlign: "left",
  } as const;
</script>

{#if display_menu.length === 0}
  <div>
    <Button {style} on:click={createTextProperty}>text</Button>
    <Button {style} on:click={createCheckboxProperty}>checkbox</Button>
    <Button
      {style}
      on:click={() => {
        menu_next("add relation", "add relation");
      }}
    >
      relation
    </Button>
  </div>
{:else if display_menu[0].dir === "add relation"}
  {#each $rdb_list as v}
    <Button {style} on:click={async () => await createRelationProperty(v._id)}>
      {v.title}
    </Button>
  {/each}
{/if}
