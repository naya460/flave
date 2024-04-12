import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

export async function getPageList(arg: {
  workspace_id?: ObjectId | string;
  parent?: ObjectId | string;
}) {
  const { workspace_id, parent } = arg;

  const filter: {
    workspace?: ObjectId;
    parent?: ObjectId | { $exists: boolean };
  } = {};
  if (workspace_id !== undefined) {
    filter.workspace = new ObjectId(workspace_id);
  }
  if (parent === undefined) {
    filter.parent = { $exists: false };
  } else {
    filter.parent = new ObjectId(parent);
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
