<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import ContextMenu from "$lib/gui/common/ContextMenu.svelte";
  import Frame from "../frame.svelte";
  import type { RdbFromClause } from "./from";
  import type { RdbResourcesType } from "./rdb_resources";
  import { RdbSelectClause } from "./select";

  export let rdb_from_clause: RdbFromClause;

  export let update_resources: (v: RdbResourcesType) => void;

  let rdb_select_clause = new RdbSelectClause({
    properties: [],
    constraints: [],
    page_list: [],
  });

  rdb_from_clause.subscribe((v) => {
    rdb_select_clause.updateRdbResources(v);
  });

  rdb_select_clause.subscribe((v) => {
    update_resources(v.rdb_resources);
  });

  let select_add_button_hidden = true;

  const heading_style = {
    buttonStyle: "outline",
    buttonDarker: true,
    width: "1.5rem",
    height: "1.5rem",
  } as const;

  const property_style = {
    buttonStyle: "outline",
    width: "auto",
    height: "2.2rem",
  } as const;
</script>

<Frame>
  <div slot="heading" style:display="flex" style:gap="1rem">
    <div>SELECT</div>
    <div style:gap="1rem">
      <Button
        style={heading_style}
        on:click={() => {
          rdb_select_clause.hideAllProperties();
        }}
      >
        0
      </Button>
      <Button
        style={heading_style}
        on:click={() => {
          rdb_select_clause.displayAllProperties();
        }}
      >
        *
      </Button>
      <Button
        style={heading_style}
        on:click={() => {
          select_add_button_hidden = false;
        }}
      >
        +
      </Button>
      <ContextMenu bind:hidden={select_add_button_hidden}>
        {#each $rdb_select_clause.rdb_select_resources.hidden_properties as property (property.id)}
          <Button
            style={property_style}
            on:click={() => {
              rdb_select_clause.displayProperty(property.id);
            }}
          >
            {property.name}
          </Button>
        {/each}
      </ContextMenu>
    </div>
  </div>
  <div slot="contents">
    {#each $rdb_select_clause.rdb_select_resources.display_properties as property (property.id)}
      <Button
        style={property_style}
        on:click={() => {
          rdb_select_clause.hideProperty(property.id);
        }}
      >
        {property.name}
      </Button>
    {/each}
  </div>
</Frame>
