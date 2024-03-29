<script lang="ts">
  import Popup from "./Popup.svelte";
  type T = $$Generic;
  export let items: T[];

  const is_button = $$slots.popup;
  let popup_hidden = true;
  let popup_data: T;

  function showPopup(data: T) {
    if (is_button) {
      popup_hidden = false;
      popup_data = data;
    }
  }
</script>

<div class="top">
  {#each items as item}
    <button class="item" disabled={!is_button} on:click={() => showPopup(item)}>
      <slot name="item" {item} />
    </button>
  {/each}
  <Popup bind:hidden={popup_hidden}>
    <slot name="popup" {popup_data} />
  </Popup>
</div>

<style>
  .top {
    display: grid;
    grid-template-rows: auto;
    gap: 0.4rem;
    margin: 0.4rem 0;
  }

  .item {
    background-color: #ffffff;
    padding: 0.5rem;
    box-shadow: 0 0 1px #000000;
    border-radius: 0.4rem;
    border: none;
    font-size: 1rem;
    text-align: start;
    line-height: 1.5rem;
    color: black;
  }

  .item:hover:not(:disabled) {
    background-color: #f8f8f8;
    cursor: pointer;
  }
</style>
