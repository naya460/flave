<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import TextInput from "$lib/gui/common/TextInput.svelte";

  export let properties: {
    id: string;
    type: string;
    name: string;
  }[];

  export let display_menu: { dir: string; title: string }[] = [];
  export let menu_next: (dir: string, title: string) => void;
  export let menu_back: () => void;

  let local_text = "";
  let local_checkbox = false;

  export let filters: {
    id: string;
    value: string | boolean;
  }[] = [];
</script>

{#if display_menu.length === 0}
  {#each filters as filter}
    <div>
      {properties.find((v) => v.id === filter.id)?.name}: {filter.value}
    </div>
  {/each}
  <Button
    style={{
      buttonStyle: "text",
      width: "100%",
      textAlign: "left",
      height: "2rem",
    }}
    on:click={() => {
      menu_next("add filter", "Add filter");
    }}
  >
    + Add filter
  </Button>
{:else if display_menu[0].dir === "add filter"}
  {@const local_display_menu = display_menu.toSpliced(0, 1)}
  {#if local_display_menu.length === 0}
    {#each properties as property}
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
          textAlign: "left",
          height: "2rem",
        }}
        on:click={() => {
          menu_next(property.id, property.name);
          local_text = "";
          local_checkbox = false;
        }}
      >
        {property.name}
      </Button>
    {/each}
  {:else}
    {@const property_type = properties.find(
      (v) => v.id === local_display_menu[0].dir
    )?.type}
    {#if property_type === "text"}
      <TextInput
        onChange={(event) => (local_text = event.currentTarget.value)}
      />
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
          textAlign: "left",
          height: "2rem",
        }}
        on:click={() => {
          filters = [
            ...filters,
            {
              id: local_display_menu[0].dir,
              value: local_text,
            },
          ];
          filters = filters;
          menu_back();
          menu_back();
        }}
      >
        + Add
      </Button>
    {:else if property_type === "checkbox"}
      <input
        type="checkbox"
        on:change={(event) => (local_checkbox = event.currentTarget.checked)}
      />
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
          textAlign: "left",
          height: "2rem",
        }}
        on:click={() => {
          filters = [
            ...filters,
            {
              id: local_display_menu[0].dir,
              value: local_checkbox,
            },
          ];
          menu_back();
          menu_back();
        }}
      >
        + Add
      </Button>
    {/if}
  {/if}
{/if}
