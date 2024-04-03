<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import Cards from "$lib/gui/common/Cards.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  async function getPageList(): Promise<
    {
      title: string;
    }[]
  > {
    const res = await fetch(`http://${location.hostname}:8080/pages/`, {
      credentials: "include",
    });
    return await res.json();
  }
</script>

<div>{data.name}</div>

<Button
  style="text"
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
  <Cards items={pages}>
    <div slot="item" let:item>
      {item.title}
    </div>
  </Cards>
{/await}
