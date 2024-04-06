<script lang="ts">
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<TextInput
  style={{ outline: false, fontSize: "1.5rem" }}
  value={data.page_data.title}
  onChange={async (event) => {
    await fetch(`http://${location.hostname}:8080/pages/${data.page_id}`, {
      method: "PATCH",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: event.currentTarget.value }),
    });
  }}
/>
