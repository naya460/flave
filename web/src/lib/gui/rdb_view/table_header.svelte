<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";
  import ContextMenu from "../common/ContextMenu.svelte";
  import TextInput from "../common/TextInput.svelte";

  export let block_id: string;
  export let rdb_id: string;

  export let properties: {
    id: string;
    type: string;
    name: string;
  }[];

  export let display: string[];

  let popup_hidden = true;
</script>

{#if display.includes("page") === true}
  <div class="item" style:padding="0.2rem 0.5rem" style:box-sizing="border-box">
    page
  </div>
{/if}

{#if properties !== undefined}
  {#each display as display_id}
    {@const property = properties.find((v) => v.id === display_id)}
    {#if property !== undefined}
      <div class="item">
        <TextInput
          style={{ outline: false }}
          value={property.name}
          onChange={async (event) => {
            await flvFetch(`rdbs/${rdb_id}/property/${property.id}`, "PATCH", {
              name: event.currentTarget.value,
            });
          }}
        />
      </div>
    {/if}
  {/each}
{/if}

<div style:display="flex" style:flex-direction="row">
  <Button
    style={{
      buttonStyle: "text",
    }}
    on:click={async () => {
      await flvFetch(`rdbs/${rdb_id}/property`, "POST", {
        type: "text",
        name: "new property",
      });
    }}
  >
    +
  </Button>
  <Button
    style={{
      buttonStyle: "text",
    }}
    on:click={() => {
      popup_hidden = false;
    }}
  >
    ...
  </Button>
  <div style:position="absolute" style:z-index={100} style:right="20rem">
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
</div>

<style>
  .item {
    width: 20rem;
    flex-shrink: 0;
    border: 0 solid #dddddd;
    border-right-width: 1px;
    box-sizing: border-box;
  }
</style>
