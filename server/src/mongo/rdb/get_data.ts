import { flvRdbCollection } from "mongo/collections/flave/rdb";
import { ObjectId } from "mongodb";

export async function getRdbData(rdb_id: ObjectId) {
  return await flvRdbCollection.findOne(
    { _id: rdb_id },
    { projection: { title: true, workspace: true } }
  );
}
