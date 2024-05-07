<script lang="ts">
  import type { PageData } from "./$types";
  import Cards from "$lib/gui/common/Cards.svelte";
  import CreateUser from "./CreateUser.svelte";
  import Popup from "$lib/gui/common/Popup.svelte";
  import { flvFetch } from "$lib/flv_fetch";

  export let data: PageData;

  let select_id: string = "";
  let popup_hidden = true;

  async function getUserWorkspaceList(user_id: string) {
    const res = await flvFetch(`users/${user_id}/workspaces`);
    const json: { name: string }[] = await res.json();
    return json;
  }
</script>

<CreateUser />

<Cards
  items={data.items}
  onItemClick={(e, i) => {
    select_id = i.id;
    popup_hidden = false;
  }}
>
  <div slot="item" let:item>
    <div>{item.name}</div>
    <div>id: {item.id}</div>
    <div>auth_id: {item.auth_id}</div>
    {#if item.admin === true}ADMIN{/if}
  </div>
</Cards>

<Popup bind:hidden={popup_hidden}>
  {#await getUserWorkspaceList(select_id)}
    <div>LOADING</div>
  {:then value}
    <Cards items={value}>
      <div slot="item" let:item>
        <div>{item.name}</div>
      </div>
    </Cards>
  {/await}
</Popup>
