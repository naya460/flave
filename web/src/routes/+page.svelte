<script lang="ts">
  import TopMenu from "$lib/gui/top_menu/top_menu.svelte";
  import type { PageData } from "./$types";
  export let data: PageData;
</script>

<TopMenu user_name={data.name} workspace_list={data.workspaces} />
