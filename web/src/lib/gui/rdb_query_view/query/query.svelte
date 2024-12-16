<script lang="ts">
  import type { RdbList } from "../rdb_list";
  import { RdbFromClause } from "./from";
  import From from "./from.svelte";
  import type { RdbResourcesType } from "./rdb_resources";
  import Select from "./select.svelte";

  export let rdb_list: RdbList;

  let rdb_from_clause = new RdbFromClause(null);

  export let update_resources: (v: RdbResourcesType) => void;
</script>

<Select {rdb_from_clause} {update_resources} />

<From {rdb_list} {rdb_from_clause} />
