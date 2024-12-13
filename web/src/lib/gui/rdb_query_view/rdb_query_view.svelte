<script lang="ts">
  import Table from "../rdb_view/table/table.svelte";
  import { RdbList } from "./rdb_list";
  import { RdbData } from "./rdb_data/rdb_data";
  import { RdbPageList } from "./rdb_page_list";
  import Frame from "./frame.svelte";
  import Query from "./query/query.svelte";

  export let workspace_id: string;

  let rdb_list = new RdbList(workspace_id);

  let rdb_data = new RdbData(null);
  let property_list = rdb_data.getPropertyList();

  let rdb_page_list: RdbPageList = new RdbPageList(null);
</script>

<Query {rdb_list} {rdb_data} {property_list} {rdb_page_list} />

<Frame>
  <div slot="heading">RESULT</div>
  <div slot="contents">
    {#if $rdb_data.rdb_id !== null && $rdb_page_list.rdb_id !== null}
      <Table
        rdb_id={$rdb_data.rdb_id}
        menu_enable={false}
        {property_list}
        {rdb_data}
        {rdb_page_list}
        set_menu={() => {}}
      />
    {/if}
  </div>
</Frame>
