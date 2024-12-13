<script lang="ts">
  import type { FiltablePropertyList } from "../rdb_data/filtable_property_list";
  import type { RdbData } from "../rdb_data/rdb_data";
  import type { RdbList } from "../rdb_list";
  import type { RdbPageList } from "../rdb_page_list";
  import From from "./from.svelte";
  import Select from "./select.svelte";

  export let rdb_list: RdbList;

  export let rdb_data: RdbData;
  export let property_list: FiltablePropertyList;

  export let rdb_page_list: RdbPageList;
</script>

<Select {property_list} />

<From {rdb_list} {rdb_data} {rdb_page_list} />
