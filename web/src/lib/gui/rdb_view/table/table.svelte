<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import TableRow from "./table_row.svelte";
  import TableHeader from "./table_header.svelte";
  import { beforeUpdate, onMount } from "svelte";
  import { workspace_id_store } from "$lib/store/workspace";
  import type { PropertyHeader } from "../types";

  export let rdb_id: string;

  export let properties: PropertyHeader[];

  export let constraints: {
    id: string;
    type: string;
    option: object;
  }[];

  export let filters: {
    id: string;
    value: string | boolean;
  }[];

  let page_list: {
    _id: string;
    title: string;
    properties?: {
      id: string;
      value: unknown;
    }[];
    constraints?: {
      id: string;
      result: boolean;
    }[];
  }[] = [];

  let filtered_page_list: {
    _id: string;
    title: string;
    properties?: {
      id: string;
      value: unknown;
    }[];
    constraints?: {
      id: string;
      result: boolean;
    }[];
  }[];

  beforeUpdate(() => {
    filtered_page_list = [];

    for (let page of page_list) {
      let ok = true;

      for (let filter of filters) {
        let property = page?.properties?.find((v) => v.id === filter.id);

        let value;
        if (property?.value === undefined) {
          switch (properties.find((v) => v.id === filter.id)?.type) {
            case "text": {
              value = "";
              break;
            }
            case "checkbox": {
              value = false;
              break;
            }
          }
        } else {
          value = property?.value;
        }
        if (value !== filter.value) {
          ok = false;
          break;
        }
      }

      if (ok === true) {
        filtered_page_list = [...filtered_page_list, page];
      }
    }
  });

  export let display: string[];

  export let set_menu: (menu: { dir: string; title: string }[]) => void;

  onMount(async () => {
    const res = await flvFetch(`rdbs/${rdb_id}/pages`);
    if (res.ok === false) return;
    page_list = await res.json();
  });
</script>

<div class="top">
  <div class="table">
    <div class="row">
      <TableHeader {rdb_id} bind:properties {display} {set_menu} />
    </div>
    {#if display.length !== 0}
      {#each filtered_page_list as page (page._id)}
        <div class="row">
          {#if properties !== undefined}
            <TableRow {properties} {constraints} {page} {display} />
          {/if}
        </div>
      {/each}
    {/if}
    <div style:width="100%">
      <Button
        style={{
          buttonStyle: "text",
          textAlign: "left",
          width: "100%",
        }}
        on:click={async () => {
          const res = await flvFetch(`pages`, "POST", {
            workspace_id: $workspace_id_store,
            rdb_id: rdb_id,
          });
          if (res.ok === true) {
            const id = await res.text();
            console.log(id);
            page_list.push({
              _id: id,
              title: "New Page",
              properties: [],
            });
            page_list = page_list;
          }
        }}
      >
        + Create New Page
      </Button>
    </div>
  </div>
</div>

<style>
  .top {
    width: 100%;
    overflow-x: scroll;
  }

  .table {
    width: fit-content;
    display: flex;
    flex-direction: column;
  }

  .row {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #dddddd;
  }
</style>
