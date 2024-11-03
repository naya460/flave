<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";

  export let page_id: string;
  export let value:
    | {
        workspace_id: string;
        title: string;
      }
    | unknown;

  let workspace_id: string;
  let title: string;
  $: {
    if (
      typeof value === "object" &&
      value !== null &&
      "workspace_id" in value &&
      "title" in value &&
      typeof value.workspace_id === "string" &&
      typeof value.title === "string"
    ) {
      workspace_id = value.workspace_id;
      title = value.title;
    }
  }
</script>

<Button
  style={{
    buttonStyle: "text",
    textAlign: "left",
    width: "100%",
  }}
  on:click={() => {
    location.assign(`/${workspace_id}/${page_id}`);
  }}
>
  {title}
</Button>
