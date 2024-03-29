<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import type { PageData } from "./$types";
  export let data: PageData;

  const handleSignOut = async () => {
    const res = await fetch(`http://${location.hostname}:8080/sessions/`, {
      method: "delete",
      credentials: "include",
    });
    if (res.ok) {
      location.assign("/signin");
    }
  };
</script>

<div>name: {data.name}</div>
<a href="/manager">manager</a>
<br />
<Button style="text" on:click={handleSignOut}>sign out</Button>
