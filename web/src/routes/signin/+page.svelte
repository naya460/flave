<script>
  import TextInput from "$lib/gui/common/TextInput.svelte";
</script>

<a href="/">top page</a>

<form
  on:submit={async (event) => {
    const form_data = new FormData(event.currentTarget);
    const data = JSON.stringify({
      auth_id: form_data.get("auth_id"),
      password: form_data.get("password"),
    });
    const result = await fetch(`http://${location.hostname}:8080/sessions`, {
      method: "post",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: data,
    });

    if (result.ok === true) {
      location.assign("/");
    }
  }}
>
  <label for="auth_id">auth_id</label>
  <TextInput id="auth_id" name="auth_id" />

  <label for="password">password</label>
  <TextInput type="password" id="password" name="password" />

  <button>sign in</button>
</form>
