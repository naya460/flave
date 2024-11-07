import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

export async function getPageList(arg: {
  workspace_id?: ObjectId | string;
  parent?: ObjectId | string;
  rdb_id?: ObjectId;
  deleted?: boolean;
}) {
  const { workspace_id, parent } = arg;

  const filter: {
    $and: (
      | { workspace?: ObjectId }
      | { parent?: ObjectId | { $exists: boolean } }
      | { rdb?: ObjectId | { $exists: boolean } }
      | {
          $or: [
            { deleted: { $exists: boolean } },
            { deleted: { $eq: boolean } },
          ];
        }
      | { deleted: boolean }
    )[];
  } = { $and: [] };

  if (workspace_id !== undefined) {
    filter.$and.push({ workspace: new ObjectId(workspace_id) });
  }

  if (parent === undefined) {
    filter.$and.push({ parent: { $exists: false } });
  } else {
    filter.$and.push({ parent: new ObjectId(parent) });
  }

  if (arg.rdb_id === undefined) {
    filter.$and.push({ rdb: { $exists: false } });
  } else {
    filter.$and.push({ rdb: new ObjectId(arg.rdb_id) });
  }

  if (arg.deleted === undefined || arg.deleted === false) {
    filter.$and.push({
      $or: [{ deleted: { $exists: false } }, { deleted: { $eq: false } }],
    });
  } else {
    filter.$and.push({ deleted: true });
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
        properties: true,
        constraints: true,
        deleted: true,
      },
    })
    .toArray();
}
