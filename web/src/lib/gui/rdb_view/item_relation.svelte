<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "../common/Button.svelte";
  import ContextMenu from "../common/ContextMenu.svelte";

  export let page_id: string;
  export let property_id: string;
  export let option: unknown;

  export let value:
    | {
        page_list: string[];
      }
    | unknown;

  let page_list: string[] = [];

  if (
    typeof value === "object" &&
    value !== null &&
    "page_list" in value &&
    typeof value.page_list === "object" &&
    Array.isArray(value.page_list)
  ) {
    page_list = value.page_list;
  }

  let rdb: string | null = null;

  if (
    typeof option === "object" &&
    option !== null &&
    "rdb" in option &&
    typeof option.rdb === "string"
  ) {
    rdb = option.rdb;
  }

  let context_hidden = true;

  let rdb_page_list: { _id: string; title: string }[] = [];

  if (rdb !== null) {
    flvFetch(`rdbs/${rdb}/pages`, "GET").then((res) => {
      res.json().then((v) => {
        rdb_page_list = v;
      });
    });
  }
</script>

<Button
  style={{
    buttonStyle: "text",
    textAlign: "left",
    width: "100%",
    height: "100%",
  }}
  on:click={() => {
    context_hidden = false;
  }}
>
  {#each page_list as page_id}
    {#await flvFetch(`pages/${page_id}`, "GET") then res}
      {#await res.json() then data}
        <div>{data.title}</div>
      {/await}
    {/await}
  {/each}
</Button>

<div class="top">
  <ContextMenu bind:hidden={context_hidden}>
    {#if page_list.length !== 0}
      <div>linked:</div>
    {/if}
    {#each page_list as page}
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
          height: "2rem",
          textAlign: "left",
        }}
        on:click={async () => {
          page_list = page_list.filter((v) => v !== page);
          await flvFetch(`pages/${page_id}/property/${property_id}`, "PATCH", {
            value: {
              page_list,
            },
          });
        }}
      >
        {rdb_page_list.find((v) => v._id === page)?.title}
      </Button>
    {/each}
    {#if page_list.length !== rdb_page_list.length}
      <div>link:</div>
    {/if}
    {#each rdb_page_list as page}
      {#if page_list.includes(page._id) === false}
        <Button
          style={{
            buttonStyle: "text",
            width: "100%",
            height: "2rem",
            textAlign: "left",
          }}
          on:click={async () => {
            page_list.push(page._id);
            page_list = page_list;
            await flvFetch(
              `pages/${page_id}/property/${property_id}`,
              "PATCH",
              {
                value: {
                  page_list,
                },
              }
            );
          }}
        >
          {page.title}
        </Button>
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
