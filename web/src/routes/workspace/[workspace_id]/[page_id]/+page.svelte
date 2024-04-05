<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<div>{data.page_data.title}</div>
