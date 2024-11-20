<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "$lib/gui/common/Button.svelte";
  import TextInput from "$lib/gui/common/TextInput.svelte";

  const onSignInSubmit = async (
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

  const onSignUpSubmit = async (
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) => {
    event.preventDefault();
    const form_data = new FormData(event.currentTarget);
    const data = {
      auth_id: form_data.get("auth_id"),
      password: form_data.get("password"),
      confirm_password: form_data.get("confirm_password"),
    };
    const result = await flvFetch(`users`, "POST", data);

    if (result.ok === true) {
      const result = await flvFetch("sessions", "POST", {
        auth_id: data.auth_id,
        password: data.password,
      });
      if (result.ok === true) {
        location.assign("/");
      } else {
        alert("User created but failed to sign in.");
      }
    } else {
      alert(
        `Auth ID "${data.auth_id}" is already exists or difference passwords.`
      );
    }
  };

  let sign_up = false;
</script>

<div class="top">
  <div class="contents">
    {#if sign_up}
      <form class="form" on:submit={onSignUpSubmit}>
        <label for="auth_id">Auth ID</label>
        <TextInput id="auth_id" name="auth_id" autocomplete="off" />

        <label for="password">Password</label>
        <TextInput
          type="password"
          id="password"
          name="password"
          autocomplete="off"
        />

        <label for="confirm_password">Confirm Password</label>
        <TextInput
          type="password"
          id="confirm_password"
          name="confirm_password"
          autocomplete="off"
        />

        <Button style={{ buttonStyle: "filled" }}>Sign Up</Button>
      </form>
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
          textAlign: "left",
          height: "2rem",
        }}
        on:click={() => (sign_up = false)}
      >
        Change to Sign In form
      </Button>
    {:else}
      <form class="form" on:submit={onSignInSubmit}>
        <label for="auth_id">Auth ID</label>
        <TextInput id="auth_id" name="auth_id" />

        <label for="password">Password</label>
        <TextInput type="password" id="password" name="password" />

        <Button style={{ buttonStyle: "filled" }}>Sign In</Button>
      </form>
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
          textAlign: "left",
          height: "2rem",
        }}
        on:click={() => (sign_up = true)}
      >
        Change to Sign Up form
      </Button>
    {/if}
  </div>
</div>

<style>
  .top {
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .contents {
    width: min(20rem, 90%);
  }

  .form {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 0.2rem;
  }
</style>
