<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";

  export let value: {
    id: string;
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
    location.assign(`${value.id}`);
  }}
>
  {value.title}
</Button>
