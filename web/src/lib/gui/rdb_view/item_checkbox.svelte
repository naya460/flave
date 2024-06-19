<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";

  export let page_id: string;
  export let property_id: string;
  export let value: boolean | unknown;

  let checked: boolean = false;

  if (typeof value === "boolean") {
    checked = value;
  }
</script>

<input
  type="checkbox"
  {checked}
  on:change={async (event) => {
    await flvFetch(`pages/${page_id}/property/${property_id}`, "PATCH", {
      value: event.currentTarget.checked,
    });
  }}
/>
