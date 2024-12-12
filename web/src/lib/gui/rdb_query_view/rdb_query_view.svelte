<script lang="ts">
  import Button from "../common/Button.svelte";
  import ContextMenu from "../common/ContextMenu.svelte";
  import Table from "../rdb_view/table/table.svelte";
  import { RdbList } from "./rdb_list";
  import { RdbData } from "./rdb_data";
  import { RdbPageList } from "./rdb_page_list";
  import { RdbFilteredProperties } from "./rdb_filtered_properties";

  export let workspace_id: string;

  let rdb_list: RdbList = new RdbList(workspace_id);

  let rdb_data: RdbData = new RdbData(null);
  let rdb_filtered_properties: RdbFilteredProperties =
    new RdbFilteredProperties(rdb_data);

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
          rdb_filtered_properties.removeAll();
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
          rdb_filtered_properties.addAll();
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
        {#each $rdb_data.properties as data}
          {#if $rdb_filtered_properties.findIndex((v) => v.id === data.id) === -1}
            <Button
              style={{
                buttonStyle: "outline",
                width: "auto",
                height: "2.2rem",
              }}
              on:click={() => {
                rdb_filtered_properties.add(data.id);
              }}
            >
              {data.name}
            </Button>
          {/if}
        {/each}
      </ContextMenu>
    </div>
  </div>
  <div>
    {#each $rdb_filtered_properties as property}
      <Button
        style={{
          buttonStyle: "outline",
          width: "auto",
          height: "2.2rem",
        }}
        on:click={() => {
          rdb_filtered_properties.remove(property.id);
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
            rdb_filtered_properties.addAll();
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
        rdb_id={undefined}
        properties={$rdb_filtered_properties}
        constraints={$rdb_data.constraints}
        page_list={$rdb_page_list.page_list}
        set_menu={() => {}}
        push_page={() => {}}
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
