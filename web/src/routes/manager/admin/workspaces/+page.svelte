<script lang="ts">
  import Cards from "$lib/gui/common/Cards.svelte";
  import Button from "$lib/gui/common/Button.svelte";
  import Popup from "$lib/gui/common/Popup.svelte";
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let hidden_popup = true;

  const onSubmit = async (
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) => {
    const form_data = new FormData(event.currentTarget);
    const data = JSON.stringify({
      name: form_data.get("name"),
    });
    await fetch(`http://${location.hostname}:8080/workspaces`, {
      method: "post",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
    location.reload();
  };
</script>

<Button style="text" on:click={() => (hidden_popup = false)}>
  Create Workspace
</Button>

<Cards items={data.items}>
  <div slot="item" let:item>
    <div>{item.name}</div>
    <div>id: {item.id}</div>
    <div>owner: {item.owner}</div>
  </div>
</Cards>

<Popup bind:hidden={hidden_popup}>
  <form on:submit={onSubmit} class="form">
    <label for="name">Workspace Name</label>
    <TextInput type="text" id="name" name="name" autocomplete="off" />
    <Button style="filled">Create</Button>
  </form>
</Popup>
