<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import Button from "$lib/gui/common/Button.svelte";
  import ContextMenu from "$lib/gui/common/ContextMenu.svelte";

  export let page_id: string;
  export let property_id: string;
  export let option: {
    rdb: string;
    only: boolean;
  };

  export let value: {
    page_list: string[];
  };
  let rdb_page_list: { _id: string; title: string }[] = [];

  if (option.rdb !== null) {
    flvFetch(`rdbs/${option.rdb}/pages`, "GET").then((res) => {
      res.json().then((v) => {
        rdb_page_list = v;
      });
    });
  }

  let context_hidden = true;
</script>

<ContextMenu bind:hidden={context_hidden}>
  {#if value.page_list.length !== 0}
    <div>linked:</div>
    {@const local_page_list =
      option.only === true ? [value.page_list[0]] : value.page_list}
    {#each local_page_list as page}
      <Button
        style={{
          buttonStyle: "text",
          width: "100%",
          height: "2rem",
          textAlign: "left",
        }}
        on:click={async () => {
          if (option.only === true) {
            value.page_list = [];
          } else {
            value.page_list = value.page_list.filter((v) => v !== page);
          }
          await flvFetch(`pages/${page_id}/property/${property_id}`, "PATCH", {
            value: {
              page_list: value.page_list,
            },
          });
        }}
      >
        {rdb_page_list.find((v) => v._id === page)?.title}
      </Button>
    {/each}
  {/if}
  {#if value.page_list.length !== rdb_page_list.length}
    <div>link:</div>
    {@const local_page_list =
      option.only === true ? [value.page_list[0]] : value.page_list}
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
            if (option.only === true) {
              value.page_list = [page._id];
            } else {
              value.page_list.push(page._id);
              value.page_list = value.page_list;
            }
            await flvFetch(
              `pages/${page_id}/property/${property_id}`,
              "PATCH",
              {
                value: {
                  page_list: value.page_list,
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
  {#if option.only === true}
    {@const page_id =
      value.page_list.length !== 0 ? value.page_list[0] : undefined}
    {#if page_id !== undefined}
      <div>{rdb_page_list.find((v) => v._id === page_id)?.title}</div>
    {/if}
  {:else}
    {#each value.page_list as page_id}
      <div>{rdb_page_list.find((v) => v._id === page_id)?.title}</div>
    {/each}
  {/if}
</Button>
