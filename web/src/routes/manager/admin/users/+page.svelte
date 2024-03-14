<script lang="ts">
  import type { PageData } from "./$types";
  import Cards from "$lib/gui/common/Cards.svelte";
  import Button from "$lib/gui/common/Button.svelte";
  import Popup from "$lib/gui/common/Popup.svelte";
  import TextInput from "$lib/gui/common/TextInput.svelte";

  export let data: PageData;

  let hidden_popup = true;

  const onSubmit = async (
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) => {
    const form_data = new FormData(event.currentTarget);
    const data = JSON.stringify({
      auth_id: form_data.get("auth_id"),
      password: form_data.get("password"),
      confirm_password: form_data.get("confirm_password"),
    });
    await fetch(`http://${location.hostname}:8080/users`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
    location.reload();
  };
</script>

<Button style="text" on:click={() => (hidden_popup = false)}>Create User</Button
>

<Cards items={data.items}>
  <div slot="item" let:item>
    <div>{item.name}</div>
    <div>id: {item.id}</div>
    <div>auth_id: {item.auth_id}</div>
    {#if item.admin === true}ADMIN{/if}
  </div>
</Cards>

<Popup bind:hidden={hidden_popup}>
  <form on:submit={onSubmit} class="form">
    <label for="auth_id">auth_id</label>
    <TextInput type="text" id="auth_id" name="auth_id" autocomplete="off" />
    <label for="password">password</label>
    <TextInput
      type="password"
      id="password"
      name="password"
      autocomplete="off"
    />
    <label for="confirm_password">confirm_password</label>
    <TextInput
      type="password"
      id="confirm_password"
      name="confirm_password"
      autocomplete="off"
    />
    <Button style="filled">add</Button>
  </form>
</Popup>

<style>
  .form {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    width: 100%;
    gap: 0.2rem;
  }
</style>
