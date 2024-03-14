<script lang="ts">
  export let style: "filled" | "outline" | "text" = "filled";
</script>

<button
  class="main"
  class:filled={style === "filled"}
  class:outline={style === "outline"}
  class:text={style === "text"}
>
  <slot />
</button>

<style>
  .main {
    appearance: none;
    outline: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    user-select: none;
  }

  .filled {
    background-color: rgb(39, 177, 106);
    color: rgb(255, 255, 255);
    height: 2rem;
    border-radius: 0.5rem;
    padding: 0 1.2rem;
  }

  .filled:active {
    background-color: rgb(44, 153, 97);
  }

  .text {
    background: none;
    padding: 0.3rem 0.5rem;
    border-radius: 0.4rem;
  }

  .text:hover,
  .text:focus {
    background-color: rgb(248, 248, 248);
  }

  .text:active {
    background-color: rgb(238, 238, 238);
  }
</style>
