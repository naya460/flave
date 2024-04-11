<script lang="ts">
  import ToggleMenu from "$lib/gui/common/ToggleMenu.svelte";
  import Button from "$lib/gui/common/Button.svelte";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  async function getPageList(): Promise<
    {
      _id: string;
      title: string;
    }[]
  > {
    const res = await fetch(
      `http://${location.hostname}:8080/workspaces/${data.workspace_id}/pages`,
      { credentials: "include" }
    );
    return await res.json();
  }
</script>

<div>{data.name}</div>

<Button
  style={{
    buttonStyle: "text",
  }}
  on:click={async () => {
    await fetch(`http://${location.hostname}:8080/pages`, {
      method: "post",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspace_id: data.workspace_id,
      }),
    });
  }}
>
  Create Page
</Button>

{#await getPageList() then pages}
  {#each pages as page}
    <ToggleMenu>
      <Button
        slot="summary"
        style={{
          buttonStyle: "text",
          textAlign: "left",
        }}
        on:click={() => {
          location.assign(`/workspace/${data.workspace_id}/${page._id}`);
        }}
      >
        {page.title}
      </Button>
    </ToggleMenu>
  {/each}
{/await}
