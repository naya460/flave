<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";

  import TextInput from "$lib/gui/common/TextInput.svelte";

  export let page_id: string;
  export let property_id: string;
  export let value: string | unknown;

  let text: string;
  $: {
    if (typeof value === "string") {
      text = value;
    }
  }
</script>

<TextInput
  style={{ outline: false }}
  value={text}
  onChange={async (event) => {
    await flvFetch(`pages/${page_id}/property/${property_id}`, "PATCH", {
      value: event.currentTarget.value,
    });
  }}
/>
