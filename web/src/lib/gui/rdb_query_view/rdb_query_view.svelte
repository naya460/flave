<script lang="ts">
  import Table from "../rdb_view/table/table.svelte";
  import { RdbList } from "./rdb_list";
  import { RdbPageList } from "./rdb_page_list";
  import Frame from "./frame.svelte";
  import Query from "./query/query.svelte";
  import { RdbFromClause } from "./query/from";

  export let workspace_id: string;

  let rdb_list = new RdbList(workspace_id);

  let rdb_from_clause = new RdbFromClause(null);

  let rdb_page_list: RdbPageList = new RdbPageList(null);
</script>

<Query {rdb_list} {rdb_from_clause} {rdb_page_list} />

<Frame>
  <div slot="heading">RESULT</div>
  <div slot="contents">
    {#if $rdb_from_clause.rdb_id !== null && $rdb_page_list.rdb_id !== null}
      <Table
        rdb_id={$rdb_from_clause.rdb_id}
        menu_enable={false}
        property_list={$rdb_from_clause.properties}
        constraints={$rdb_from_clause.constraints}
        {rdb_page_list}
        set_menu={() => {}}
      />
    {/if}
  </div>
</Frame>
