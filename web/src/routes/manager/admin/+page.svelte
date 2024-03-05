<script lang="ts">
  import type { PageData } from "./$types";
  import Index from "$lib/gui/common/list/list.svelte";

  export let data: PageData;
</script>

<Index initial_items={data.items} />

<form
  on:submit={(event) => {
    const form_data = new FormData(event.currentTarget);
    const data = JSON.stringify({
      name: form_data.get("name"),
    });
    fetch(`http://${location.hostname}:8080/flave/user/add`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
  }}
>
  <label for="name">name</label>
  <input type="text" id="name" autocomplete="off" />
  <button>add</button>
</form>
