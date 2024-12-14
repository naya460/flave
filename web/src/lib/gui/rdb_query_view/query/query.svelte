<script lang="ts">
  import type { RdbList } from "../rdb_list";
  import { RdbFromClause } from "./from";
  import From from "./from.svelte";
  // import Select from "./select.svelte";

  export let rdb_list: RdbList;

  export let rdb_from_clause: RdbFromClause;
</script>

<!-- <Select property_list={$rdb_from_clause.properties} /> -->

<From {rdb_list} {rdb_from_clause} />
