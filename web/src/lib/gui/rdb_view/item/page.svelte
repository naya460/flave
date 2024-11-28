<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";

  export let page_id: string;
  export let value: {
    title: string;
  };
</script>

<Button
  style={{
    buttonStyle: "text",
    textAlign: "left",
    width: "100%",
  }}
  on:click={() => {
    location.assign(`${page_id}`);
  }}
>
  {value.title}
</Button>
