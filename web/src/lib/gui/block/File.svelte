<script lang="ts">
  import { flvFetch } from "$lib/flv_fetch";
  import { workspace_id_store } from "$lib/store/workspace";
  import Button from "../common/Button.svelte";
  import ContextMenu from "../common/ContextMenu.svelte";

  export let own: HTMLDivElement;

  export let block_data: {
    _id: string;
    file_id: string;
  };

  function onChange(
    v: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    const files = v.currentTarget.files;

    if (files !== null) {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        const data = reader.result;

        const res = flvFetch(`files`, "POST", {
          workspace_id: $workspace_id_store,
          type: "image",
          data,
        });

        if (typeof data === "string") {
          image_data = data;
        }

        res.then((v) => {
          if (v.ok) {
            v.text().then((v) => {
              block_data.file_id = v;

              flvFetch(`blocks/${block_data._id}`, "PATCH", {
                data: {
                  file_id: v,
                },
              });
            });
          }
        });
      });

      reader.readAsDataURL(files[0]);

      context_hidden = true;
    }
  }

  async function getFile() {
    if (block_data.file_id === "") return;
    const res = await flvFetch(`files/${block_data.file_id}`, "GET");
    if (res.ok) {
      image_data = (await res.json()).data;
    }
  }

  let context_hidden = true;
  let hovering = false;

  let image_data: string | null = null;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={own}
  class="top"
  on:mouseenter={() => {
    hovering = true;
  }}
  on:mouseleave={() => {
    hovering = false;
  }}
>
  <div class="button">
    {#if hovering}
      <Button
        style={{
          buttonStyle: "outline",
        }}
        on:click={() => {
          context_hidden = false;
        }}
      >
        …
      </Button>
    {/if}
    <div class="context">
      <ContextMenu bind:hidden={context_hidden}>
        <input type="file" accept="image/*" on:change={onChange} />
      </ContextMenu>
    </div>
  </div>
  {#await getFile() then}
    {#if image_data === null}
      <div>File is not uploaded.</div>
    {:else}
      <img alt="" src={image_data} class="image" />
    {/if}
  {/await}
</div>

<style>
  .top {
    position: relative;
    width: 100%;
  }

  .button {
    position: absolute;
    right: 0;
  }

  .context {
    position: absolute;
    right: 20rem;
  }

  .image {
    width: 100%;
    right: 0;
  }
</style>
