<script lang="ts">
  export let type: "text" | "password" = "text";
  export let style: {
    outline?: boolean;
    fontSize?: string;
    padding?:
      | `${number}${"px" | "%" | "rem"}`
      | `${`${number}${"px" | "%" | "rem"} ${number}${"px" | "%" | "rem"}`}`;
  } = {
    outline: true,
    fontSize: "1rem",
    padding: "0.25rem 0.5rem",
  };
  export let id: string | undefined = undefined;
  export let name: string | undefined = undefined;
  export let autocomplete: "on" | "off" = "off";
  export let value: string = "";
  export let autofocus: boolean = false;
  export let dom: HTMLInputElement | undefined = undefined;
  export let onChange: (
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => void = () => {};
  export let onKeyDown: (
    event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }
  ) => void = () => {};
  export let onKeyUp: (
    event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }
  ) => void = () => {};
</script>

<!-- svelte-ignore a11y-autofocus -->
<input
  bind:this={dom}
  {type}
  {id}
  {name}
  {autocomplete}
  {value}
  {autofocus}
  style:font-size={style.fontSize}
  style:padding={style.padding}
  class="input"
  class:outline={style.outline}
  on:change={onChange}
  on:keydown={onKeyDown}
  on:keyup|preventDefault={onKeyUp}
/>

<style>
  .input {
    outline: none;
    border: none;
    font-size: 1rem;
    border-radius: 0.2rem;
    width: 100%;
    box-sizing: border-box;
  }

  .outline {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4);
  }
</style>
