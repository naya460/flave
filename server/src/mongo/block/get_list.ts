import { flvBlockCollection } from "mongo/collections/flave/block";
import { ObjectId } from "mongodb";

export async function getBlockList(page_id: ObjectId) {
  return await flvBlockCollection
    .find(
      { page: page_id },
      {
        projection: {
          next_of: true,
          type: true,
          data: true,
        },
      }
    )
    .toArray();
}
