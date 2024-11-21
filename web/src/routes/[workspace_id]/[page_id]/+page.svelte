<script lang="ts">
  import FlavePage from "$lib/gui/page/FlavePage.svelte";
  import type { Writable } from "svelte/store";
  import type { PageData } from "./$types";
  import {
    main_page_path_id,
    type main_page_path_type,
  } from "../+layout.svelte";
  import { getContext, onMount } from "svelte";

  export let data: PageData;

  let page_path: Writable<string[]>;

  let main_page_path: main_page_path_type = getContext(main_page_path_id);

  onMount(() => {
    page_path.subscribe((v) => {
      main_page_path.set(v);
    });
  });
</script>

<FlavePage
  workspace_id={data.workspace_id}
  page_id={data.page_id}
  bind:page_path
/>
