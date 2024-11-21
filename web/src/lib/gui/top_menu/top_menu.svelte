<script lang="ts">
  import UserHeader from "./user_header.svelte";
  import WorkspaceList from "./workspace_list.svelte";

  export let user_name: string;
  export let workspace_list: {
    _id: string;
    name: string;
  }[];
</script>

<div class="top">
  <UserHeader {user_name} />
  <WorkspaceList {workspace_list} />
</div>

<style>
  .top {
    width: min(40rem, 90%);
    margin: auto;
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 1rem;
  }
</style>
