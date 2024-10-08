<script lang="ts">
  import FlavePage from "$lib/gui/page/FlavePage.svelte";
  import type { Writable } from "svelte/store";
  import type { PageData } from "./$types";
  import {
    main_page_path_id,
    type main_page_path_type,
    main_page_title_id,
    type main_page_title_type,
  } from "../+layout.svelte";
  import { getContext, onMount } from "svelte";

  export let data: PageData;

  let page_path: Writable<string[]>;
  let page_title: Writable<string>;

  let main_page_path: main_page_path_type = getContext(main_page_path_id);
  let main_page_title: main_page_title_type = getContext(main_page_title_id);

  onMount(() => {
    page_path.subscribe((v) => {
      main_page_path.set(v);
    });
    page_title.subscribe((v) => {
      main_page_title.set(v);
    });
  });
</script>

<FlavePage
  workspace_id={data.workspace_id}
  page_id={data.page_id}
  bind:page_path
  bind:page_title
/>
