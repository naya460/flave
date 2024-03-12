<a href="/manager">manager</a>

<form
  on:submit={async (event) => {
    const form_data = new FormData(event.currentTarget);
    const data = JSON.stringify({
      auth_id: form_data.get("auth_id"),
      password: form_data.get("password"),
    });
    const res = await fetch(`http://${location.hostname}:8080/sessions`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: data,
    });
    console.log(await res.json());
  }}
>
  <label for="auth_id">auth_id</label>
  <input type="text" id="auth_id" name="auth_id" autocomplete="off" />

  <label for="password">password</label>
  <input type="password" id="password" name="password" autocomplete="off" />

  <button>sign in</button>
</form>
