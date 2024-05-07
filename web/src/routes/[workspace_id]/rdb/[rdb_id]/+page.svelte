<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { flvFetch } from "$lib/flv_fetch";

  export let data: PageData;

  let page_list: {
    _id: string;
    title: string;
    properties?: {
      id: string;
      value: string;
    }[];
  }[] = [];

  onMount(async () => {
    const res = await flvFetch(`rdbs/${data.rdb_id}/pages`);
    if (res.ok === false) return;
    page_list = await res.json();
  });
</script>

<TextInput
  style={{ outline: false, fontSize: "1.5rem" }}
  value={data.rdb_data.title}
  onChange={async (event) => {
    await flvFetch(`rdbs/${data.rdb_id}`, "PATCH", {
      title: event.currentTarget.value,
    });
  }}
/>

<Button
  style={{
    buttonStyle: "text",
  }}
  on:click={async () => {
    await flvFetch(`rdbs/${data.rdb_id}/property`, "POST", {
      type: "text",
      name: "new property",
    });
  }}
>
  Create New Property
</Button>

<div class="table">
  <div class="row">
    <div style:padding="0.2rem 0.5rem">page</div>
    {#if data.rdb_data.properties !== undefined}
      {#each data.rdb_data.properties as property}
        <TextInput
          style={{ outline: false }}
          value={property.name}
          onChange={async (event) => {
            await flvFetch(
              `rdbs/${data.rdb_id}/property/${property.id}`,
              "PATCH",
              { name: event.currentTarget.value }
            );
          }}
        />
      {/each}
    {/if}
  </div>
  {#each page_list as page}
    <div class="row">
      <div>
        <Button
          style={{
            buttonStyle: "text",
            textAlign: "left",
            width: "100%",
          }}
          on:click={() => {
            location.assign(`/${data.workspace_id}/${page._id}`);
          }}
        >
          {page.title}
        </Button>
      </div>
      {#if data.rdb_data.properties !== undefined}
        {#each data.rdb_data.properties as property}
          <TextInput
            style={{ outline: false }}
            value={page.properties !== undefined
              ? page.properties.find((v) => v.id === property.id)?.value
              : ""}
            onChange={async (event) => {
              await flvFetch(
                `pages/${page._id}/property/${property.id}`,
                "PATCH",
                { value: event.currentTarget.value }
              );
            }}
          />
        {/each}
      {/if}
    </div>
  {/each}
</div>

<Button
  style={{
    buttonStyle: "text",
  }}
  on:click={async () => {
    await flvFetch(`pages`, "POST", {
      workspace_id: data.workspace_id,
      rdb_id: data.rdb_id,
    });
  }}
>
  Create New Page
</Button>

<style>
  .table {
    display: grid;
    background-color: #dddddd;
    border: 1px solid #dddddd;
    gap: 1px;
  }

  .row {
    display: grid;
    grid-template-columns: repeat(auto-fill, 15rem);
    background-color: #dddddd;
    gap: 1px;
  }

  .row * {
    background-color: #ffffff;
    width: 100%;
    box-sizing: border-box;
  }
</style>
