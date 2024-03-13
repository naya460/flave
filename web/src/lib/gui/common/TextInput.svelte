<script lang="ts">
  export let type: "text" | "password" = "text";
  export let id: string | undefined = undefined;
  export let name: string | undefined = undefined;
  export let autocomplete: "on" | "off" = "off";
</script>

<input {type} {id} {name} {autocomplete} class="input" />

<style>
  .input {
    outline: none;
    border: none;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4);
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.2rem;
  }
</style>
