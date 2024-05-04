<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

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
    const res = await fetch(
      `http://${location.hostname}:8080/rdbs/${data.rdb_id}/pages`,
      { credentials: "include" }
    );
    if (res.ok === false) return;
    page_list = await res.json();
  });
</script>

<TextInput
  style={{ outline: false, fontSize: "1.5rem" }}
  value={data.rdb_data.title}
  onChange={async (event) => {
    await fetch(`http://${location.hostname}:8080/rdbs/${data.rdb_id}`, {
      method: "PATCH",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: event.currentTarget.value }),
    });
  }}
/>

<Button
  style={{
    buttonStyle: "text",
  }}
  on:click={async () => {
    await fetch(
      `http://${location.hostname}:8080/rdbs/${data.rdb_id}/property`,
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "text", name: "new property" }),
      }
    );
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
            await fetch(
              `http://${location.hostname}:8080/rdbs/${data.rdb_id}/property/${property.id}`,
              {
                method: "PATCH",
                mode: "cors",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: event.currentTarget.value }),
              }
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
              await fetch(
                `http://${location.hostname}:8080/pages/${page._id}/property/${property.id}`,
                {
                  method: "PATCH",
                  mode: "cors",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ value: event.currentTarget.value }),
                }
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
    await fetch(`http://${location.hostname}:8080/pages`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace_id: data.workspace_id,
        rdb_id: data.rdb_id,
      }),
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
