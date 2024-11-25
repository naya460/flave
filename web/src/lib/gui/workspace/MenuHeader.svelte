<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";
  import ContextMenu from "../common/ContextMenu.svelte";

  export let workspace_id: string;
  export let workspace_name: string;

  export let workspace_list: {
    _id: string;
    name: string;
  }[];

  let popup_hidden = true;

  const style = {
    buttonStyle: "text",
    width: "100%",
    height: "2rem",
    textAlign: "left",
  } as const;

  const handleSignOut = async () => {
    const res = await flvFetch(`sessions`, "DELETE");
    if (res.ok) {
      location.assign("/signin");
    }
  };
</script>

<Button
  style={{
    buttonStyle: "outline",
    buttonDarker: true,
    textAlign: "left",
    width: "100%",
    height: "2rem",
  }}
  on:click={() => {
    popup_hidden = false;
  }}
>
  <div class="button_top">
    <div>{workspace_name}</div>
    <div>v</div>
  </div>
</Button>

<ContextMenu bind:hidden={popup_hidden}>
  <Button {style} on:click={() => location.assign("/")}>User Home Page</Button>
  <div class="line" />
  {#each workspace_list as workspace}
    {#if workspace_id !== workspace._id}
      <Button {style} on:click={() => location.assign(`/${workspace._id}`)}>
        {workspace.name}
      </Button>
    {/if}
  {/each}
  <div class="line" />
  <Button {style} on:click={handleSignOut}>Sign Out</Button>
</ContextMenu>

<style>
  .button_top {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1rem;
  }

  .line {
    height: 1px;
    width: 100%;
    background-color: #bbbbbb;
    margin: 0.2rem 0;
  }
</style>
