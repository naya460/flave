<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "$lib/gui/common/Button.svelte";
  import Cards from "$lib/gui/common/Cards.svelte";
  import type { PageData } from "./$types";
  export let data: PageData;

  const handleSignOut = async () => {
    const res = await flvFetch(`sessions`, "DELETE");
    if (res.ok) {
      location.assign("/signin");
    }
  };
</script>

<div>name: {data.name}</div>
<a href="/manager">manager</a>
<br />
<Button style={{ buttonStyle: "text" }} on:click={handleSignOut}
  >sign out</Button
>

<Cards
  items={data.workspaces}
  onItemClick={(event, item) => {
    location.href = `/${item._id}`;
  }}
>
  <div slot="item" let:item>
    <div>{item.name}</div>
  </div>
</Cards>
