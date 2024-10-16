<script lang="ts">
  import Button from "../common/Button.svelte";
  import { flvFetch } from "$lib/flv_fetch";
  import MenuAddProperty from "./menu_add_property.svelte";

  export let rdb_id: string;
  export let block_id: string;

  export let properties: {
    id: string;
    type: string;
    name: string;
    option?: unknown;
  }[];

  export let display: string[];

  export let display_menu: { dir: string; title: string }[] = [];
  export let menu_next: (dir: string, title: string) => void;
</script>

<div>
  {#if display_menu.length === 0}
    <div style:display="flex" style:flex-direction="row">
      <div style:flex-grow={1}>page</div>
      <Button
        style={{
          buttonStyle: "text",
          width: "2rem",
        }}
        on:click={async () => {
          if (display.includes("page")) {
            const index = display.findIndex((v) => v === "page");
            display.splice(index, 1);
          } else {
            display.push("page");
          }
          display = display;
          await flvFetch(`blocks/${block_id}`, "PATCH", {
            data: { display },
          });
        }}
      >
        {display.includes("page") ? "-" : "+"}
      </Button>
    </div>
    {#each display as display_id, i (display_id)}
      {@const property = properties.find((v) => v.id === display_id)}
      {#if property !== undefined}
        <div style:display="flex" style:flex-direction="row">
          <div style:flex-grow={1}>{property.name}</div>
          <Button
            style={{
              buttonStyle: "text",
              width: "2rem",
            }}
            on:click={async () => {
              if (i !== 0) {
                const p = display[i];
                display.splice(i, 1);
                display.splice(i - 1, 0, p);
                display = display;
                await flvFetch(`blocks/${block_id}`, "PATCH", {
                  data: { display },
                });
              }
            }}
          >
            ↑
          </Button>
          <Button
            style={{
              buttonStyle: "text",
              width: "2rem",
            }}
            on:click={async () => {
              if (i !== display.length - 1) {
                const p = display[i];
                display.splice(i, 1);
                display.splice(i + 1, 0, p);
                display = display;
                await flvFetch(`blocks/${block_id}`, "PATCH", {
                  data: { display },
                });
              }
            }}
          >
            ↓
          </Button>
          <Button
            style={{
              buttonStyle: "text",
              width: "2rem",
            }}
            on:click={async () => {
              const index = display.findIndex((v) => v === property.id);
              display.splice(index, 1);
              display = display;
              await flvFetch(`blocks/${block_id}`, "PATCH", {
                data: { display },
              });
            }}
          >
            -
          </Button>
        </div>
      {/if}
    {/each}
    {#each properties as property (property.id)}
      {#if display.includes(property.id) === false}
        <div style:display="flex" style:flex-direction="row">
          <div style:flex-grow={1}>{property.name}</div>
          <Button
            style={{
              buttonStyle: "text",
              width: "2rem",
            }}
            on:click={async () => {
              display.push(property.id);
              display = display;
              await flvFetch(`blocks/${block_id}`, "PATCH", {
                data: { display },
              });
            }}
          >
            +
          </Button>
        </div>
      {/if}
    {/each}
    <Button
      style={{
        buttonStyle: "text",
      }}
      on:click={() => {
        menu_next("add property", "add property");
      }}
    >
      + Add Property
    </Button>
  {:else if display_menu[0].dir === "add property"}
    <MenuAddProperty
      {rdb_id}
      bind:properties
      display_menu={display_menu.toSpliced(0, 1)}
      {menu_next}
    />
  {/if}
</div>
