<script lang="ts">
  import type { RdbList } from "../rdb_list";
  import From from "./from/from.svelte";
  import type { RdbQuery } from "./query";
  import Select from "./select.svelte";
  import Where from "./where.svelte";

  export let rdb_list: RdbList;

  export let rdb_query: RdbQuery;
</script>

<Select rdb_select_clause={rdb_query.getRdbSelectClause()} />

<From {rdb_list} rdb_from_clause={rdb_query.getRdbQueryClause()} />

<Where where_clause={rdb_query.getRdbWhereClause()} />
