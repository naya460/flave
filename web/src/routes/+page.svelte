<script lang="ts">
  let n = 0;
  function a(b: number, c: number) {
    return b + c;
  }
</script>

<h1>Welcome to SvelteKit</h1>
<p>
  Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
<p>{n}</p>
<button
  on:click={() => {
    n = a(n, 1);
  }}>button</button
>
