import { flvBlockCollection } from "mongo/collections/flave/block";
import { ObjectId } from "mongodb";

export async function getBlockData(block_id: string) {
  return await flvBlockCollection.findOne(
    { _id: new ObjectId(block_id) },
    { projection: { page: true, type: true } }
  );
}
