<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let page_list: {
    _id: string;
    title: string;
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

<div class="table">
  {#each page_list as page}
    <Button
      style={{
        buttonStyle: "text",
        textAlign: "left",
      }}
      on:click={() => {
        location.assign(`/${data.workspace_id}/${page._id}`);
      }}
    >
      {page.title}
    </Button>
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
    grid-template-columns: 1fr;
  }
</style>
