<script lang="ts">
  import type { RdbList } from "../rdb_list";
  import type { RdbPageList } from "../rdb_page_list";
  import { RdbFromClause } from "./from";
  import From from "./from.svelte";
  import Select from "./select.svelte";

  export let rdb_list: RdbList;

  export let rdb_from_clause: RdbFromClause;

  export let rdb_page_list: RdbPageList;
</script>

<Select property_list={$rdb_from_clause.properties} />

<From {rdb_list} {rdb_from_clause} {rdb_page_list} />
