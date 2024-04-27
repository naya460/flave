<script lang="ts">
  import TextInput from "$lib/gui/common/TextInput.svelte";

  export let page_id: string;

  export let block_data: {
    _id: string;
    text: string;
  } | null;
</script>

{#if block_data !== null}
  <TextInput
    value={block_data.text}
    onChange={async (event) => {
      await fetch(
        `http://${location.hostname}:8080/blocks/${block_data?._id}`,
        {
          method: "PATCH",
          mode: "cors",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { text: event.currentTarget.value } }),
        }
      );
    }}
    onKeyDown={async (event) => {
      if (event.key === "Enter") {
        await fetch(`http://${location.hostname}:8080/blocks`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page_id: page_id,
            next_of: block_data._id,
            type: "paragraph",
            data: { text: "" },
          }),
        });
      }
    }}
  />
{/if}
