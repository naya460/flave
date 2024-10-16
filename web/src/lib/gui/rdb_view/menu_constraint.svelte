<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";
  import Cards from "../common/Cards.svelte";

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

  export let display_menu: { dir: string; title: string }[] = [];
  export let menu_next: (dir: string, title: string) => void;

  let tmp_constraint_properties: string[] = [];
</script>

<div>
  {#if display_menu.length === 0}
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
    <Button
      style={{
        buttonStyle: "text",
        width: "100%",
        textAlign: "left",
      }}
      on:click={() => {
        tmp_constraint_properties = [];
        menu_next("add constraint", "add constrant");
      }}
    >
      + Add Unique Constraint
    </Button>
  {:else if display_menu[0].dir === "add constraint"}
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
  {/if}
</div>
