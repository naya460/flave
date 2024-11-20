<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "$lib/gui/common/Button.svelte";
  import Cards from "$lib/gui/common/Cards.svelte";
  import Popup from "$lib/gui/common/Popup.svelte";
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import type { PageData } from "./$types";
  export let data: PageData;

  const handleSignOut = async () => {
    const res = await flvFetch(`sessions`, "DELETE");
    if (res.ok) {
      location.assign("/signin");
    }
  };

  const onSubmit = async (
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
  ) => {
    const form_data = new FormData(event.currentTarget);
    const data = {
      name: form_data.get("name"),
    };
    await flvFetch(`workspaces`, "POST", data);
    location.reload();
  };

  let hidden_popup = true;
</script>

<div class="top">
  <div class="user">
    <div>{data.name}</div>
    <div>
      <a href="/manager">manager</a>
      <Button style={{ buttonStyle: "text" }} on:click={handleSignOut}>
        Sign Out
      </Button>
    </div>
  </div>
  <div class="workspaces">
    <div>
      <div>Workspaces</div>
      <Button
        style={{
          buttonStyle: "text",
        }}
        on:click={() => {
          hidden_popup = false;
        }}
      >
        +
      </Button>
    </div>
    <Cards
      items={data.workspaces}
      onItemClick={(event, item) => {
        location.href = `/${item._id}`;
      }}
    >
      <div slot="item" let:item>
        <div>{item.name}</div>
      </div>
    </Cards>
  </div>
</div>

<Popup bind:hidden={hidden_popup}>
  <form on:submit={onSubmit} class="form">
    <label for="name">Workspace Name</label>
    <TextInput type="text" id="name" name="name" autocomplete="off" />
    <Button style={{ buttonStyle: "filled" }}>Create</Button>
  </form>
</Popup>

<style>
  .top {
    width: min(40rem, 90%);
    margin: auto;
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 1rem;
  }

  .user {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .user > :nth-child(1) {
    font-size: 1.5rem;
    align-content: center;
  }

  .user > :nth-child(2) {
    font-size: 1rem;
    display: grid;
    grid-template-rows: auto;
    justify-items: center;
  }

  .workspaces > :nth-child(1) {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
