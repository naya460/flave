<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";

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

<a href="/manager">manager</a>
<br />
<Button style="text" on:click={handleSignOut}>sign out</Button>
