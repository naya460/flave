<script lang="ts">
  import RdbQueryView from "$lib/gui/rdb_query_view/rdb_query_view.svelte";
  import type { PageData } from "../$types";
  export let data: PageData;
</script>

<RdbQueryView workspace_id={data.workspace_id} />
