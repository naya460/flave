<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "$lib/gui/common/Button.svelte";
  import TextInput from "$lib/gui/common/TextInput.svelte";

  const onSubmit = async (
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) => {
    event.preventDefault();
    const form_data = new FormData(event.currentTarget);
    const result = await flvFetch(`sessions`, "POST", {
      auth_id: form_data.get("auth_id"),
      password: form_data.get("password"),
    });

    if (result.ok === true) {
      const param = new URLSearchParams(location.search);
      const next = param.get("next");
      if (next !== null) {
        location.assign(next);
      } else {
        location.assign("/");
      }
    }
  };
</script>

<div class="top">
  <form class="form" on:submit={onSubmit}>
    <label for="auth_id">Auth ID</label>
    <TextInput id="auth_id" name="auth_id" />

    <label for="password">Password</label>
    <TextInput type="password" id="password" name="password" />

    <Button style={{ buttonStyle: "filled" }}>Sign In</Button>
  </form>
</div>

<style>
  .top {
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .form {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    width: min(20rem, 90%);
    gap: 0.2rem;
  }
</style>
