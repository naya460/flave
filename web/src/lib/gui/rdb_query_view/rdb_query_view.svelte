<script lang="ts">
  import Table from "../rdb_view/table/table.svelte";
  import { RdbList } from "./rdb_list";
  import Frame from "./frame.svelte";
  import Query from "./query/query.svelte";
  import { RdbQuery } from "./query/query";

  export let workspace_id: string;

  let rdb_list = new RdbList(workspace_id);

  let rdb_query = new RdbQuery();
</script>

<Query {rdb_list} {rdb_query} />

<Frame>
  <div slot="heading">RESULT</div>
  <div slot="contents">
    <Table
      rdb_id={null}
      menu_enable={false}
      {rdb_query}
      set_menu={() => {}}
      add_page={() => {}}
      filters={[]}
    />
  </div>
</Frame>
