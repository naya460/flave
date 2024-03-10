<script lang="ts">
  import type { PageData } from "./$types";
  import List from "$lib/gui/common/List.svelte";

  export let data: PageData;
</script>

<List
  initial_items={data.items.map((value) => {
    return { title: value.name, description: value.id };
  })}
/>

<form
  on:submit={(event) => {
    const form_data = new FormData(event.currentTarget);
    const data = JSON.stringify({
      auth_id: form_data.get("auth_id"),
      password: form_data.get("password"),
      confirm_password: form_data.get("confirm_password"),
    });
    fetch(`http://${location.hostname}:8080/users`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
  }}
>
  <label for="auth_id">auth_id</label>
  <input type="text" id="auth_id" name="auth_id" autocomplete="off" />
  <label for="password">password</label>
  <input type="password" id="password" name="password" autocomplete="off" />
  <label for="confirm_password">confirm_password</label>
  <input
    type="password"
    id="confirm_password"
    name="confirm_password"
    autocomplete="off"
  />
  <button>add</button>
</form>
