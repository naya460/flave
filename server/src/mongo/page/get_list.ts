import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

export async function getPageList(arg: {
  workspace_id?: ObjectId | string;
  parent?: ObjectId | string;
  rdb_id?: ObjectId;
}) {
  const { workspace_id, parent } = arg;

  const filter: {
    workspace?: ObjectId;
    parent?: ObjectId | { $exists: boolean };
    rdb?: ObjectId | { $exists: boolean };
  } = {};

  if (workspace_id !== undefined) {
    filter.workspace = new ObjectId(workspace_id);
  }

  if (parent === undefined) {
    filter.parent = { $exists: false };
  } else {
    filter.parent = new ObjectId(parent);
  }

  if (arg.rdb_id === undefined) {
    filter.rdb = { $exists: false };
  } else {
    filter.rdb = new ObjectId(arg.rdb_id);
  }

  return await flvPageCollection
    .find(filter, {
      projection: {
        title: true,
        workspace: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
      },
    })
    .toArray();
}
