<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "$lib/gui/common/Button.svelte";
  import Popup from "$lib/gui/common/Popup.svelte";
  import TextInput from "$lib/gui/common/TextInput.svelte";

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
    await flvFetch(`users`, "POST", data);
    location.reload();
  };
</script>

<Button style={{ buttonStyle: "text" }} on:click={() => (hidden_popup = false)}>
  Create User
</Button>

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
    <Button style={{ buttonStyle: "filled" }}>add</Button>
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
