<script lang="ts">
  import Table from "../rdb_view/table/table.svelte";
  import { RdbList } from "./rdb_list";
  import Frame from "./frame.svelte";
  import Query from "./query/query.svelte";
  import type { RdbResourcesType } from "./query/rdb_resources";

  export let workspace_id: string;

  let rdb_list = new RdbList(workspace_id);

  let rdb_resources: RdbResourcesType = {
    properties: [],
    constraints: [],
    page_list: [],
  };
</script>

<Query {rdb_list} update_resources={(v) => (rdb_resources = v)} />

<Frame>
  <div slot="heading">RESULT</div>
  <div slot="contents">
    <Table
      rdb_id={null}
      menu_enable={false}
      property_list={rdb_resources.properties}
      constraints={rdb_resources.constraints}
      page_list={rdb_resources.page_list}
      set_menu={() => {}}
      add_page={() => {}}
    />
  </div>
</Frame>
