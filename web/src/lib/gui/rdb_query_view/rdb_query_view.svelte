<script lang="ts">
  import Table from "../rdb_view/table/table.svelte";
  import { RdbList } from "./rdb_list";
  import Frame from "./frame.svelte";
  import Query from "./query/query.svelte";
  import { RdbFromClause } from "./query/from";

  export let workspace_id: string;

  let rdb_list = new RdbList(workspace_id);

  let rdb_from_clause = new RdbFromClause(null);
</script>

<Query {rdb_list} {rdb_from_clause} />

<Frame>
  <div slot="heading">RESULT</div>
  <div slot="contents">
    <Table
      rdb_id={null}
      menu_enable={false}
      property_list={$rdb_from_clause.properties}
      constraints={$rdb_from_clause.constraints}
      page_list={$rdb_from_clause.page_list}
      set_menu={() => {}}
      add_page={() => {}}
    />
  </div>
</Frame>
