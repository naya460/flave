<script lang="ts">
  import Button from "../common/Button.svelte";
  import ContextMenu from "../common/ContextMenu.svelte";
  import { flvFetch } from "$lib/flv_fetch";

  export let block_id: string;
  export let rdb_id: string;

  export let properties: {
    id: string;
    type: string;
    name: string;
  }[];

  export let display: string[];

  export let popup_hidden = true;
</script>

<div class="top">
  <ContextMenu bind:hidden={popup_hidden}>
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
            data: { rdb_id, display },
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
                  data: { rdb_id, display },
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
                  data: { rdb_id, display },
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
                data: { rdb_id, display },
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
                data: { rdb_id, display },
              });
            }}
          >
            +
          </Button>
        </div>
      {/if}
    {/each}
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
