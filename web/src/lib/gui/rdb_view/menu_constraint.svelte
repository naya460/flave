<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";
  import Cards from "../common/Cards.svelte";
  import ContextMenu from "../common/ContextMenu.svelte";

  export let rdb_id: string;

  export let properties: {
    id: string;
    name: string;
  }[];

  export let constraints: {
    id: string;
    type: string;
    option: object;
  }[];

  export let popup_hidden = true;

  let add_constraint_popup_hidden = true;

  let tmp_constraint_properties: string[] = [];
</script>

<div class="top">
  <ContextMenu bind:hidden={popup_hidden}>
    <Button
      style={{
        buttonStyle: "text",
        width: "100%",
        textAlign: "left",
      }}
      on:click={() => {
        tmp_constraint_properties = [];
        add_constraint_popup_hidden = false;
      }}
    >
      + Add Unique Constraint
    </Button>
    <ContextMenu bind:hidden={add_constraint_popup_hidden}>
      {#each properties as property}
        <div style:display="flex" style:flex-direction="row">
          <Button
            style={{
              buttonStyle: "text",
              width: "2rem",
            }}
            on:click={() => {
              if (tmp_constraint_properties.includes(property.id)) {
                const index = tmp_constraint_properties.findIndex(
                  (v) => v === property.id
                );
                tmp_constraint_properties.splice(index, 1);
                tmp_constraint_properties = tmp_constraint_properties;
              } else {
                tmp_constraint_properties.push(property.id);
                tmp_constraint_properties = tmp_constraint_properties;
              }
            }}
          >
            {tmp_constraint_properties.includes(property.id) ? "-" : "+"}
          </Button>
          <div>{property.name}</div>
        </div>
      {/each}
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
        }}
        on:click={() => {
          flvFetch(`rdbs/${rdb_id}/constraint`, "POST", {
            type: "unique",
            option: {
              target: tmp_constraint_properties,
            },
          });
        }}
      >
        + Add Constraint
      </Button>
    </ContextMenu>

    {#if constraints.length !== 0}
      <Cards items={constraints}>
        <div slot="item" let:item>
          {#if "target" in item.option && Array.isArray(item.option.target)}
            {#each item.option.target as target}
              <div>{properties.find((v) => v.id === target)?.name}</div>
            {/each}
          {/if}
        </div>
      </Cards>
    {/if}
  </ContextMenu>
</div>

<style>
  .top {
    position: absolute;
    top: 0;
    right: 20rem;
    z-index: 1;
  }
</style>
