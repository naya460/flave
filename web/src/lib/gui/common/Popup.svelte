<script lang="ts">
  export let hidden: boolean = true;

  const setHidden = () => {
    hidden = true;
  };
</script>

{#if hidden === false}
  <div class="top">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div on:click={setHidden} class="background" />
    <div class="contents">
      <slot />
    </div>
  </div>
{/if}

<style>
  .top {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .background {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .contents {
    position: relative;
    background-color: rgb(255, 255, 255);
    width: 20rem;
    height: 20rem;
    margin: 50%;
    transform: translate(-50%, -50%);
    padding: 1rem;
    box-sizing: border-box;
    border-radius: 0.5rem;
  }
</style>
