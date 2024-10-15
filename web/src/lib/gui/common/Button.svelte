<script lang="ts">
  export let style: {
    buttonStyle: "filled" | "outline" | "text";
    buttonDarker?: boolean;
    textAlign?: "left" | "right" | "center";
    width?: "auto" | `${number}${"px" | "rem" | "%"}`;
    height?: "auto" | `${number}${"px" | "rem" | "%"}`;
    boxSizing?: "border-box" | "content-box";
  } = {
    buttonDarker: false,
    buttonStyle: "filled",
  };
</script>

<button
  on:click
  on:mouseenter
  on:mouseleave
  class={`main ${style.buttonDarker ? "darker" : ""}`}
  class:filled={style.buttonStyle === "filled"}
  class:outline={style.buttonStyle === "outline"}
  class:text={style.buttonStyle === "text"}
  style:text-align={style.textAlign}
  style:width={style.width}
  style:height={style.height}
  style:box-sizing={style.boxSizing}
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

  .text.darker:hover,
  .text.darker.hover {
    background-color: rgb(238, 238, 238);
  }

  .text:active {
    background-color: rgb(238, 238, 238);
  }

  .text.darker:active {
    background-color: rgb(228, 228, 228);
  }
</style>
