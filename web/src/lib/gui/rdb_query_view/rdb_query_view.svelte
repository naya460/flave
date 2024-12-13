<script lang="ts">
  import Button from "../common/Button.svelte";
  import ContextMenu from "../common/ContextMenu.svelte";
  import Table from "../rdb_view/table/table.svelte";
  import { RdbList } from "./rdb_list";
  import { RdbData } from "./rdb_data/rdb_data";
  import { RdbPageList } from "./rdb_page_list";

  export let workspace_id: string;

  let rdb_list = new RdbList(workspace_id);

  let rdb_data = new RdbData(null);
  let property_list = rdb_data.getPropertyList();

  let rdb_page_list: RdbPageList = new RdbPageList(null);

  let rdb_list_hidden = true;
  let select_add_button_hidden = true;
</script>

<div class="frame">
  <div style:display="flex" style:gap="1rem">
    <div>SELECT</div>
    <div style:gap="1rem">
      <Button
        style={{
          buttonStyle: "outline",
          buttonDarker: true,
          width: "1.5rem",
          height: "1.5rem",
        }}
        on:click={() => {
          property_list.removeAll();
        }}
      >
        0
      </Button>
      <Button
        style={{
          buttonStyle: "outline",
          buttonDarker: true,
          width: "1.5rem",
          height: "1.5rem",
        }}
        on:click={() => {
          property_list.addAll();
        }}
      >
        *
      </Button>
      <Button
        style={{
          buttonStyle: "outline",
          buttonDarker: true,
          width: "1.5rem",
          height: "1.5rem",
        }}
        on:click={() => {
          select_add_button_hidden = false;
        }}
      >
        +
      </Button>
      <ContextMenu bind:hidden={select_add_button_hidden}>
        {#each $property_list.hidden_properties as data (data.id)}
          <Button
            style={{
              buttonStyle: "outline",
              width: "auto",
              height: "2.2rem",
            }}
            on:click={() => {
              property_list.add(data.id);
            }}
          >
            {data.name}
          </Button>
        {/each}
      </ContextMenu>
    </div>
  </div>
  <div>
    {#each $property_list.filtered_properties as property}
      <Button
        style={{
          buttonStyle: "outline",
          width: "auto",
          height: "2.2rem",
        }}
        on:click={() => {
          property_list.remove(property.id);
        }}
      >
        {property.name}
      </Button>
    {/each}
  </div>
</div>

<div class="frame">
  <div>FROM</div>
  <div>
    <Button
      style={{
        buttonStyle: "outline",
        width: "15rem",
        height: "2.5rem",
      }}
      on:click={() => {
        rdb_list_hidden = false;
      }}
    >
      <div class="select">
        <div>
          {$rdb_data.title}
        </div>
        <div>v</div>
      </div>
    </Button>
    <ContextMenu bind:hidden={rdb_list_hidden}>
      {#each $rdb_list as item}
        <Button
          style={{
            buttonStyle: "text",
            width: "100%",
            height: "2rem",
            textAlign: "left",
          }}
          on:click={() => {
            rdb_data.changeRdb(item._id);
            rdb_page_list.changeRdb(item._id);
            rdb_list_hidden = true;
          }}
        >
          {item.title}
        </Button>
      {/each}
    </ContextMenu>
  </div>
</div>

<div class="frame">
  <div>RESULT</div>
  <div style:overflow-x="hidden">
    {#if $rdb_data.rdb_id !== null && $rdb_page_list.rdb_id !== null}
      <Table
        rdb_id={$rdb_data.rdb_id}
        menu_enable={false}
        {property_list}
        {rdb_data}
        {rdb_page_list}
        set_menu={() => {}}
      />
    {/if}
  </div>
</div>

<style>
  .frame {
    display: grid;
    grid-template-rows: 2rem auto;
    box-shadow: 0px 0px 2px 0px #888888;
    margin: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #f8f8f8;
  }

  .frame > :first-child {
    font-size: 1.2rem;
  }

  .frame > :nth-child(2) {
    background-color: #ffffff;
    min-height: 2rem;
    border-radius: 0.5rem;
    padding: 0.5rem;
  }

  .select {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 0.2rem 0.5rem;
  }
</style>
