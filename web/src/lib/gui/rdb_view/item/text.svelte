<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";

  import TextInput from "$lib/gui/common/TextInput.svelte";

  export let page_id: string | null;
  export let property_id: string;
  export let value: string;
</script>

<TextInput
  style={{ outline: false }}
  {value}
  onChange={async (event) => {
    if (page_id === null) return;
    await flvFetch(`pages/${page_id}/property/${property_id}`, "PATCH", {
      value: event.currentTarget.value,
    });
  }}
/>
