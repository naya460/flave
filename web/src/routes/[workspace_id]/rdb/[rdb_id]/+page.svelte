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

<div class="top">
  <div class="table">
    <div class="row">
      <div
        class="item"
        style:padding="0.2rem 0.5rem"
        style:box-sizing="border-box"
      >
        page
      </div>
      {#if data.rdb_data.properties !== undefined}
        {#each data.rdb_data.properties as property}
          <div class="item">
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
          </div>
        {/each}
      {/if}
      <div>
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
          +
        </Button>
      </div>
    </div>
    {#each page_list as page}
      <div class="row">
        <div class="item">
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
            <div class="item">
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
            </div>
          {/each}
        {/if}
      </div>
    {/each}
    <div style:width="100%">
      <Button
        style={{
          buttonStyle: "text",
          textAlign: "left",
          width: "100%",
        }}
        on:click={async () => {
          await flvFetch(`pages`, "POST", {
            workspace_id: data.workspace_id,
            rdb_id: data.rdb_id,
          });
        }}
      >
        + Create New Page
      </Button>
    </div>
  </div>
</div>

<style>
  .top {
    position: relative;
    width: 100%;
    height: fit-content;
  }

  .table {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-x: scroll;
  }

  .row {
    display: flex;
    width: fit-content;
    border-bottom: 1px solid #dddddd;
  }

  .item {
    width: 20rem;
    flex-shrink: 0;
    border: 0 solid #dddddd;
    border-right-width: 1px;
    box-sizing: border-box;
  }
</style>
