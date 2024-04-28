<script lang="ts">
  export let page_id: string;

  export let block_data: {
    _id: string;
    text: string;
  } | null;

  let own: HTMLDivElement;
  let timeout: number | undefined = undefined;

  async function timeoutHandler() {
    await applyUpdate();
    clearTimeout(timeout);
    timeout = undefined;
  }

  async function applyUpdate() {
    await fetch(`http://${location.hostname}:8080/blocks/${block_data?._id}`, {
      method: "PATCH",
      mode: "cors",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: { text: own.innerText },
      }),
    });
  }
</script>

{#if block_data !== null}
  <div
    class="top"
    contenteditable={true}
    role="textbox"
    tabindex={0}
    bind:this={own}
    on:keydown={(event) => {
      if (!timeout) {
        timeout = setInterval(timeoutHandler, 1000);
      }

      if (event.key === "Enter") {
        fetch(`http://${location.hostname}:8080/blocks`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page_id: page_id,
            next_of: block_data._id,
            type: "paragraph",
            data: { text: "" },
          }),
        });
        event.preventDefault();
      } else if (event.key === "Backspace") {
        if (own.innerText.length === 0) {
          fetch(`http://${location.hostname}:8080/blocks/${block_data._id}`, {
            method: "DELETE",
            mode: "cors",
            credentials: "include",
          });
          event.preventDefault();
        }
      }
    }}
  >
    {block_data.text}
  </div>
{/if}

<style>
  .top {
    outline: none;
  }
</style>
