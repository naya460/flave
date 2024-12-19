import { flvFileCollection } from "mongo/collections/flave/file";
import { ObjectId } from "mongodb";

export async function getFileData(file_id: ObjectId) {
  return await flvFileCollection.findOne(
    { _id: file_id },
    { projection: { workspace: true, type: true, data: true } }
  );
}
