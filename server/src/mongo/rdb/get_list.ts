import { flvRdbCollection } from "mongo/collections/flave/rdb";
import { ObjectId } from "mongodb";

export async function getRdbList(workspace_id: ObjectId) {
  return await flvRdbCollection
    .find({ workspace: workspace_id }, { projection: { title: true } })
    .toArray();
}
