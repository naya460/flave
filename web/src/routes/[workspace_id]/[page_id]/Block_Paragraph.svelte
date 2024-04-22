<script lang="ts">
  import TextInput from "$lib/gui/common/TextInput.svelte";

  export let block_data: {
    text: string;
  } | null;
</script>

{#if block_data !== null}
  <TextInput value={block_data.text} />
{/if}
