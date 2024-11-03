<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import { beforeUpdate } from "svelte";
  import Button from "$lib/gui/common/Button.svelte";
  import ContextMenu from "$lib/gui/common/ContextMenu.svelte";

  export let page_id: string;
  export let property_id: string;
  export let option: unknown;

  export let value:
    | {
        page_list: string[];
      }
    | unknown;

  let page_list: string[] = [];
  let rdb_page_list: { _id: string; title: string }[] = [];

  let rdb: string | null = null;
  let only: boolean | null = null;

  if (
    typeof value === "object" &&
    value !== null &&
    "page_list" in value &&
    typeof value.page_list === "object" &&
    Array.isArray(value.page_list)
  ) {
    page_list = value.page_list;
  }

  beforeUpdate(() => {
    if (typeof option === "object" && option !== null) {
      if ("only" in option && typeof option.only === "boolean") {
        if (only !== option.only) {
          only = option.only;
        }
      }
    }
  });

  if (typeof option === "object" && option !== null) {
    if ("rdb" in option && typeof option.rdb === "string") {
      rdb = option.rdb;
    }
  }

  if (rdb !== null) {
    flvFetch(`rdbs/${rdb}/pages`, "GET").then((res) => {
      res.json().then((v) => {
        rdb_page_list = v;
      });
    });
  }

  let context_hidden = true;
</script>

<ContextMenu bind:hidden={context_hidden}>
  {#if page_list.length !== 0}
    <div>linked:</div>
    {@const local_page_list = only === true ? [page_list[0]] : page_list}
    {#each local_page_list as page}
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
          height: "2rem",
          textAlign: "left",
        }}
        on:click={async () => {
          if (only === true) {
            page_list = [];
          } else {
            page_list = page_list.filter((v) => v !== page);
          }
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
  {/if}
  {#if page_list.length !== rdb_page_list.length}
    <div>link:</div>
    {@const local_page_list = only === true ? [page_list[0]] : page_list}
    {#each rdb_page_list as page}
      {#if local_page_list.includes(page._id) === false}
        <Button
          style={{
            buttonStyle: "text",
            width: "100%",
            height: "2rem",
            textAlign: "left",
          }}
          on:click={async () => {
            if (only === true) {
              page_list = [page._id];
            } else {
              page_list.push(page._id);
              page_list = page_list;
            }
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
  {/if}
</ContextMenu>

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
  {#if only === true}
    {@const page_id = page_list.length !== 0 ? page_list[0] : undefined}
    {#if page_id !== undefined}
      <div>{rdb_page_list.find((v) => v._id === page_id)?.title}</div>
    {/if}
  {:else}
    {#each page_list as page_id}
      <div>{rdb_page_list.find((v) => v._id === page_id)?.title}</div>
    {/each}
  {/if}
</Button>
