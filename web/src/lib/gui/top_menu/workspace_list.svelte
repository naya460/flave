<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "$lib/gui/common/Button.svelte";
  import Cards from "$lib/gui/common/Cards.svelte";
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import ContextMenu from "../common/ContextMenu.svelte";

  export let workspace_list: {
    _id: string;
    name: string;
  }[];

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

<div>
  <div class="menu">
    <div>Workspaces</div>
    <div class="create_menu">
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
      <div class="menu_wrapper">
        <ContextMenu bind:hidden={hidden_popup}>
          <form on:submit={onSubmit} class="form">
            <label for="name">Workspace Name</label>
            <TextInput type="text" id="name" name="name" autocomplete="off" />
            <Button style={{ buttonStyle: "filled" }}>Create</Button>
          </form>
        </ContextMenu>
      </div>
    </div>
  </div>
  <Cards
    items={workspace_list}
    onItemClick={(event, item) => {
      location.href = `/${item._id}`;
    }}
  >
    <div slot="item" let:item>
      <div>{item.name}</div>
    </div>
  </Cards>
</div>

<style>
  .menu {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .create_menu {
    position: relative;
  }

  .menu_wrapper {
    position: absolute;
    right: 20rem;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
