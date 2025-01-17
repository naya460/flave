<script lang="ts">
  import Button from "$lib/gui/common/Button.svelte";
  import ContextMenu from "$lib/gui/common/ContextMenu.svelte";
  import TextInput from "$lib/gui/common/TextInput.svelte";
  import Frame from "../frame.svelte";
  import type { RdbWhereClause } from "./where";

  export let where_clause: RdbWhereClause;

  let id_hidden = true;

  const heading_style = {
    buttonStyle: "outline",
    buttonDarker: true,
    width: "1.5rem",
    height: "1.5rem",
  } as const;
</script>

<Frame>
  <div slot="heading" style:display="flex" style:gap="1rem">
    <div>WHERE</div>
    <div style:gap="1rem">
      <Button
        style={heading_style}
        on:click={() => {
          where_clause.addCondition({ id: "", value: undefined });
        }}
      >
        +
      </Button>
    </div>
  </div>
  <div slot="contents">
    {#each $where_clause.conditions as condition, index}
      {@const target_property = $where_clause.resources.properties.find(
        (v) => v.id === condition.id
      )}
      <div class="line">
        <!-- id -->
        <div>
          <Button
            style={{
              buttonStyle: "outline",
              width: "15rem",
              height: "2.5rem",
            }}
            on:click={() => {
              id_hidden = false;
            }}
          >
            <div class="select">
              <div>
                {target_property?.name === undefined
                  ? ""
                  : target_property.name}
              </div>
              <div>v</div>
            </div>
          </Button>
          <ContextMenu bind:hidden={id_hidden}>
            {#each $where_clause.resources.properties as property}
              <Button
                style={{
                  buttonStyle: "text",
                  width: "100%",
                  height: "2rem",
                  textAlign: "left",
                }}
                on:click={() => {
                  where_clause.editCondition(index, {
                    ...condition,
                    id: property.id,
                  });
                  id_hidden = true;
                }}
              >
                {property.name}
              </Button>
            {/each}
          </ContextMenu>
        </div>
        <div>=</div>
        <!-- value -->
        <div>
          {#if target_property?.type === "text"}
            <TextInput
              onChange={(event) => {
                where_clause.editCondition(index, {
                  ...condition,
                  value: event.currentTarget.value,
                });
              }}
            />
          {:else if target_property?.type === "checkbox"}
            <input
              type="checkbox"
              on:change={(event) => {
                where_clause.editCondition(index, {
                  ...condition,
                  value: event.currentTarget.checked,
                });
              }}
            />
          {/if}
        </div>
      </div>
    {/each}
  </div>
</Frame>

<style>
  .select {
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 0.2rem 0.5rem;
  }

  .line {
    display: flex;
    flex-direction: row;
    margin-top: 0.5rem;
    align-items: center;
  }
</style>
