<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import ContextMenu from "$lib/gui/common/ContextMenu.svelte";
  import Frame from "../frame.svelte";
  import type { FiltablePropertyList } from "../rdb_data/filtable_property_list";

  export let property_list: FiltablePropertyList;

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
          property_list.removeAll();
        }}
      >
        0
      </Button>
      <Button
        style={heading_style}
        on:click={() => {
          property_list.addAll();
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
        {#each $property_list.hidden_properties as data (data.id)}
          <Button
            style={property_style}
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
  <div slot="contents">
    {#each $property_list.filtered_properties as property}
      <Button
        style={property_style}
        on:click={() => {
          property_list.remove(property.id);
        }}
      >
        {property.name}
      </Button>
    {/each}
  </div>
</Frame>
