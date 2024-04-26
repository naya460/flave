<script lang="ts">
  export let type: "text" | "password" = "text";
  export let style: {
    outline: boolean;
    fontSize: string;
  } = {
    outline: true,
    fontSize: "1rem",
  };
  export let id: string | undefined = undefined;
  export let name: string | undefined = undefined;
  export let autocomplete: "on" | "off" = "off";
  export let value: string = "";
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

<input
  {type}
  {id}
  {name}
  {autocomplete}
  {value}
  style:font-size={style.fontSize}
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
    padding: 0.25rem 0.5rem;
    border-radius: 0.2rem;
    width: 100%;
    box-sizing: border-box;
  }

  .outline {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4);
  }
</style>
