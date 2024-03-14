<script lang="ts">
  export let style: "filled" | "outline" | undefined = undefined;
</script>

<button
  class="main"
  class:filled={style === "filled"}
  class:outline={style === "outline"}><slot /></button
>

<style>
  .main {
    appearance: none;
    outline: none;
    border: none;
    font-size: 1rem;
    cursor: pointer;
  }

  .filled {
    background-color: rgb(39, 126, 69);
    color: rgb(255, 255, 255);
    height: 2rem;
    border-radius: 1rem;
  }
</style>
