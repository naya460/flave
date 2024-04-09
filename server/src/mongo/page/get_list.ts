import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

export async function getPageList(workspace_id: ObjectId | string) {
  const filter: {
    workspace?: ObjectId;
  } = {};
  if (workspace_id !== undefined) {
    filter.workspace = new ObjectId(workspace_id);
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
