<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";

  export let user_name: string;

  const handleSignOut = async () => {
    const res = await flvFetch(`sessions`, "DELETE");
    if (res.ok) {
      location.assign("/signin");
    }
  };
</script>

<div class="top">
  <div>{user_name}</div>
  <div>
    <a href="/manager">manager</a>
    <Button style={{ buttonStyle: "text" }} on:click={handleSignOut}>
      Sign Out
    </Button>
  </div>
</div>

<style>
  .top {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .top > :nth-child(1) {
    font-size: 1.5rem;
    align-content: center;
  }

  .top > :nth-child(2) {
    font-size: 1rem;
    display: grid;
    grid-template-rows: auto;
    justify-items: center;
  }
</style>
